import * as vscode from 'vscode';

function runCommandInTerminal(command: string) {
	const terminal = vscode.window.createTerminal({ name: "My Terminal" });

	terminal.show();
	terminal.sendText(command);
}

function isRunAllowed(filepath: string): boolean {
	return filepath.startsWith("~/arcadia");
}

function runFormatOnActiveFile() {
	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	const document = activeEditor.document;
	const filePath = document.uri.fsPath;
	
	if (isRunAllowed(filePath)) {
	   runCommandInTerminal('ya tool tt format ' + filePath);
	   vscode.window.showInformationMessage('ya format executed');
	   return;
	} 

	vscode.window.showErrorMessage('File is not in arcadia');
}

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('auto-yaformat.formatFile', () => runFormatOnActiveFile);



	context.subscriptions.push(disposable);
}

export function deactivate() {}
