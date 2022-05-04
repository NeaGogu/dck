// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { AxiosError } from 'axios';
import * as vscode from 'vscode';
const axios = require('axios').default;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dck" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('dck.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from duck-comments!');
	});

	let insertDuckFact = vscode.commands.registerCommand('dck.insertDuckFact', async () => {
		
			const editor = vscode.window.activeTextEditor;
			
			if(!editor) {
				console.log("No editor available!");
				
				return;
			}

			//  get duck facts

			// let config = vscode.workspace.getConfiguration();
			// let newPos = new vscode.Position(editor.selection.active.line === 0 ? 0 : editor.selection.active.line - 1, 0);
			let newPos = new vscode.Position(editor.selection.active.line, 0);
			let fact = await getFact();

			editor.edit(async (editBuilder: vscode.TextEditorEdit) => {

				let duckFact = "\n🦆🦆" + fact + "🦆🦆\n";
				editBuilder.insert(newPos, duckFact);
				console.log("Inserted");
			
			});

			vscode.commands.executeCommand("cursorMove",
			{
					to: "up", by:'wrappedLine', value:1
			});

			vscode.commands.executeCommand("cursorMove",
			{
					to: "wrappedLineEnd", by:'wrappedLine'
			});

			vscode.commands.executeCommand('editor.action.addCommentLine');
			

	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(insertDuckFact);
}


type GetFactResponse = {
	
		image: string,
		fact: string,

};

async function getFact() {
	let factData: GetFactResponse;
  try {

		let URL = "https://some-random-api.ml/animal/kangaroo";
    // 👇️ const data: GetUsersResponse
    const { data, status } = await axios.get(URL);
		
		// let factData = JSON.stringify(data, null, 4);
		factData = data;

    // 👇️ "response status is: 200"
    console.log('response status is: ', status);
    return factData.fact;

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.log('error message: ', error.message);
      return error.message;
    } else {
      console.log('unexpected error: ', error);
      return 'An unexpected error occurred';
    }
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
