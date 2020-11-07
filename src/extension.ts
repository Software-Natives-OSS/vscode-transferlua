// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as transferLua from '@softwarenatives/transferlua';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-softwarenatives-transferlua" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vscode-softwarenatives-transferlua.helloWorld', () => {
		const fileContent = vscode.window.activeTextEditor?.document.getText();
		if (fileContent) {
			try {
				const tl = new transferLua.TransferLua("TransferLuaTest", { force: true });
				tl.sendChunk('vscodeExtension', 'Machine', fileContent, { options: transferLua.OPTION_EXECUTE });
				vscode.window.showInformationMessage(`Transferring Lua script download successful`);
				tl.close();
			}
			catch (err) {
				vscode.window.showErrorMessage(`Transferring Lua script failed: ${err}`);
			}
		} else {
			vscode.window.showWarningMessage('Transferring Lua script failed because no active editor window!');
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
