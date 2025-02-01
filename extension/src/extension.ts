import * as vscode from "vscode";
import { MainViewProvider } from "./views/main";

export function activate(context: vscode.ExtensionContext) {
  try {
    const view = new MainViewProvider(
      context.extensionPath,
      context.extensionUri
    );

    context.subscriptions.push(
      vscode.window.registerWebviewViewProvider(
        MainViewProvider.viewType,
        view,
        {
          webviewOptions: {
            retainContextWhenHidden: true,
          },
        }
      )
    );
  } catch (error) {}
}

export function deactivate() {}
