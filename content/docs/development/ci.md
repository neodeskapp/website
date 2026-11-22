---
title: CI workflows
description: The GitHub Actions workflows of the repository, when each one runs, what it checks or publishes, and what to do when one fails.
order: 6
---

The workflows are in `.github/workflows`. Their names here are the ones GitHub Actions shows. The release workflows are described in [Branches, versions and releases](/docs/development/releasing#release-workflows); this page lists them only.

## Checks on pushes and pull requests

These run on pushes to `main` and on pull requests, most of them only when their paths change:

| Workflow | Runs when these change | What it does |
|----------|------------------------|--------------|
| Go Server CI | `neodesk-server/`, `web-ui/` | `go vet` and `govulncheck`; the Go tests with the race detector, dealt out to six runners with 30 minutes per package; the mesh interop tests; and the release build: the web app built, the language files checked with `i18n-check`, the web app embedded and the server built and asked for `-version`. |
| Web UI CI | `web-ui/`, `neodesk-server/protos/` | Installs the web app's packages with npm 11, fails on a high or critical `npm audit` finding, then runs `lint`, `check`, `test` and `build`. |
| Installer CI | the installers, their test scripts, `neodesk-server/cli`, the updater, Docker and compose files | Checks that the top-level scripts are executable in git, parses every Bash installer and runs ShellCheck on it, runs the installer test scripts, parses `neodesk.ps1` on Windows, runs the Go tests of the commands and packages the installers use, runs the `--help` path of each Bash installer, and validates the three compose files. It also tests `scripts/docker-latest.sh`, which decides when the Docker images take `latest`. See [the installers' tests](/docs/development/installers#tests). |
| CDAP SDK CI | `sdks/`, `bridges/`, `neodesk-server/cdap/` | Builds the Node.js SDK, then runs each SDK's example and each bridge with its example config against the gateway (`go test ./cdap/`). |
| Version Verify | any file that carries the version, `CHANGELOG.md`, `neodesk-server/cmd/repotool/` | `bump-version --verify`. |
| Secret Scan | every push and pull request | gitleaks over the files, the sensitive path check, the repotool checks that no script or Go file presents port 21120 as live, of the pairing texts and of JavaScript files, and the security regression check (`scripts/check-security-regressions.sh`, with its own test). |

All of them except Web UI CI cancel a run when a newer push to the same branch or pull request starts one, so a cancelled run is not a failure.

Installer CI has two more jobs that run only when you start it by hand, with an image tag (`latest` by default): the hardened bind mount test, and a runtime smoke test that starts the published image with `docker-compose.quick.single.yml`, checks `/api/health` on 21121 and `/health` on 5000, and runs `neodesk-server check` inside the container.

## Release workflows

| Workflow | When |
|----------|------|
| Version Bump | Every push to `main`, except the bump commits themselves |
| Release Go server | A `v*` tag, a push to `main` that changes the server or the web app, or by hand |
| Build & Release Go Server | Pushes to `main`, `v*` tags, or by hand; keeps its builds as files of the run only |
| Build & Publish Docker Images | Started by Version Bump after each bump on `main`, a pushed `v*` tag, or by hand |

## Scheduled workflows

| Workflow | When | What it does |
|----------|------|--------------|
| CodeQL | Mondays, or by hand | Code scanning for JavaScript and TypeScript, Go, Python, Rust and the workflows. |
| RustDesk Upstream Watch | Monday, Wednesday and Friday, or by hand | Looks for new stable releases of the RustDesk client and server, opens an issue with the label "Next Updates" for each to review, and commits the last seen tags in `config/rustdesk-upstream-watch.json` to `main`. See [The upstream watch](/docs/development/rustdesk-compatibility#the-upstream-watch). |
| Remote Gateway Supply Chain | Mondays, pull requests that touch `remote-gateway/`, or by hand | Checks the pinned upstream source of the remote gateway, its checksums and licenses, and runs the gateway's Go security tests. |
| Remote Gateway Dependency Update | Mondays, or by hand | Opens a pull request into `main` when the pinned gateway source has a newer version. |

Dependabot opens grouped update pull requests every week for the web app's npm packages, the Go modules and the GitHub Actions.

## What one push to main starts

A push to `main` starts Secret Scan, Version Bump, and whichever checks and builds its paths match. The bump commit is pushed with the workflow's own token, which starts no workflow, so Version Bump starts the Docker image build for `main` itself, with the tag `dev`. Go Server CI, Web UI CI and CDAP SDK CI skip a push whose last commit message contains `[version-bump]`.

So one push can show several runs, and when several of them fail, the causes are often unrelated. Look at each run on its own.

## Common failures

**Version Verify: `neodesk.sh: expected X, got Y`.** A file names another version than `VERSION`. In `neodesk-server`:

```bash
go run ./cmd/repotool bump-version --sync
go run ./cmd/repotool bump-version --verify
```

**Secret Scan: leaks found, or a sensitive pattern.** gitleaks found something that looks like a secret, or the sensitive path check found a private address or a home folder of a build machine. Remove it; in examples use addresses such as `203.0.113.10`.

**Web UI CI: install fails.** npm 10, which comes with Node.js 22, can't resolve the web app's dependency tree. Install with `npx -y npm@11.6.2 ci`.

**Web UI CI: `npm audit`.** A package has a high or critical advisory. Update it, or pin a fixed version with `overrides` in `web-ui/package.json`.

**Installer CI: a script is not executable in git.** `./script.sh` would fail in a fresh clone. Fix it with `git update-index --chmod=+x <script>`.

**Version Bump: the push fails.** Another push came first. The workflow rebases and tries five times; when the bump does not rebase cleanly, run the job again once the other push is through.

**Build & Publish Docker Images: the GHCR check fails.** The registry did not hand out push credentials after three tries. That is a GitHub problem, not a build error; run the workflow again later.

**Release Go server: no assets on a tag's release.** Run **Release Go server** for the tag with the channel `stable`.

**A tag without Docker images.** The tag push starts the image build; GitHub starts none for more than three tags pushed at once. Runs of tags take turns, and GitHub cancels a waiting run when another tag's run comes in behind it. Run **Build & Publish Docker Images** by hand on the tag with the tag `latest`, see [On a v* tag](/docs/development/releasing#on-a-v-tag).

## Run the checks locally

The commands behind the required checks, from the root of the checkout:

```bash
(cd neodesk-server && go run ./cmd/repotool bump-version --verify)
(cd neodesk-server && go vet ./... && go test -race -count=1 -timeout 30m ./...)
(cd web-ui && npx -y npm@11.6.2 ci && npm run lint && npm run check && npm test && npm run build)
gitleaks detect --source . --config .gitleaks.toml
bash scripts/check-no-sensitive-paths.sh
bash scripts/check-security-regressions.sh
```

CI runs every check on GitHub, so before a pull request it is enough to run the tests of the parts you changed, see [Tests and checks](/docs/development/tests-and-checks). The [local gate](/docs/development/tests-and-checks#the-local-gate) runs most of these, without the web app's lint, and adds Docker, Trivy and Python checks.
