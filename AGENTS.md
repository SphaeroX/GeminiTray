# Agent Directives & Workflow Guidelines

Whenever an AI agent makes code changes or fixes bugs in this repository, follow these guidelines strictly:

1. **Version Bumping**: Increment the `version` field in `package.json` by `0.001` on every code change.
2. **Build Validation**: Always execute `npm run build` to validate the TypeScript compilation and Electron build after any modifications.
3. **Git Commit**: Commit all changes with Conventional Commit messages in English.
4. **Automatic Release**: Immediately following a successful `git commit`, automatically execute `npm run release` (runs `./tag-release.ps1`) to create the version tag (`vX.Y.Z`) and push both commits and tags to GitHub (`git push origin main --tags`) to trigger the GitHub Actions release workflow.
