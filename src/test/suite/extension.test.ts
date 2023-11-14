import * as vscode from 'vscode';
import * as path from 'path';
import * as assert from 'assert';
import { minifyForTest } from '../../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Test PHP Minify', async () => {
        const uri = vscode.Uri.file(path.join(__dirname, '../../../src/test/suite/demo.php'));
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);

        const minifiedContent = await minifyForTest(false);

        // Check for the absence of block comments, as single-line comments are converted to block comments
        assert.ok(!minifiedContent.includes('/*'), 'Comments were not properly removed');

        // Check that unnecessary whitespace or newlines are removed
        assert.ok(!/\s{2,}/.test(minifiedContent), 'Unnecessary spaces or tabs were not removed');
        assert.ok(!/\n{2,}/.test(minifiedContent), 'Unnecessary newlines were not removed');
    });

    test('Test PHP Minify with URL Comments Preservation', async () => {
        const uri = vscode.Uri.file(path.join(__dirname, '../../../src/test/suite/demo.php'));
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);

        const minifiedContent = await minifyForTest(true);

        // Check for the presence of URL comments in the minified output
        assert.ok(minifiedContent.includes('://'), 'URL comments were not preserved');
    });

    // Additional tests can be added here as needed
    // For example, tests for specific edge cases, different types of PHP structures, etc.

    // Close the editor after tests (optional)
    test('Cleanup', async () => {
        await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    });
});
