---
title: The installers
description: For work on the install scripts: what each one does, where it gets the server from, the rules every installer keeps, and how they are tested.
order: 8
icon: install_desktop
---

The repository has four install scripts, in its `install/` folder next to the three compose files. This page is for changing them. How to install with them is in [Install with Docker](/docs/getting-started/docker), [Install on Linux](/docs/getting-started/linux) and [Install on Windows](/docs/getting-started/windows).

## The scripts

| Script | Runs on | What it does |
|--------|---------|--------------|
| `install.sh` | Linux | The one-line installer. By default it fetches `neodesk-docker.sh` and installs with Docker; `--native` fetches `neodesk.sh` and runs it with `--auto`. |
| `neodesk.sh` | Linux | Installs `neodesk-server` as the systemd service `neodesk-server`, and updates, repairs, backs up, diagnoses and removes it. |
| `neodesk.ps1` | Windows | The same on Windows, with the Windows service `NeoDeskServer`, which `neodesk-server.exe` is itself. |
| `neodesk-docker.sh` | Linux with Docker | Runs the published image `ghcr.io/neodeskapp/neodesk` in one container, with `docker-compose.yml` and `.env` in `/opt/neodesk/docker`. |

Every release carries the four scripts and the three compose files as files of its own, listed in the release's `SHA256SUMS`, which `SHA256SUMS.sig` signs with the release key. The public install commands fetch them from neode.sk, which leads to the newest release that has them. No script takes its files from the `main` branch any more.

`install.sh` takes the other scripts from the first of these that applies: the release folder `RELEASE_BASE_URL` names; a branch's `install/` folder with `--branch` or `NEODESK_BRANCH`, for development, where a native install also clones that branch; the files next to it when it runs from a file that has them, such as a checkout's `install/` folder; else the release of its own version, or of `--version`, checked against that release's `SHA256SUMS`. `--channel stable|dev` picks the release channel of a native install.

Both native installers keep a copy of themselves for later runs: `neodesk.sh` as the command `/usr/local/sbin/neodesk-setup`, `neodesk.ps1` as `C:\NeoDesk\neodesk.ps1`. Run from a download or a checkout, an install or update saves the file it runs from. Run from that copy, or piped from curl, it takes the script of the release it installs and checks it against the release's `SHA256SUMS` and the list's signature (`verify-release --sums` of the installed server, or on Linux `openssl` with the release key in the script); a release without the script, or a copy that fails the check, leaves the saved copy as it is. `install.sh` and `neodesk-docker.sh` check the SHA-256 of what they fetch against the release's list.

`neodesk.sh` also puts the command line on the machine: `/usr/local/bin/neodesk`, a copy of the server binary that root owns and every user may run. It hands the installer's options to `neodesk-setup`. Up to 3.6.0-rc.4 the installer's copy was `/usr/local/sbin/neodesk`; the next run as root removes it. `neodesk.ps1` puts `bin\neodesk.exe`, a link to the server binary, on the machine's Path.

Work that both native installers need lives in the server binary as commands, so Bash and PowerShell don't each carry a copy:

| Command | What the installers use it for |
|---------|--------------------------------|
| `neodesk-server check` | The health check after a start: the API's and the console's health addresses and the signal and relay ports. |
| `neodesk-server backup` | The backup before an update or an uninstall. |
| `neodesk-server env merge` | Writes the env file from the template built into the binary on a fresh install, and on an update adds only the keys it lacks. |
| `neodesk-server config check`, `config set` | The capability report and the allowlisted settings, see [Configuration commands](#configuration-commands). |
| `neodesk-server reset-password` | A new password for an account, read from standard input. |
| `neodesk-server cert` | The self-signed certificate of an install. |
| `neodesk-server verify-release` | Checks a downloaded binary against the release's signed manifest, or with `--sums` an installer or compose file against the release's signed `SHA256SUMS`. |
| `neodesk-server migrate` | Moves a database between SQLite and PostgreSQL. |
| `neodesk-server upgrade-env` | Adds what the server needs to the env file the installer wrote, such as `CONSOLE_PORT` and the pinned ports, and comments out what it doesn't use. |

## Where the server comes from

`neodesk.sh` and `neodesk.ps1` install one of three things:

- **The release of the update channel** (the default). While the repository has no stable release, the stable channel takes the newest pre-release, or the development build when there is no pre-release either; the script says which. They download the binary for the machine, check its SHA-256 and check it against the release's signed `manifest.json` and `manifest.sig`. An installed server checks the signature with `verify-release`. On Linux without one, `openssl` checks it with the release key in the script. A first install on Windows checks only the SHA-256 over HTTPS, since Windows has no tool for the signature before the server is installed. `--skip-verify` (`-SkipVerify`) skips the checks.
- **A binary you give:** `--binary <file>` (`-Binary <path>`).
- **A build of the checkout the script runs in:** `--from-source` (`-FromSource`). It needs Go, and Node.js unless `web-ui/build` exists. The Go the installers download or accept for this build must be the toolchain `neodesk-server/go.mod` names; `scripts/check-go-toolchain-pins.sh` checks that. Both find the checkout one folder above `install/`.

`neodesk-docker.sh` pulls the image tag from `.env` (`NEODESK_IMAGE_TAG`, `latest` by default), uses an image already on the machine with `--no-pull`, or builds one from the checkout it sits in with `--build`. It takes its compose file and the new copy of itself from the release of the image tag, the newest release for `latest`; for a tag of 3.6.0-rc.4 or older, which have no such files, it takes the compose file from the repository at that tag. When Docker is missing it installs it with Docker's script from get.docker.com; `--no-install-docker` stops with an error instead.

## The installer contract

Every installer offers these operations, or refuses one with a clear message and a non-zero exit code:

1. **Preflight:** checks the platform, privileges, dependencies, writable folders, free disk space, the ports and network access. `--check-permissions` reports what the console can do on this install: update, change settings, restart, repair permissions, back up and check health.
2. **Fresh install:** creates only the folders and services it needs, keeps secrets the operator gave, sets up the chosen database, sets `PANEL_PUBLIC_HOST` to the address the admin gives or the one it detects, and ends with a health check. Both native installers open the same ports: 21115 to 21117 TCP and 21116 UDP, the client API port 21121, 21122 unless the env file sets `CDAP_ENABLED=N`, and the console's ports unless `TRUST_PROXY` is on because a reverse proxy sits in front. See [Ports and firewall](/docs/operations/ports).
3. **Update:** gets a complete, checked binary or image, keeps the data and settings, restarts the service and checks it. `neodesk-docker.sh` backs up the data first and goes back to the old image when the new container does not get healthy.
4. **Repair:** puts back missing binaries, permissions, service definitions and TLS files. `--repair-permissions` can run any number of times and never deletes a database, keys or Docker volumes.
5. **Diagnose:** reports errors and warnings without changing anything.
6. **Backup:** `neodesk-server backup` copies the database consistently (SQLite or PostgreSQL), the env file, the console's data and the certificates.
7. **Uninstall:** removes every service or task the installer created and keeps the data. Only `--purge` (`-Purge`) also deletes the data and keys, or the volumes in Docker.
8. **Reinstall:** works after an uninstall without `--purge` and keeps that state.

An operation counts as done only when the script exits with 0, the installed version is the deployed code, the service runs under its intended account, the health checks pass, the database, keys and settings still work, and running it again creates no second service, rule, file or data. When an operation fails, the previous binary and settings stay usable.

Rules for every change:

- Never overwrite a value in an existing env file with a template value.
- Never remove a database, keys, volumes or firewall rules without a confirmation or a purge flag.
- Never give a sudoers rule that runs a script from the repository as root. A restart from the console ends the `neodesk-server` process, and the supervisor the installer names in `NEODESK_SUPERVISOR` starts it again: the systemd unit on Linux, the Windows service's recovery settings on Windows, Docker's restart policy in the image.
- Never report success after a partial update just because the process restarted.

### Configuration commands

The console and the installers change settings only through an allowlist: every key in the env template `neodesk-server/console/managedconfig/env.example`. Paths, ports and switches are checked, the env file is backed up before the write, and unknown keys are refused. `neodesk-server config check` prints the capability report as JSON and exits with 1 when a part is not ready. The allowlist is compiled into the binary; after you change `env.example`, run this in `neodesk-server/console/managedconfig`:

```bash
go generate
```

```bash
sudo neodesk-setup --check-permissions
sudo neodesk-setup --repair-permissions
sudo neodesk-setup --set-config HTTPS_ENABLED=true --set-config HTTPS_PORT=5443
```

```powershell
& 'C:\NeoDesk\neodesk.ps1' -CheckPermissions
& 'C:\NeoDesk\neodesk.ps1' -RepairPermissions
& 'C:\NeoDesk\neodesk.ps1' -SetConfig "HTTPS_ENABLED=true","HTTPS_PORT=5443"
```

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh --check-permissions
sudo bash /opt/neodesk/docker/neodesk-docker.sh --repair-permissions
sudo bash /opt/neodesk/docker/neodesk-docker.sh --set-config LOG_LEVEL=info
```

The console has the same report at `GET /api/settings/management/capabilities` and the allowlisted settings at `GET` and `PUT /api/settings/management/config`. `PUT` refuses the keys that are set on the host only; see [Protect the secrets](/docs/operations/security#protect-the-secrets).

### Health checks

`neodesk-server check` is the same check on every platform. It asks each health address for a 2xx answer, or a 3xx with a `Location`, checks over HTTPS that the certificate is valid for the host, and connects to each `--port`. It prints one `PASS` or `FAIL` line per check and exits with 1 when one failed. `--insecure` skips the certificate check, for a self-signed certificate.

```bash
neodesk-server check \
  --api http://127.0.0.1:21114/api/health \
  --panel http://127.0.0.1:3375/health \
  --port 127.0.0.1:21116 --port 127.0.0.1:21117
```

On Linux and Windows the API is on 21114 and the client API on 21121. In Docker the API is on 21121. The console is on 3375, or 5443 with HTTPS. Installs from before 3.6.0-rc.5 keep 5000, because their env file names it: an install whose settings name a port keeps it.

## Menus

`neodesk.sh` and `neodesk.ps1` show arrow-key menus when they run in a terminal, and a numbered list otherwise. `NEODESK_CLASSIC_MENU=1` forces the numbered list; `neodesk.ps1` also uses it in auto mode and when its input or output is redirected. Only the menus use arrow keys; questions for a host name, port, password or path are plain prompts. `neodesk-docker.sh` takes commands (`install`, `update`, `status`, `logs`, `backup`, `reset-password`, `postgres`, `uninstall`), and `menu` offers the same commands as a menu.

Each installer carries the product version in its version line, which the version bump writes, see [the product version](/docs/development/releasing#the-product-version).

## Tests

These run in Installer CI without changing the machine they run on. The [local gate](/docs/development/tests-and-checks#the-local-gate) runs them too, except the Windows installer's test:

| Test | What it covers |
|------|----------------|
| `bash -n` and `shellcheck --severity=error` | Every Bash installer and test script. |
| `--help` of `install.sh`, `neodesk.sh` and `neodesk-docker.sh` | The help paths, which must not change the host. |
| `scripts/test-go-installer.sh` | `neodesk.sh`'s functions: reading the units, writing the one unit, the settings, the update and its way back, and the commands it installs, in a temporary folder without systemd. |
| `scripts/test-native-installer.sh` | `neodesk.sh`'s watchdog for long Go commands and its recovery of a broken clone. |
| `scripts/test-postgresql-hba.sh` | The PostgreSQL `pg_hba.conf` setup. |
| `scripts/test-docker-installer.sh` | `neodesk-docker.sh`'s functions, with stand-ins for `docker`, `curl`, `ss` and `id`, followed by `scripts/test-docker-entrypoint.sh` for the image's start scripts, the Dockerfiles and the compose files. |
| `scripts/test-windows-installer.ps1` | `neodesk.ps1`'s service set-up, also the move of an older install's NSSM service or scheduled task to the service, with stand-ins for the service manager, scheduled tasks and `icacls`. It runs under PowerShell on Linux too. |
| `scripts/check-supervisor-env.sh` | The systemd unit and the image name their supervisor. |
| `scripts/check-go-toolchain-pins.sh` | The Go versions of the installers and the Docker builds match `go.mod`. |
| PowerShell parse | `neodesk.ps1` parses without errors. |
| `go test ./cli/... ./console/safepath/... ./console/updater/...` | The server commands the installers call, the path checks and the updater. |

`scripts/test-docker-hardening.sh` needs Docker: it runs an image with hardened bind mounts and restarts it. Installer CI runs it with the image of the checkout, or, started by hand with a tag, with that published image; the local gate runs it against `neodesk:local`.

Two more scripts install for real and belong on a machine you can throw away, such as the CI runner:

- `scripts/test-setup-command.sh` installs natively through a local stand-in for neode.sk and the releases, checks `neodesk` as a normal user and `neodesk-setup`, updates with `neodesk-setup` and with the old manager of 3.6.0-rc.4 followed by the one manual step, checks the way back after an update that doesn't start, and uninstalls.
- `scripts/test-docker-data-path.sh` updates a Docker install of 3.6.0-rc.4 with data to the image of the checkout, which keeps its data in `/opt/neodesk/data`, and restores backups from before and after the update.

What no script can test is an installer on a real host. Before a release, run each installer on disposable Linux and Windows machines: fresh install, update, repair, backup and restore, uninstall and reinstall, and check that nothing ends up twice (see [the checklist](/docs/development/releasing#before-a-stable-release)).
