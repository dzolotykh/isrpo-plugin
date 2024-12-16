import * as vscode from 'vscode';

function runCommandInTerminal(command: string) {
	const terminal = vscode.window.createTerminal({ name: "My Terminal" });

	terminal.show();
	terminal.sendText(command);
}

function isRunAllowed(filepath: string): boolean {
	return filepath.startsWith("~/arcadia");
}

function formatFile(filepath: string) {
	if (isRunAllowed(filepath)) {
		runCommandInTerminal('ya tool tt format ' + filepath);
		vscode.window.showInformationMessage('ya format executed');
		return;
	} 
 
	vscode.window.showErrorMessage('File is not in arcadia');
}

function runFormatOnActiveFile() {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	const document = activeEditor.document;
	const filePath = document.uri.fsPath;

	formatFile(filePath);
}

export function activate(context: vscode.ExtensionContext) {
	const console_command = vscode.commands.registerCommand('auto-yaformat.formatFile', () => runFormatOnActiveFile);
	const on_save_command = vscode.workspace.onDidSaveTextDocument((document) => {
		const filePath = document.uri.fsPath;
		formatFile(filePath);
	})


	context.subscriptions.push(console_command);
	context.subscriptions.push(on_save_command);
}

export function deactivate() {}
