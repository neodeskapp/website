---
title: Branches, versions and releases
description: The main branch, how the product version is bumped, what the release workflows publish, and the checklist before a stable release.
order: 5
---

For maintainers. How a change becomes a development build and a tag becomes a release with binaries and Docker images. How installs pick a channel is in [Updating](/docs/operations/updating#release-channels).

## Branches

`main` is the repository's only branch: the default branch and the target of pull requests. Releases are `v*` tags on it. A tag with a suffix, such as `v3.6.0-rc.1`, is published as a pre-release.

## The product version

The root `VERSION` file holds the product version. The server and its web console report the same one. These files repeat it, and every bump writes all of them:

- `VERSION`, `neodesk-server/VERSION` and `neodesk-server/internal/productversion/VERSION`, which the binary embeds
- the installers: `neodesk.sh`, `neodesk.ps1`, `neodesk-docker.sh` and `install.sh`
- `Dockerfile`, `Dockerfile.server` and `docker/entrypoint.sh`
- `CHANGELOG.md`: the `## [Unreleased]` section becomes the new version's section, with the date and a compare link, and a new empty `## [Unreleased]` opens above it

The SDKs under `sdks/` keep versions of their own.

The bump workflow does this with `repotool` (in `neodesk-server`):

```bash
go run ./cmd/repotool bump-version --verify            # every file names the version in VERSION
go run ./cmd/repotool bump-version --sync              # write VERSION into the files that drifted
go run ./cmd/repotool bump-version --patch             # +0.0.1
go run ./cmd/repotool bump-version --minor             # +0.1.0
go run ./cmd/repotool bump-version --set 3.6.0         # an explicit version, X.Y.Z only
go run ./cmd/repotool bump-version --patch --dry-run   # show the new version, write nothing
go run ./cmd/repotool bump-version --list-paths        # the files a bump writes
```

## Release workflows

### On every push to main

- **Version Bump** bumps the patch version, commits `chore: bump version to X.Y.Z [version-bump]` and pushes it to `main`. When the push meets another one, it rebases and tries again, up to five times. Then it starts **Build & Publish Docker Images** on `main` with the tag `dev`: a push made with the workflow's own token starts no other workflow by itself.
- **Release Go server**, when the push changes `neodesk-server/` or `web-ui/`, replaces the pre-release tagged `dev` with a new build. The development channel installs it.

The development channel and the Docker tag are called `dev`. They name the development build, not a branch; there is no `dev` branch.

### On a v* tag

A stable release or a release candidate comes only from a tag you push. No merge or push to `main` makes one.

1. The tag must be `v` plus the version in `VERSION` at the tagged commit, or **Release Go server** and **Build & Publish Docker Images** stop.
2. **Release Go server** builds the release and publishes it with the release notes GitHub generates. A tag with a suffix, such as `v3.6.0-rc.1`, is published as a pre-release; a tag without one becomes the latest release.
3. **Build & Publish Docker Images** starts on the same tag push and publishes both images, see [Docker images](#docker-images). It starts from the tag, not from the release: a release made with the workflow's own token starts no other workflow.

Push the tag on its own, with the version in place of `<version>`. GitHub starts no workflow when more than three tags are pushed at once.

```bash
git push origin v<version>
```

### What a release holds

**Release Go server** builds the web app once, embeds it, and builds the server for linux/amd64, linux/arm64, linux/armv7 and windows/amd64. The release gets:

- the four binaries, `neodesk-server-<os>-<arch>`, with the web console inside;
- `manifest.json`, with the version, commit, branch, and the SHA-256 and size of every binary;
- `manifest.sig`, the manifest's ed25519 signature;
- `SHA256SUMS`, for `sha256sum -c`.

The signing key is the repository secret `RELEASE_SIGNING_KEY`, an ed25519 private key as a PKCS#8 PEM. Its public half is built into the server and into `neodesk.sh`. The console's updater and the installers refuse a release without a valid signature; only a first install on Windows checks just the SHA-256, because Windows has no tool for the signature before the server is there. Without the secret the workflow stops before it publishes anything. When the repository variable `NEODESK_RELEASE_PUBLIC_KEY` is set, the signature is checked against it too. Before publishing, the workflow checks the release the way the updater does. A release it creates itself starts as a draft and goes public once all its files are there.

While there is no stable release, the stable channel installs the newest pre-release, and the development build only when there is no pre-release either. The manifest's branch field names the update channel, `main` for stable and `dev` for development, as installs store it in `UPDATE_GITHUB_BRANCH`; it is not the git branch.

**Build & Release Go Server** is a separate workflow that builds the server without the web console, and the migration tool, on pushes to `main` and on tags. It keeps them as files of its run and publishes nothing.

### Client releases

The desktop client is released from its own repository, [neodeskapp/neodesk-client](https://github.com/neodeskapp/neodesk-client), with tags `desktop-v<version>`. Its `SHA256SUMS.sig` is signed with the same key, and the console checks it before **Add a computer** and **Quick support** hand out a package.

### Docker images

**Build & Publish Docker Images** builds two images for amd64 and arm64:

- `ghcr.io/neodeskapp/neodesk`: the server with its web console, the image the Docker install runs;
- `ghcr.io/neodeskapp/neodesk-server`: the server with the console turned off.

For `main` it builds only for the bump commits, so an image always carries the version of `main`. A build of `main` gets the tags `dev` and `sha-<commit>`. A `v*` tag gets the version (`3.6.0-rc.1`) and the tag (`v3.6.0-rc.1`), and a stable release also `X.Y`.

`latest` moves to a tag's images when the tag is a stable release, or, while the repository has no stable release, when it is a pre-release and no published pre-release is newer. That is the release the installers install at that point. `latest` never comes from `main`. The step "Decide whether latest moves to this tag" of the run says why it did or did not. Runs of tags take turns, so a later tag decides after the earlier one has published.

When the arm64 build fails, the amd64 image is still published. A manual run on a `v*` tag with the tag `latest` publishes what the tag push publishes; on `main` it is refused.

## Before a stable release

Before you push the tag:

- The commit you tag passed Go Server CI, Web UI CI, Installer CI, Secret Scan and Version Verify.
- The [local gate](/docs/development/tests-and-checks#the-local-gate) passes, or at least the Go tests, the web app's tests and the version check.
- The security suite passes:

  ```bash
  bash scripts/run-security-suite.sh
  ```

- The image built from the checkout starts and is healthy:

  ```bash
  docker compose -f docker-compose.single.yml up -d --build
  curl http://localhost:21121/api/health
  curl http://localhost:5000/health
  ```

- On a disposable Linux machine, an install with `--auto`, then `--update`, then `--uninstall` keeps the data, then a reinstall uses it:

  ```bash
  sudo ./neodesk.sh --auto
  ```
 The same on Windows with `-Auto`, `-Update` and `-Uninstall`, and with `neodesk-docker.sh` for Docker.
- On a disposable install that still runs the Node.js console: `--update` (`-Update`) upgrades it, and `--rollback-go` (`-RollbackGo`) puts it back.
- `neodesk-server check` passes against each install, see [Health checks](/docs/development/installers#health-checks).
- The diff has no secrets, debug output or private addresses.

After the tag:

- The release `vX.Y.Z` exists and has the four binaries, `manifest.json`, `manifest.sig` and `SHA256SUMS`.
- The run of **Build & Publish Docker Images** for the tag published both images with the version tag, and with `latest` when the tag took it.
- Run **Installer CI** by hand with the image tag `X.Y.Z`, for the hardened bind mount and runtime smoke tests.

When a publish step failed, run it again by hand: **Release Go server** on the tag with the channel `stable`, or **Build & Publish Docker Images** on the tag with the tag `latest`.
