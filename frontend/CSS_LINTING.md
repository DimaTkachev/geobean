# CSS Linting & Auto-Fix Setup

## Overview

This project is configured with comprehensive CSS linting and auto-fixing capabilities using PostCSS, Stylelint, and Prettier.

## Tools Configured

### PostCSS Plugins

- **postcss-preset-env**: Use future CSS features today
- **autoprefixer**: Automatic vendor prefixes
- **cssnano**: CSS minification for production

### Features Enabled

- CSS Nesting
- Custom Properties (CSS Variables)
- Custom Media Queries
- Media Query Ranges
- Custom Selectors
- Cascade Layers
- Logical Properties

### Linting Tools

- **Stylelint**: CSS linting with standard rules
- **Prettier**: Code formatting
- **Lint-staged**: Run linters on staged files
- **Husky**: Git hooks for pre-commit linting

## Available Scripts

```bash
# Lint CSS files
npm run lint:css

# Fix CSS linting issues
npm run lint:css:fix

# Format CSS files
npm run format:css

# Run all linting (JS + CSS)
npm run lint:all

# Fix all issues (JS + CSS + formatting)
npm run fix:all
```

## Auto-Fix Configuration

### On Save (VS Code)

- Install required extensions:
    - Prettier - Code formatter
    - Stylelint
    - PostCSS Language Support
- Settings are configured in `.vscode/settings.json`

### On Commit

- Husky pre-commit hook runs lint-staged
- Automatically fixes and formats staged files
- Prevents commits with linting errors

## Configuration Files

- `postcss.config.js` - PostCSS plugins and settings
- `.stylelintrc.json` - CSS linting rules
- `.prettierrc.json` - Code formatting rules
- `.browserslistrc` - Browser support targets
- `.vscode/settings.json` - VS Code auto-fix settings
- `.husky/pre-commit` - Git pre-commit hook

## Rules Enforced

### CSS Style Rules

- 2-space indentation
- Single quotes for strings
- Lowercase hex colors
- Short hex notation
- Numeric font weights
- No vendor prefixes (handled by autoprefixer)
- Consistent spacing and formatting

### Modern CSS Features

- CSS Nesting support
- Custom properties (CSS variables)
- Logical properties
- Modern color functions
- Media query ranges
- Custom selectors

## Usage Tips

1. **Write modern CSS** - Use nesting, custom properties, and other modern features
2. **Let tools handle prefixes** - Don't add vendor prefixes manually
3. **Use semantic color names** - Avoid named colors like "red", use hex/rgb/hsl
4. **Consistent formatting** - Let Prettier handle spacing and formatting
5. **Fix on save** - Enable VS Code auto-fix for immediate feedback
