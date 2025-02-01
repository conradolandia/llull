import * as vscode from "vscode";

export class MainViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "sveltecode.mainView";
  private static _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionPath: string,
    private readonly _extensionUri: vscode.Uri
  ) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    MainViewProvider._view = webviewView;
    webviewView.webview.html = this.getWebviewHTML(webviewView.webview);
  }

  getWebviewHTML(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "style.css")
    );
    const svelteUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "webview.umd.js")
    );

    return /*html*/ `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <link href="${styleUri}" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Extension WebView</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="${svelteUri}"></script>
          </body>
        </html>`;
  }
}
