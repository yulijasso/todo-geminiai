/**
 * Import Resolution Test
 *
 * This test validates that all imports in the application can be resolved.
 * It prevents build failures due to missing modules.
 */

const fs = require('fs');
const path = require('path');

describe('Import Resolution Tests', () => {
  describe('Page Components', () => {
    test('app/page.js imports should be resolvable', () => {
      const pagePath = path.join(__dirname, '../app/page.js');
      const pageContent = fs.readFileSync(pagePath, 'utf-8');

      // Extract all import statements
      const importRegex = /import\s+.*\s+from\s+['"](.+?)['"]/g;
      const imports = [];
      let match;

      while ((match = importRegex.exec(pageContent)) !== null) {
        imports.push({
          statement: match[0],
          path: match[1],
          line: pageContent.substring(0, match.index).split('\n').length
        });
      }

      const errors = [];

      imports.forEach(({ statement, path: importPath, line }) => {
        // Check local imports (starting with @ or .)
        if (importPath.startsWith('@/') || importPath.startsWith('./') || importPath.startsWith('../')) {
          const resolvedPath = importPath
            .replace('@/', '')
            .replace(/^\.\//, '')
            .replace(/^\.\.\//, '../');

          const possibleExtensions = ['', '.js', '.jsx', '.ts', '.tsx'];
          const possiblePaths = possibleExtensions.map(ext =>
            path.join(__dirname, '..', resolvedPath + ext)
          );

          const exists = possiblePaths.some(p => fs.existsSync(p));

          if (!exists) {
            errors.push({
              line,
              statement,
              importPath,
              message: `Module not found: Cannot resolve '${importPath}'`,
              checkedPaths: possiblePaths
            });
          }
        }
      });

      if (errors.length > 0) {
        const errorMessage = errors.map(err =>
          `Line ${err.line}: ${err.message}\n  Import: ${err.statement}\n  Checked paths: ${err.checkedPaths.map(p => '\n    - ' + p).join('')}`
        ).join('\n\n');

        throw new Error(`Found ${errors.length} unresolvable import(s):\n\n${errorMessage}`);
      }
    });

    test('all @/ alias imports should resolve to existing files', () => {
      const appDir = path.join(__dirname, '../app');
      const files = getAllJsFiles(appDir);
      const errors = [];

      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const importRegex = /import\s+.*\s+from\s+['"](@\/.+?)['"]/g;
        let match;

        while ((match = importRegex.exec(content)) !== null) {
          const importPath = match[1];
          const resolvedPath = importPath.replace('@/', '');
          const line = content.substring(0, match.index).split('\n').length;

          const possibleExtensions = ['', '.js', '.jsx', '.ts', '.tsx'];
          const possiblePaths = possibleExtensions.map(ext =>
            path.join(__dirname, '..', resolvedPath + ext)
          );

          const exists = possiblePaths.some(p => fs.existsSync(p));

          if (!exists) {
            errors.push({
              file: path.relative(path.join(__dirname, '..'), file),
              line,
              importPath,
              message: `Module not found: Cannot resolve '${importPath}'`
            });
          }
        }
      });

      if (errors.length > 0) {
        const errorMessage = errors.map(err =>
          `${err.file}:${err.line} - ${err.message}`
        ).join('\n');

        throw new Error(`Found ${errors.length} unresolvable @/ imports:\n\n${errorMessage}`);
      }
    });
  });

  describe('UI Components', () => {
    test('all ui component imports should exist', () => {
      const uiDir = path.join(__dirname, '../components/ui');

      if (!fs.existsSync(uiDir)) {
        throw new Error('components/ui directory does not exist');
      }

      // Get all imported UI components from the app
      const appDir = path.join(__dirname, '../app');
      const files = getAllJsFiles(appDir);
      const uiImports = new Set();

      files.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const importRegex = /import\s+.*\s+from\s+['"]@\/components\/ui\/(.+?)['"]/g;
        let match;

        while ((match = importRegex.exec(content)) !== null) {
          uiImports.add(match[1]);
        }
      });

      const errors = [];

      uiImports.forEach(componentName => {
        const possibleExtensions = ['.js', '.jsx', '.ts', '.tsx'];
        const exists = possibleExtensions.some(ext =>
          fs.existsSync(path.join(uiDir, componentName + ext))
        );

        if (!exists) {
          errors.push({
            component: componentName,
            expectedPath: `components/ui/${componentName}.{js,jsx,ts,tsx}`,
            message: `UI component file not found`
          });
        }
      });

      if (errors.length > 0) {
        const errorMessage = errors.map(err =>
          `${err.component}: ${err.message}\n  Expected at: ${err.expectedPath}`
        ).join('\n\n');

        throw new Error(`Found ${errors.length} missing UI component(s):\n\n${errorMessage}`);
      }
    });
  });
});

/**
 * Recursively get all JavaScript/TypeScript files in a directory
 */
function getAllJsFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.next') {
      files.push(...getAllJsFiles(fullPath));
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}
