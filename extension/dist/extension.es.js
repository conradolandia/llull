import * as n from "vscode";
class i {
  constructor(e, t) {
    this._extensionPath = e, this._extensionUri = t;
  }
  static viewType = "sveltecode.mainView";
  static _view;
  resolveWebviewView(e, t, o) {
    e.webview.options = {
      enableScripts: !0,
      localResourceRoots: [this._extensionUri]
    }, i._view = e, e.webview.html = this.getWebviewHTML(e.webview);
  }
  getWebviewHTML(e) {
    const t = e.asWebviewUri(
      n.Uri.joinPath(this._extensionUri, "dist", "style.css")
    ), o = e.asWebviewUri(
      n.Uri.joinPath(this._extensionUri, "dist", "webview.umd.js")
    );
    return (
      /*html*/
      `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <link href="${t}" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Extension WebView</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="${o}"><\/script>
          </body>
        </html>`
    );
  }
}
function r(s) {
  try {
    const e = new i(
      s.extensionPath,
      s.extensionUri
    );
    s.subscriptions.push(
      n.window.registerWebviewViewProvider(
        i.viewType,
        e,
        {
          webviewOptions: {
            retainContextWhenHidden: !0
          }
        }
      )
    );
  } catch {
  }
}
function a() {
}
export {
  r as activate,
  a as deactivate
};
