var l=Object.create;var r=Object.defineProperty;var w=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,b=Object.prototype.hasOwnProperty;var m=(i,e)=>{for(var t in e)r(i,t,{get:e[t],enumerable:!0})},c=(i,e,t,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of p(e))!b.call(i,s)&&s!==t&&r(i,s,{get:()=>e[s],enumerable:!(o=w(e,s))||o.enumerable});return i};var a=(i,e,t)=>(t=i!=null?l(h(i)):{},c(e||!i||!i.__esModule?r(t,"default",{value:i,enumerable:!0}):t,i)),x=i=>c(r({},"__esModule",{value:!0}),i);var W={};m(W,{activate:()=>u,deactivate:()=>U});module.exports=x(W);var d=a(require("vscode"));var v=a(require("vscode")),n=class i{constructor(e,t){this._extensionPath=e;this._extensionUri=t}static viewType="sveltecode.mainView";static _view;resolveWebviewView(e,t,o){e.webview.options={enableScripts:!0,localResourceRoots:[this._extensionUri]},i._view=e,e.webview.html=this.getWebviewHTML(e.webview)}getWebviewHTML(e){let t=e.asWebviewUri(v.Uri.joinPath(this._extensionUri,"dist","style.css")),o=e.asWebviewUri(v.Uri.joinPath(this._extensionUri,"dist","webview.umd.js"));return`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <link href="${t}" rel="stylesheet">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Extension WebView</title>
          </head>
          <body>
            <div id="app"></div>
            <script type="module" src="${o}"></script>
          </body>
        </html>`}};function u(i){try{let e=new n(i.extensionPath,i.extensionUri);i.subscriptions.push(d.window.registerWebviewViewProvider(n.viewType,e,{webviewOptions:{retainContextWhenHidden:!0}}))}catch{}}function U(){}0&&(module.exports={activate,deactivate});
