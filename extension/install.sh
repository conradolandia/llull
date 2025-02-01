#!/bin/bash

EXTENSION_ID="nvms.svelte-vscode-extension-boilerplate"

# Uninstall the previous version
code --uninstall-extension $EXTENSION_ID

# Build the extension and webview
npm run build
(cd ../webview && npm run build)

# Remove any existing VSIX packages and package the new version
rm -f *.vsix
npm run package

# Install the new version
EXTENSION_FILE=$(ls *.vsix 2>/dev/null)

if [ -n "$EXTENSION_FILE" ]; then
    code --install-extension "$EXTENSION_FILE"
fi
