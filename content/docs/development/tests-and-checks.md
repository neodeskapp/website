---
title: Tests and checks
description: The Go tests, the web app's tests, the contract suite, the local gate that runs everything before a commit, and the repository's own checks.
order: 3
---

Before you open a pull request, build what you changed and run its tests. The full checks run on GitHub for every pull request, see [CI workflows](/docs/development/ci). The [local gate](#the-local-gate) runs most of them on your machine in one go.

## Go tests

In `neodesk-server`:

```bash
go vet ./...
go test -race -count=1 -timeout 30m ./...
```

With the race detector the console package alone takes longer than `go test`'s default limit of ten minutes, hence `-timeout 30m`. CI deals the packages out to six runners. For a change in a few packages, run only theirs, for example:

```bash
go test -race -count=1 ./console/updater/... ./cli/...
```

`govulncheck ./...` checks the Go dependencies for known vulnerabilities, as CI does. Install it with:

```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
```

### PostgreSQL

The database tests always run on SQLite. They also run on PostgreSQL when `NEODESK_TEST_POSTGRES_DSN` names a server; each test gets a schema of its own there. Without the variable those tests skip. A throwaway server in Docker:

```bash
docker run -d --name nd-test-pg -p 127.0.0.1:5432:5432 \
  -e POSTGRES_USER=neodesk -e POSTGRES_DB=neodesk -e POSTGRES_PASSWORD=test-only \
  postgres:16-alpine
NEODESK_TEST_POSTGRES_DSN='postgres://neodesk:test-only@127.0.0.1:5432/neodesk?sslmode=disable' \
  go test -count=1 ./...
```

### Security suite

```bash
bash scripts/run-security-suite.sh
```

On Windows, `pwsh ./scripts/run-security-suite.ps1`. It runs the Go tests of the connection security in `relay`, `sessiongrant`, `crypto` and `auth`: relay tickets, session grants, the server's signature of its ID key, and tokens. They run inside the test process and need no server.

## The web app's tests

In `web-ui`:

```bash
npx -y npm@11.6.2 ci
npm run lint
npm run check
npm test
npm run build
```

| Script | What it runs |
|--------|--------------|
| `lint` | ESLint and Prettier. |
| `check` | svelte-check; warnings fail it. |
| `test` | The unit tests (Vitest). |
| `build` | The build, which also fails on a bundled npm package with a license the console may not ship. |
| `e2e` | The end-to-end tests (Playwright, Chromium and Firefox) against a running console. |

`npm audit --audit-level=high` is part of CI too: a high or critical advisory fails it.

The end-to-end tests need a console at `ND_URL` with test accounts named `e2e_admin`, `e2e_super_admin`, `e2e_server_admin`, `e2e_global_admin`, `e2e_operator` and `e2e_viewer`, which share one password. Give it in `E2E_PASSWORD`, or in a file named by `E2E_PASSWORD_FILE`. The tests of a role whose account is missing are skipped.

## The contract suite

`neodesk-server/console/contract` checks the console's HTTP answers from the outside. Its goldens are recorded answers of the old Node.js console and serve as the specification for the Go console. A golden changes only when a fix changes an answer on purpose. The suite has two layers:

- **Matrix:** one request to every console route for each of nine roles, from signed out to `admin`. It shows who may call what and what a refusal looks like.
- **Cases:** hand-written requests per route group, with real parameters and bodies.

A route that neither layer reaches fails the suite. The test files carry the build tag `contract`, so `go test ./...` does not run them. Against a console you started yourself:

```bash
cd neodesk-server/console/contract
ND_URL=http://localhost:5000 go test -tags contract -count=1 -run '^TestCases$/^devices$'
```

The suite signs in as `e2e_<role>` accounts, with the password in the file `ND_PASSWORD_FILE` names. The matrix writes to every route it reaches, so use a fresh, throwaway console. Writing cases, recording goldens and the other variables are in [the suite's README](https://github.com/neodeskapp/neodesk/blob/main/neodesk-server/console/contract/README.md).

## The local gate

The local gate runs the checks listed below on your machine and, with its hooks on, blocks a commit or a push when one fails. GitHub Actions never runs it: it refuses to start there.

### Tools it needs

- Node.js 22 or newer with npm 11
- Go, as `neodesk-server/go.mod` asks, and `govulncheck`
- Docker with the Compose plugin and a running daemon; the gate pulls `postgres:16-alpine`
- Bash and ShellCheck (Git for Windows brings Bash), PowerShell, ripgrep, gitleaks and Trivy
- Python and `pip-audit`, for the Python SDK and the bridges

### Turn on the hooks

```bash
bash scripts/setup-local-gates.sh
```

```powershell
.\scripts\setup-local-gates.ps1
```

The setup checks that the tools are there, then sets `core.hooksPath=.githooks` in this clone's Git configuration and nothing else. From then on `pre-commit` and `pre-push` run the gate. `git commit --no-verify` skips a hook, but then the gate did not pass.

### Run it

```bash
bash scripts/local-gate.sh
```

```powershell
.\scripts\local-gate.ps1
```

Both call `go run ./cmd/repotool local-gate` in `neodesk-server`. `--preflight-only` (`-PreflightOnly`) only checks the tools, and `--dry-run` (`-DryRun`) lists the stages without running them, which is not a pass.

What it runs:

- The version check and `git diff --check`.
- Clean npm installs and audits of the web app and the Node.js SDK, the language check, the provenance check, the web app's unit tests and type check, and the SDK's tests.
- Python: compiling the bridges and the SDK, the SDK's tests and `pip-audit` of each requirements file.
- `go vet`, the Go tests with the race detector, `govulncheck`, a build with `--help`, builds for linux/amd64, linux/arm64 and windows/amd64, and the PostgreSQL tests against a temporary PostgreSQL container.
- gitleaks, the sensitive path check and a Trivy scan of the source tree.
- The installers: Bash syntax, ShellCheck, their test scripts, the `--help` paths and the PowerShell parse check.
- Docker: every compose file, a build of both images, a smoke test of the image on SQLite and on PostgreSQL, Trivy scans of both images and the hardened bind mount test.

The report goes to `.local-test-results/latest.json` and `latest.md`, with a dated copy of each; `--report-dir` or `NEODESK_LOCAL_GATE_REPORT_DIR` picks another folder. Each check ends in one of these states:

| State | Meaning |
|-------|---------|
| `PASS` | The check ran and passed. |
| `FAIL` | The check ran and found a failure, a vulnerability or a leak. |
| `BLOCKED` | A tool, service or test was missing, or a test skipped itself. |
| `OUT_OF_SCOPE` | Something a checkout cannot prove, such as a real RustDesk client or an installer on a real host. |

The gate passes only when every required check passed. Its Docker tests use their own containers and volumes and remove them afterwards. It never runs an installer on your machine or touches an installed NeoDesk; those tests belong on a disposable machine, see [The installers](/docs/development/installers#tests).

## Repository checks

`neodesk-server/cmd/repotool` holds the repository's own checks. Run them in `neodesk-server`, with the check's name in place of `<command>`; `help` lists them:

```bash
go run ./cmd/repotool <command>
```

 Each exits with 0 when it passed, 1 when it found something and 2 when it was called wrongly.

| Command | What it checks |
|---------|----------------|
| `bump-version --verify` | Every file that carries the product version names the one in `VERSION`. See [the product version](/docs/development/releasing#the-product-version). |
| `i18n-check --system console` | The console's language files, see [Check your work](/docs/development/translations#check-your-work). |
| `check-pairing-i18n` | Every language file has the keys of the pairing texts and the sidebar entry for them. |
| `check-js` | No tracked JavaScript file outside `.github/javascript-allowlist.txt`. |
| `check-port-docs` | No script, Go or Markdown file in `neodesk-server` or `scripts` presents port 21120 as a live port; that number never shipped. |
| `check-provenance` | `THIRD_PARTY_NOTICES.md` keeps the short clean-room policy and the SBOM requirement, and `.github/go-server-context.md` makes no unverified provenance claim. See [Clean-room provenance](/docs/development/provenance#safeguards-in-the-repository). |
| `docker-smoke` | Starts the local image `neodesk:local` with new volumes, waits for the API and the console, signs in, runs `neodesk-server check` inside, restarts the container and checks that its API key stayed the same. `--database-type postgres --database-url <url>` runs it on PostgreSQL. |
| `local-gate` | The local gate above. |

gitleaks and two scripts complete the secret scan: the check for private addresses and home folders of build machines, and the check that no installer or unit file in the repository puts a secret into a systemd unit:

```bash
gitleaks detect --source . --config .gitleaks.toml
bash scripts/check-no-sensitive-paths.sh
bash scripts/check-security-regressions.sh
```
