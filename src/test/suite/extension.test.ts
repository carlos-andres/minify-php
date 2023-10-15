import * as vscode from 'vscode';
import * as path from 'path';
import * as assert from 'assert';
import { minifyForTest } from '../../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Test PHP Minify', async () => {

        const uri = vscode.Uri.file(path.join(__dirname, '../../../src/test/suite/demo.php'));

        // Open the demo.php file
        const document = await vscode.workspace.openTextDocument(uri);
        await vscode.window.showTextDocument(document);

        // Get the minified content using our function
        const minifiedContent = await minifyForTest(false);  // Passing false means "Do NOT preserve comments"

        // Check if the minified content doesn't contain any comments
        assert.ok(!minifiedContent.includes('//'), 'Single line comments were not removed');
        assert.ok(!minifiedContent.includes('/*'), 'Multi-line comments start tag was not removed');
        assert.ok(!minifiedContent.includes('*/'), 'Multi-line comments end tag was not removed');

        // Check that unnecessary whitespace or newlines are removed (excluding necessary ones, such as within strings)
        assert.ok(!minifiedContent.includes('  '), 'Unnecessary spaces were not removed');
        assert.ok(!minifiedContent.includes('\n\n'), 'Unnecessary newlines were not removed');
        
        // Close the editor (optional)
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
});