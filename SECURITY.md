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

The full audit still reports the development-only `eslint-config-next` →
`@next/eslint-plugin-next` → `fast-glob` → `micromatch` → `braces` chain.
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
has no patched braces release at this snapshot. Do not process untrusted glob
patterns with this tooling. This finding is unresolved, not suppressed. Track
an upstream compatible fix rather than downgrading Next.js or disabling lint.
Jest 30 removes the affected chain from the test runner; lint retains it.
