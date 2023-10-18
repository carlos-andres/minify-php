# PHP Minifier for VSCode

This extension provides the capability to minify PHP source code by removing comments, unnecessary spaces, and reducing it to a single line. It's ideal for copying and pasting PHP code into modern AI prompts.

## Features

- Minify active PHP files in the editor.
- Option to preserve or remove comments during minification.
- Warning when attempting to minify non-PHP files.
- Minify and automatically enable word wrap in the editor.
- Minify and copy the result to the clipboard.

## Usage

1. Open a PHP file in VSCode.
2. Use the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).

### Minify PHP

Choose `Minify PHP`.
- You will be prompted with the option to preserve comments. Choose `Yes`, `No`, or `Cancel`.
- If you choose `Yes` or `No`, your PHP file will be minified accordingly. If you choose `Cancel`, the operation will be aborted.

### Minify and Wrap PHP

Choose `Minify and Wrap PHP`.
- Similar to `Minify PHP`, you will be prompted to preserve comments.
- After minification, word wrap will be enabled in the editor.

### Minify and Copy PHP

Choose `Minify and Copy PHP`.
- After choosing whether to preserve comments, the PHP file will be minified, and the result will be copied to your clipboard. An information message will notify you once the minified PHP is copied.

## Contributing

Contributions are welcome! If you have improvements, bug fixes, or new features, please create a pull request.

## License

[MIT License](LICENSE)

---
