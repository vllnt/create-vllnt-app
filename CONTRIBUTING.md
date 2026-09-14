# Contributing to create-vllnt-app

Thanks for your interest in contributing! This guide explains how to get involved.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Report unacceptable behavior via [Discord](https://bntvllnt.com/discord).

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/vllnt/create-vllnt-app/issues) first
2. Use the [bug report template](https://github.com/vllnt/create-vllnt-app/issues/new?template=bug_report.yml)
3. Include: steps to reproduce, expected vs actual behavior, environment details, relevant logs

### Suggesting Features

1. Check [existing requests](https://github.com/vllnt/create-vllnt-app/issues?q=label%3Aenhancement)
2. Use the [feature request template](https://github.com/vllnt/create-vllnt-app/issues/new?template=feature_request.yml)
3. Describe the problem you're solving, not just the solution

### Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run quality checks:
   ```bash
   pnpm run lint
   pnpm run build
   pnpm test
   ```
5. Commit using [conventional commits](https://www.conventionalcommits.org/):
   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`
   - `chore: maintenance task`
6. Push and open a Pull Request against `main`

## Development Setup

Use Node.js 22.12+ (22.x), 24.x, or 26+ for the Vitest 5 development toolchain.
The CLI runtime still supports Node.js 22+.

The CLI uses TypeScript 7. The website stays on TypeScript 6 and ESLint 9
until its ESLint plugins support the newer major versions. Upgrade Vitest and
`@vitest/coverage-v8` together.

The website reads its locale with Next.js `next/root-params`. Its lint and
typecheck scripts generate the required Next.js types automatically.

```bash
git clone https://github.com/vllnt/create-vllnt-app.git
cd create-vllnt-app
pnpm install
pnpm test
```

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Update tests for any behavior changes
- Update documentation if you change public API
- All CI checks must pass
- Request review from maintainers

## Style Guide

- Follow existing code patterns in the repository
- See [AGENTS.md](AGENTS.md) for detailed conventions
- All code must pass linting and tests before merge

## First-Time Contributors

Look for issues labeled [`good first issue`](https://github.com/vllnt/create-vllnt-app/labels/good%20first%20issue).

## Community

- [Website](https://bntvllnt.com) — about the maintainer and projects
- [Discord](https://bntvllnt.com/discord) — questions, discussion, support
- [GitHub](https://bntvllnt.com/github) — issues, PRs, code
- [X / Twitter](https://bntvllnt.com/x) — updates, DMs for security
- [LinkedIn](https://bntvllnt.com/linkedin) — professional inquiries
- [Book a meeting](https://bntvllnt.com/book) — consultation, collaboration, or anything

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
