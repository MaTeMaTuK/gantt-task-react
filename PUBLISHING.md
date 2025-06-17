# Publishing Guide for @scharinger/gantt-task-react

This guide covers the process of publishing new versions of the package to npm.

## Version Strategy

We follow [Semantic Versioning](https://semver.org/):

- **Patch (0.4.X)**: Bug fixes and small improvements
- **Minor (0.X.0)**: New features, backwards compatible  
- **Major (X.0.0)**: Breaking changes
- **Beta (X.Y.Z-beta.N)**: Pre-release versions for testing

## Prerequisites

1. **npm account**: Make sure you're logged in to npm
   ```bash
   npm whoami  # Check if logged in
   npm login   # Login if needed
   ```

2. **Repository access**: You should have write access to the repository

3. **Clean working directory**: Commit all changes before publishing

## Publishing Steps

### 1. Update Version

Update the version in `package.json`:

```json
{
  "version": "0.4.1-beta.0"  // For beta releases
  // or
  "version": "0.4.1"         // For stable releases
}
```

### 2. Update Documentation

- Update `README.md` if there are new features or API changes
- Update `CHANGELOG.md` (if it exists) with the changes

### 3. Build and Test

```bash
# Build the library
npm run build

# Run tests
npm test

# Test with example project
cd example
npm install
npm start
```

### 4. Publish to NPM

**For beta releases:**
```bash
npm publish --tag beta --access public
```

**For stable releases:**
```bash
npm publish --access public
```

### 5. Create Git Tag (Recommended)

```bash
git tag v0.4.1-beta.0
git push origin v0.4.1-beta.0
```

### 6. Update GitHub Release (Optional)

Create a release on GitHub with:
- Tag version
- Release notes describing changes
- Any breaking changes or migration notes

## Post-Publishing

### Verify Publication

Check that the package is available:

```bash
npm view @scharinger/gantt-task-react versions --json
```

### Test Installation

Test in a fresh project:

```bash
mkdir test-install
cd test-install
npm init -y
npm install @scharinger/gantt-task-react@beta  # or @latest
```

## Installation Commands for Users

After publishing, users can install with:

```bash
# Latest stable version
npm install @scharinger/gantt-task-react

# Beta version
npm install @scharinger/gantt-task-react@beta

# Specific version
npm install @scharinger/gantt-task-react@0.4.0-beta.0
```

## Troubleshooting

### Common Issues

1. **402 Payment Required**: Use `--access public` for scoped packages
2. **403 Forbidden**: Check npm login and package permissions
3. **Version already exists**: Increment version number

### Rollback

If you need to unpublish (only for packages published less than 72 hours ago):

```bash
npm unpublish @scharinger/gantt-task-react@0.4.1-beta.0
```

**Note**: Unpublishing is discouraged and may not be possible for stable releases.

## Automation (Future)

Consider setting up GitHub Actions for automated publishing:

- Automated testing on PR
- Automated beta releases on merge to develop
- Automated stable releases on merge to main
