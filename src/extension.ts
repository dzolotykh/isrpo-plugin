import { execSync } from 'child_process';
import * as vscode from 'vscode';

function runCommandInTerminal(command: string): string {
	command = "cd ~/arcadia && " + command;
	return execSync(command).toString();
}

function isRunAllowed(filepath: string): boolean {
    const pattern = /^\/Users\/[^\/]+\/arcadia\//;
    return pattern.test(filepath);
}


function formatFile(filepath: string, notify: boolean = false) {
	if (isRunAllowed(filepath)) {
		runCommandInTerminal('ya tool tt format ' + filepath);
		if (notify) {
			vscode.window.showInformationMessage('ya format executed');
		}
		return;
	} 
	
	if (notify) {
		vscode.window.showErrorMessage('File is not in arcadia');
	}
}

function runFormatOnActiveFile() {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	const document = activeEditor.document;
	const filePath = document.uri.fsPath;

	formatFile(filePath, true);
}

export function activate(context: vscode.ExtensionContext) {
	const console_command = vscode.commands.registerCommand('auto-yaformat.formatFile', () => runFormatOnActiveFile());
	const on_save_command = vscode.workspace.onDidSaveTextDocument((document) => {
		const filePath = document.uri.fsPath;
		formatFile(filePath, false);
	})


	context.subscriptions.push(console_command);
	context.subscriptions.push(on_save_command);
}

export function deactivate() {}
