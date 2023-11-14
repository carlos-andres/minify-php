# Change Log

All notable changes to the "minify-php" extension are documented in this file.

For more guidance on how to maintain this file, see [Keep a Changelog](http://keepachangelog.com/).

## [0.3.0] -

### Added

- N/A

### Changed

- Handle better the protocols :// and minify options

## [0.2.5] -

### Added

- N/A

### Changed

- Handle better adaptaton to minify code with single line //, i decide to replace it for /* */ to avoid bad php result
  
### Removed

- N/A

## [0.2.0] -

### Added

- Introduced a new command `extension.minifyAndWrapPHP` that not only minifies the PHP code but also turns on the word wrap setting in the editor.
- Added another command `extension.minifyAndCopyPHP` that minifies the PHP document and copies the result to the clipboard.
- Refactored the `minifyActivePHPDocument` function to handle an additional parameter which decides if the word wrap should be turned on after minification.

### Changed

- The original `extension.minifyPHP` command has been updated to ensure that the editor's word wrap setting remains unchanged after the minification process.
- Enhanced the minification process to handle additional edge cases and provide more consistent results.
  
### Removed

- N/A

## [0.1.0] -

### Added

- Initial implementation of the "Minify PHP" command.
  - The command can be triggered via the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and is represented by the `extension.minifyPHP` command.
- A prompt to users asking if they would like to preserve comments when minifying.
- Ability to minify the active PHP document in the editor, with:
  - Removal of multi-line comments.
  - Removal of single-line comments.
  - Reduction of unnecessary spaces.
  - Modification to ensure a space exists after `<?php`.
  - Other potential PHP syntax adjustments for minification.
- A warning is displayed if the user attempts to minify a non-PHP file.
- Basic unit testing structure for testing the minification process (using `minifyForTest`).
- Integration with ESLint for linting TypeScript code, and Mocha for unit testing.

### Changed

- N/A

### Removed

- N/A
