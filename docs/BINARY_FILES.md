# Binary Files in Pull Requests

This repository should contain source code and documentation only.

## Why this matters
Some PR tooling used in this project rejects binary diffs with the message:

`Binärdateien werden nicht unterstützt`.

To keep PR creation reliable, do not commit generated binaries or release artifacts.

## Do not commit
- Compiled binaries (`*.exe`, `*.dll`, `*.so`, `*.dylib`, `*.bin`)
- Build output folders (`dist/`, `build/`)
- Archive artifacts (`*.zip`, `*.tar`, `*.tar.gz`, `*.tgz`, `*.7z`)

## If a binary file was added by mistake
Remove it from Git history of your branch before opening a PR:

```bash
git rm --cached <path-to-binary>
```

Then commit and push again.
