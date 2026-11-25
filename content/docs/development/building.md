---
title: Building from source
description: Build the neodesk-server binary with the web console built in, for your platform or another one, and the Docker images from a checkout.
order: 2
icon: construction
---

NeoDesk is one Go program, `neodesk-server`, that runs the ID server, the relay, the client API and the web console. The console's pages are the web app in `web-ui` (SvelteKit). It is built once and then embedded in the binary, so a build has two steps: the web app with Node.js, then the server with Go. [Architecture](/docs/development/architecture) explains how the parts fit together.

To install a build of your own on a server, you don't need these steps: the installers build from a checkout themselves, see [Install your build](#install-your-build).

## What you need

- Git, and a clone of the repository.
- Go, the version in the `toolchain` line of `neodesk-server/go.mod`.
- Node.js 22.17 or newer, for the web app. Install its packages with npm 11: npm 10, which comes with Node.js 22, can't resolve the web app's dependency tree. `npx -y npm@11.6.2` runs npm 11 without installing it.
- Docker, only to build the images.

## Build the server with the web console

From the root of the checkout:

```bash
cd web-ui
npx -y npm@11.6.2 ci
npm run build

cd ../neodesk-server
go run ./cmd/embed-webui
CGO_ENABLED=0 go build -trimpath -o neodesk-server .
```

On Windows, run the same commands in PowerShell, set `$env:CGO_ENABLED = "0"` before the build and name the output `neodesk-server.exe`.

What the steps do:

- `npm run build` writes the web app to `web-ui/build`. It reads the protocol files in `neodesk-server/protos` to generate the remote viewer's message code, so build from a complete checkout. It also writes the license of every bundled npm package into the build and fails on a license the console may not ship.
- `go run ./cmd/embed-webui` copies `web-ui/build` into `console/webui/dist`, where the binary embeds it from, and records the time of every file so the binary answers with the same `Last-Modified` and `ETag` as the files on disk. `-from <dir>` takes a build from another folder.
- Without the embed step the binary has no web console in it. It then serves the build that `WEB_UI_DIR` names.

## Build for another platform

Go builds for other platforms without extra tools. Run the embed step first, for the machine you build on, then set the target for the build only:

```bash
GOOS=linux   GOARCH=arm64         CGO_ENABLED=0 go build -trimpath -o neodesk-server-linux-arm64 .
GOOS=linux   GOARCH=arm   GOARM=7 CGO_ENABLED=0 go build -trimpath -o neodesk-server-linux-armv7 .
GOOS=windows GOARCH=amd64         CGO_ENABLED=0 go build -trimpath -o neodesk-server-windows-amd64.exe .
```

The releases hold these three and `linux/amd64`.

## Version and commit

`-version` prints the line the updater and the installers read:

```bash
./neodesk-server -version
```

```text
neodesk-server {{VERSION}} (built unknown)
```

A plain build takes its version from `neodesk-server/internal/productversion/VERSION` and knows neither its build time nor its commit. The console's **Updates** page offers no update to a binary without a commit (see [Updating](/docs/operations/updating)). The release workflow sets all three; to do the same, run in `neodesk-server`:

```bash
CGO_ENABLED=0 go build -trimpath \
  -ldflags "-s -w -X main.Version=$(cat VERSION) -X main.Commit=$(git rev-parse HEAD) -X main.BuildDate=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -o neodesk-server .
```

`./neodesk-server -h` lists the flags.

## Work on the web app

`npm run dev` in `web-ui` starts Vite on port 5173. It sends the API, the sockets and the server's own addresses to a NeoDesk console on `http://localhost:5000`; `ND_BACKEND` names another one. A console on the default port since 3.6.0-rc.5 needs `ND_BACKEND=http://localhost:3375`. The pages reload as you edit.

The server has settings for development that read files from disk instead of the binary:

| Setting | What it does |
|---------|--------------|
| `WEB_UI_DIR` | Serves the web app build in this folder instead of the one in the binary. |
| `CONSOLE_STATIC_DIR` | Reads the console's own files (`lang`, `public`, `protos`, `themes`, `config`) from a folder shaped like `neodesk-server/console/static/files`. |
| `CONSOLE_LANG_DIR` | Reads only the language files from this folder. |

[web-ui/README.md](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md) has the web app's scripts, its layout and its rules, and how to run them with the packages in a Docker volume instead of on the host.

`neodesk-server/cmd/devseed` fills a test console with fake devices, users, tickets and more, so the pages have something to show. It writes only into a database that holds its test marker, the row `('devseed_test_stack', '1')` in the `server_config` table, so it never touches a real install. Its commands are described at the top of `cmd/devseed/main.go`.

## Build the Docker images

From the root of the checkout:

```bash
docker build -f docker/Dockerfile -t neodesk:local .
docker build -f docker/Dockerfile.server -t neodesk-server:local .
```

`docker/Dockerfile` is the published `neodesk` image: the server with its web console. `docker/Dockerfile.server` is the same server with the console turned off (`CONSOLE_PORT=0`). Both build the web app and the server inside the build, so the host needs neither Node.js nor Go. `NEODESK_COMMIT_SHA` as a build argument gives the binary its commit.

To run the image with Compose, see [Build the image from the repository](/docs/getting-started/docker#build-the-image-from-the-repository).

## Install your build

The installers take a build instead of a release. Run them from the root of the checkout; they are in its `install/` folder.

- Linux: `--from-source` builds this checkout, and `--binary <file>` installs a binary you built. See [Build from the repository](/docs/getting-started/linux#build-from-the-repository).

  ```bash
  sudo ./install/neodesk.sh --from-source
  ```

- Windows: `-FromSource`, or `-Binary <path>` for a binary you built. See [Build from the repository](/docs/getting-started/windows#build-from-the-repository).

  ```powershell
  .\install\neodesk.ps1 -FromSource
  ```

- Docker: `--build` builds the image and installs it like the published one.

  ```bash
  sudo bash install/neodesk-docker.sh --build
  ```

