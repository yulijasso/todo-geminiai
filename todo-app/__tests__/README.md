# Test Suite Documentation

This directory contains automated tests to prevent build failures and ensure code quality.

## Test Files

### 1. `imports.test.js` - Import Resolution Tests

**Purpose**: Validates that all module imports in the application can be resolved.

**What it catches**:
- Missing component files
- Incorrect import paths
- Broken `@/` alias imports
- Missing UI components

**Example failures caught**:
```
Module not found: Can't resolve '@/components/ui/checkbox'
```

**Run with**:
```bash
npm run test:imports
```

### 2. `build.test.js` - Build Verification Tests

**Purpose**: Ensures the Next.js build process completes successfully.

**What it catches**:
- Module resolution errors
- TypeScript type errors (if configured)
- Build-time compilation failures
- Missing dependencies

**Run with**:
```bash
npm run test:build
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (during development)
```bash
npm run test:watch
```

### Run only import validation (fast)
```bash
npm run test:imports
```

### Run build verification (slower, comprehensive)
```bash
npm run test:build
```

### Run before committing
```bash
npm run precommit
```

## Installing Dependencies

Before running tests for the first time, install the test dependencies:

```bash
npm install
```

## CI/CD Integration

A GitHub Actions workflow has been created at `.github/workflows/test.yml` to automatically run these tests on:
- Every push to any branch
- Every pull request

## How These Tests Prevent the Build Error

The original build error was:
```
Module not found: Can't resolve '@/components/ui/checkbox'
```

**Prevention mechanism**:

1. **Import Tests** (`imports.test.js`):
   - Scans all files in the `app/` directory
   - Extracts all import statements
   - Verifies that files exist for each `@/` import
   - **Fails fast** before you attempt a build

2. **Build Tests** (`build.test.js`):
   - Runs the actual `npm run build` command
   - Captures build errors
   - Provides detailed error messages
   - **Validates the entire build process**

## Best Practices

1. **Run import tests frequently** during development:
   ```bash
   npm run test:imports
   ```

2. **Run full build test** before pushing:
   ```bash
   npm run test:build
   ```

3. **Use watch mode** while coding:
   ```bash
   npm run test:watch
   ```

4. **Check tests pass** before creating a PR - the CI will run them automatically

## Troubleshooting

### Test failures

If `imports.test.js` fails:
- Check the error message for the specific missing file
- Verify the import path is correct
- Ensure the file exists at the expected location
- Check that file extensions are correct (.js, .jsx, .ts, .tsx)

If `build.test.js` fails:
- Run `npm run build` manually to see the full error
- Check for missing dependencies with `npm install`
- Verify all imports are correct
- Check for syntax errors in your code

### Slow build tests

The `build.test.js` can be slow because it runs the full Next.js build. Use `test:imports` for faster feedback during development.

## Adding New Tests

To add new test files:

1. Create a new file in `__tests__/` directory
2. Name it `*.test.js` or `*.spec.js`
3. Jest will automatically discover and run it

Example:
```javascript
// __tests__/my-feature.test.js
describe('My Feature', () => {
  test('should work correctly', () => {
    expect(true).toBe(true);
  });
});
```
