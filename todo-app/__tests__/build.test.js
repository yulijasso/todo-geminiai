/**
 * Build Verification Test
 *
 * This test validates that the Next.js build process completes successfully.
 * It catches module resolution errors, type errors, and other build-time issues.
 */

const { execSync } = require('child_process');
const path = require('path');

describe('Build Verification', () => {
  // Increase timeout for build process
  jest.setTimeout(180000); // 3 minutes

  test('Next.js build should complete without errors', () => {
    const projectRoot = path.join(__dirname, '..');

    let buildOutput = '';
    let buildError = '';

    try {
      buildOutput = execSync('npm run build', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });

      // Check if build was successful
      expect(buildOutput).toContain('Creating an optimized production build');

      // Check for common error indicators
      expect(buildOutput.toLowerCase()).not.toContain('module not found');
      expect(buildOutput.toLowerCase()).not.toContain('cannot resolve');
      expect(buildOutput.toLowerCase()).not.toContain('failed to compile');

    } catch (error) {
      buildError = error.stderr || error.stdout || error.message;

      // Extract specific error information
      const moduleNotFoundMatch = buildError.match(/Module not found: Can't resolve '([^']+)'/);
      const failedWithErrorsMatch = buildError.match(/Turbopack build failed with (\d+) errors?:/);

      if (moduleNotFoundMatch) {
        throw new Error(
          `Build failed due to missing module:\n\n` +
          `  Module: ${moduleNotFoundMatch[1]}\n\n` +
          `This indicates an import statement is trying to load a module that doesn't exist.\n` +
          `Please check:\n` +
          `  1. The file exists at the specified path\n` +
          `  2. The import path is correct\n` +
          `  3. File extensions are properly configured\n\n` +
          `Full error:\n${buildError}`
        );
      }

      if (failedWithErrorsMatch) {
        throw new Error(
          `Build failed with ${failedWithErrorsMatch[1]} error(s):\n\n${buildError}`
        );
      }

      throw new Error(`Build failed:\n\n${buildError}`);
    }
  });

  test('build should not have type errors (if TypeScript is configured)', () => {
    const projectRoot = path.join(__dirname, '..');
    const fs = require('fs');
    const tsconfigPath = path.join(projectRoot, 'tsconfig.json');

    // Only run this test if TypeScript is configured
    if (!fs.existsSync(tsconfigPath)) {
      return; // Skip if no TypeScript
    }

    try {
      const output = execSync('npx tsc --noEmit', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });

      // If we get here, type checking passed
      expect(true).toBe(true);
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || error.message;

      throw new Error(
        `TypeScript compilation failed:\n\n${errorOutput}\n\n` +
        `Please fix the type errors before building.`
      );
    }
  });
});
