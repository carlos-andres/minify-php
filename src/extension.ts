import * as vscode from 'vscode';

/**
 * Activates the extension.
 * 
 * @param {vscode.ExtensionContext} context - The extension context.
 */
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

/**
 * Prompts the user to determine if comments should be preserved.
 * 
 * @returns {Promise<boolean | undefined>} - True if comments should be preserved, false otherwise. Returns undefined on cancel.
 */
async function askPreserveComments(): Promise<boolean | undefined> {
    const answer = await vscode.window.showQuickPick(['Yes', 'No', 'Cancel'], {
        placeHolder: 'Preserve comments?'
    });

    if (answer === 'Cancel' || answer === undefined) {
        return undefined;
    }

    return answer === 'Yes';
}

/**
 * Minifies the active PHP document in the editor.
 * 
 * @param {boolean} preserveComments - Indicates if comments should be preserved in the minified output.
 * @returns {string} - The minified content.
 */
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

/**
 * Updates the word wrap settings in the editor.
 * 
 * @param {('on' | 'off' | 'wordWrapColumn' | 'bounded')} value - The word wrap mode.
 */
function setWordWrap(value: 'on' | 'off' | 'wordWrapColumn' | 'bounded'): void {
    const config = vscode.workspace.getConfiguration();
    config.update('editor.wordWrap', value, true);
}

/**
 * Sets the provided content to the editor.
 * 
 * @param {vscode.TextEditor} editor - The active text editor.
 * @param {string} content - The content to set in the editor.
 */
function setEditorContent(editor: vscode.TextEditor, content: string): void {
    const entireRange = new vscode.Range(editor.document.positionAt(0), editor.document.positionAt(editor.document.getText().length));
    editor.edit((editBuilder) => editBuilder.replace(entireRange, content));
}

/**
 * Minifies the given PHP content.
 * 
 * @param {string} content - The original PHP content.
 * @param {boolean} preserveComments - Indicates if comments should be preserved in the minified output.
 * @returns {string} - The minified content.
 */
function minifyPHPContent(content: string, preserveComments: boolean): string {
    // Remove multi-line comments
    if (!preserveComments) {
        content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // Remove single-line comments
    if (!preserveComments) {
        content = content.replace(/\/\/.*$/gm, '');
    }

    // Remove newlines
    content = content.replace(/\r?\n|\r/g, '');

    // Remove unnecessary spaces (multiple spaces get reduced to one). 
    // This won't affect spaces within strings.
    content = content.replace(/ +/g, ' ');

    // Ensure there's a space after <?php
    content = content.replace(/<\?php(?!\s)/g, '<?php ');

    // Other tokens might also need similar treatment to prevent invalid PHP.
    // Depending on the minification requirements, you might want to add more replacements.
    // For instance, if you'd want a space after '}' (closing brace) to avoid situations 
    // like '}else' after minification, you can add the following:
    content = content.replace(/\}(?![\s\}])/g, '} ');

    return content.trim();
}

/**
 * Minifies the active PHP document for testing purposes.
 * 
 * @param {boolean} preserveComments - Indicates if comments should be preserved in the minified output.
 * @returns {Promise<string>} - The minified content.
 */
export async function minifyForTest(preserveComments: boolean): Promise<string> {
    return minifyActivePHPDocument(preserveComments, false);
}