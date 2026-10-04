# Security policy

## Supported versions

The `main` branch is the supported development line for `startup-dashboard`.

## Reporting a vulnerability

Please report dependency issues, malformed-input crashes, or other security concerns through GitHub's private vulnerability reporting when available, or by opening a minimal public issue without exploit payloads.

For untrusted input, callers should apply reasonable size limits before passing data into this project.

## Dependency audit (2026-10-04)

Next.js is pinned to 16.3.8 to address the critical
[ImageResponse advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j).
The production dependency audit (`npm audit --omit=dev`) reports no known
vulnerabilities at this snapshot; this is not a guarantee about future advisories.

The affected development lint dependency chain is replaced by a repository-owned
`next-root-glob` adapter around MIT-licensed `tinyglobby` 0.2.17. It implements
only the directory glob API used by `@next/eslint-plugin-next` 16.3.8, disables
directory expansion, and strips trailing separators. Other fast-glob APIs are
unsupported; review the override whenever Next.js changes. No lint rule or
audit check is disabled or waived.

The committed tarball resolves reproducibly through npm. Its reviewed source
files are `lint-root-glob-adapter.cjs` and `lint-root-glob-package.json`.
Rebuild with:

```sh
mkdir -p .adapter-build
cp lint-root-glob-adapter.cjs .adapter-build/index.cjs
cp lint-root-glob-package.json .adapter-build/package.json
npm pack ./.adapter-build --pack-destination . --ignore-scripts
```

Regression checks cover literal, wildcard, brace, array, Unicode and
Windows-style directory paths, missing roots, file exclusion, and deeply
nested patterns on a reduced stack. CI retains the original checks and adds
these regressions, lint and the full dependency audit. Full and production
vulnerability audits must be rechecked after each dependency change.
