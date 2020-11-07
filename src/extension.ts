// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as transferLua from '@softwarenatives/transferlua';
import * as path from 'path';

function getMappings(): any[] {
	const config = vscode.workspace.getConfiguration('transferlua');
	return config.get<any[]>('luastates', []);
}

function pathsMatch(workspaceRelativePath: string, mappedPath: string): boolean {
	// this path in the "native" form, e.g. "Folder/SubFolder" on *nix or "Folder\\SubFolder" on Windows
	const workspacePathParts = workspaceRelativePath.split(path.sep);
	// The mapping path is, by defintion, in *nix format style (so that the configuration can be used cross platform)
	const mappedPathParts = mappedPath.split('/');

	// if mapped is "shorter", it can't match.
	if (mappedPathParts.length <= workspacePathParts.length) {
		// compare the 'mapped path' array with the first few path parts of the 'workspace parts'
		if (mappedPathParts.every((value, index) => workspacePathParts[index] === value)) {
			return true;
		}
	}
	return false;
}

function findLuaState(workspaceRelativePath: string): string
{
	const mappings = getMappings();
	for (const mapping of mappings) {
		for (const mappedPath in mapping) {
			if (pathsMatch(workspaceRelativePath, mappedPath)) {
				return mapping[mappedPath];
			}
		}
	}
	return "";
}

function determineWorkspaceRelativePath(filePath: string | undefined): string {
	let isInWorkspace = false;
	if (vscode.workspace.rootPath && filePath && filePath.startsWith(vscode.workspace.rootPath)) {
		let relativePath = filePath.substr(vscode.workspace.rootPath.length);
		if (relativePath.startsWith(path.sep)) {
			relativePath = relativePath.substr(1);
		}
		return relativePath;
	}
	// not a workspace path
	return filePath ? filePath : "";
}

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

			const workspaceRelativePath = determineWorkspaceRelativePath(vscode.window.activeTextEditor?.document.fileName);
			const luaState = findLuaState(workspaceRelativePath);
			
			try {
				const tl = new transferLua.TransferLua("TransferLuaTest", { force: true });
				tl.sendChunk('vscodeExtension', luaState, fileContent, { options: transferLua.OPTION_EXECUTE });
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
