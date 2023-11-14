import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
    const disposableMinify = vscode.commands.registerCommand('extension.minifyPHP', async () => {
        const shouldPreserveComments = await askPreserveComments();
        if (shouldPreserveComments !== undefined) {
            minifyActivePHPDocument(shouldPreserveComments, false);
        }
    });

    const disposableMinifyAndWrap = vscode.commands.registerCommand('extension.minifyAndWrapPHP', async () => {
        const shouldPreserveComments = await askPreserveComments();
        if (shouldPreserveComments !== undefined) {
            minifyActivePHPDocument(shouldPreserveComments, true);
        }
    });

    const disposableMinifyAndCopy = vscode.commands.registerCommand('extension.minifyAndCopyPHP', async () => {
        const shouldPreserveComments = await askPreserveComments();
        if (shouldPreserveComments !== undefined) {
            const minifiedContent = minifyActivePHPDocument(shouldPreserveComments, false);
            vscode.env.clipboard.writeText(minifiedContent);
            vscode.window.showInformationMessage('Minified PHP copied to clipboard!');
        }
    });

    context.subscriptions.push(disposableMinify, disposableMinifyAndWrap, disposableMinifyAndCopy);
}

async function askPreserveComments(): Promise<boolean | undefined> {
    const answer = await vscode.window.showQuickPick(['Yes', 'No', 'Cancel'], {
        placeHolder: 'Preserve comments?'
    });

    if (answer === 'Cancel' || answer === undefined) {
        return undefined;
    }

    return answer === 'Yes';
}

function minifyActivePHPDocument(preserveComments: boolean, shouldWrap: boolean): string {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return "";
    }
    const document = editor.document;
    if (document.languageId !== 'php') {
        vscode.window.showWarningMessage('Not a PHP file');
        return "";
    }
    const originalContent = document.getText();
    const minifiedContent = minifyPHPContent(originalContent, preserveComments);
    setEditorContent(editor, minifiedContent);
    if (shouldWrap) {
        setWordWrap('on');
    }
    return minifiedContent;
}

function setWordWrap(value: 'on' | 'off' | 'wordWrapColumn' | 'bounded'): void {
    const config = vscode.workspace.getConfiguration();
    config.update('editor.wordWrap', value, true);
}

function setEditorContent(editor: vscode.TextEditor, content: string): void {
    const entireRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(editor.document.getText().length));
    editor.edit((editBuilder) => editBuilder.replace(entireRange, content));
}

function minifyPHPContent(content: string, preserveComments: boolean): string {
    if (!preserveComments) {
        // Logic for minifying without preserving comments
        return content
            .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '')
            .trim()
            .replace(/\n/g, ' ')
            .replace(/\t/g, ' ')
            .replace(/\s{2,}/g, ' ');
    } else {
        // Protect :// protocols
        const protocols: string[] = [];
        content = content.replace(/:\/\/\S+/g, (match) => {
            protocols.push(match);
            return "PROTOCOL_PLACEHOLDER";
        });

        // Transform // comments to block comments, avoiding duplicating existing block tokens
        content = content.replace(/\/\/(?!\/).*$/gm, (match) => {
            const trimmedComment = match.slice(2).trim();
            return `/* ${trimmedComment} */`;
        });

        // Normalize multiline comments
        content = content.replace(/\/\*\*[\s\S]*?\*\//g, (match) => {
            // Remove any additional /* or */ inside the comment
            const cleanedMatch = match.replace(/\/\*|\*\//g, '').trim();
            return '/* ' + cleanedMatch.split('\n').map(s => s.trim()).join(' ') + ' */';
        });

        // Remove unnecessary newlines and spaces
        content = content
            .replace(/\n\s*\n/g, '\n')
            .replace(/([^\n])\n([^\n])/g, '$1 $2')
            .replace(/\{\s*\n\s*\}/g, '{}') // Handle empty blocks
            .replace(/\s{2,}/g, ' ');

        // Restore :// protocols
        protocols.forEach((protocol) => {
            content = content.replace("PROTOCOL_PLACEHOLDER", protocol);
        });

        return content;
    }
}

export async function minifyForTest(preserveComments: boolean): Promise<string> {
    return minifyActivePHPDocument(preserveComments, false);
}