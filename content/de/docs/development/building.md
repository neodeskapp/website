---
title: Aus dem Quellcode bauen
description: Das Binary neodesk-server mit eingebauter Web-Konsole für deine oder eine andere Plattform bauen, dazu die Docker-Images aus einem Checkout.
order: 2
---

NeoDesk ist ein einziges Go-Programm, `neodesk-server`, das den ID-Server, das Relay, die Client-API und die Web-Konsole betreibt. Die Seiten der Konsole sind die Web-App in `web-ui` (SvelteKit). Sie wird einmal gebaut und dann in das Binary eingebettet. Ein Build hat also zwei Schritte: zuerst die Web-App mit Node.js, dann den Server mit Go. [Architektur](/docs/development/architecture) erklärt, wie die Teile zusammenpassen.

Um einen eigenen Build auf einem Server zu installieren, brauchst du diese Schritte nicht: Die Installer bauen selbst aus einem Checkout, siehe [Deinen Build installieren](#install-your-build).

## Was du brauchst {#what-you-need}

- Git und einen Klon des Repositorys.
- Go in der Version aus der Zeile `toolchain` in `neodesk-server/go.mod`.
- Node.js 22.17 oder neuer für die Web-App. Installiere ihre Pakete mit npm 11: npm 10, das mit Node.js 22 kommt, kann den Abhängigkeitsbaum der Web-App nicht auflösen. `npx -y npm@11.6.2` startet npm 11, ohne es zu installieren.
- Docker, nur für die Images.

## Den Server mit der Web-Konsole bauen {#build-the-server-with-the-web-console}

Im Wurzelverzeichnis des Checkouts:

```bash
cd web-ui
npx -y npm@11.6.2 ci
npm run build

cd ../neodesk-server
go run ./cmd/embed-webui
CGO_ENABLED=0 go build -trimpath -o neodesk-server .
```

Führe unter Windows dieselben Befehle in PowerShell aus, setze vor dem Build `$env:CGO_ENABLED = "0"` und nenne die Ausgabe `neodesk-server.exe`.

Was die Schritte tun:

- `npm run build` schreibt die Web-App nach `web-ui/build`. Dabei liest es die Protokolldateien in `neodesk-server/protos`, um den Nachrichtencode des Remote-Viewers zu erzeugen; baue also aus einem vollständigen Checkout. Außerdem schreibt es die Lizenz jedes gebündelten npm-Pakets in den Build und bricht bei einer Lizenz ab, die die Konsole nicht ausliefern darf.
- `go run ./cmd/embed-webui` kopiert `web-ui/build` nach `console/webui/dist`, von wo das Binary es einbettet. Es hält die Zeit jeder Datei fest, damit das Binary mit demselben `Last-Modified` und `ETag` antwortet wie die Dateien auf der Festplatte. `-from <dir>` nimmt einen Build aus einem anderen Ordner.
- Ohne den Einbettungsschritt enthält das Binary keine Web-Konsole. Es liefert dann den Build aus, den `WEB_UI_DIR` nennt.

## Für eine andere Plattform bauen {#build-for-another-platform}

Go baut für andere Plattformen ohne zusätzliche Werkzeuge. Führe zuerst den Einbettungsschritt für den Rechner aus, auf dem du baust, und setze dann das Ziel nur für den Build:

```bash
GOOS=linux   GOARCH=arm64         CGO_ENABLED=0 go build -trimpath -o neodesk-server-linux-arm64 .
GOOS=linux   GOARCH=arm   GOARM=7 CGO_ENABLED=0 go build -trimpath -o neodesk-server-linux-armv7 .
GOOS=windows GOARCH=amd64         CGO_ENABLED=0 go build -trimpath -o neodesk-server-windows-amd64.exe .
```

Die Releases enthalten diese drei und `linux/amd64`.

## Version und Commit {#version-and-commit}

`-version` gibt die Zeile aus, die der Updater und die Installer lesen:

```bash
./neodesk-server -version
```

```text
neodesk-server {{VERSION}} (built unknown)
```

Ein einfacher Build nimmt seine Version aus `neodesk-server/internal/productversion/VERSION` und kennt weder seine Build-Zeit noch seinen Commit. Die Seite **Updates** der Konsole bietet einem Binary ohne Commit kein Update an (siehe [Aktualisieren](/docs/operations/updating)). Der Release-Workflow setzt alle drei Werte. Um dasselbe zu tun, führe in `neodesk-server` aus:

```bash
CGO_ENABLED=0 go build -trimpath \
  -ldflags "-s -w -X main.Version=$(cat VERSION) -X main.Commit=$(git rev-parse HEAD) -X main.BuildDate=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  -o neodesk-server .
```

`./neodesk-server -h` listet die Flags auf.

## An der Web-App arbeiten {#work-on-the-web-app}

`npm run dev` in `web-ui` startet Vite auf Port 5173. Es leitet die API, die Sockets und die eigenen Adressen des Servers an eine NeoDesk-Konsole auf `http://localhost:5000` weiter; `ND_BACKEND` nennt eine andere. Die Seiten laden neu, während du bearbeitest.

Der Server hat Einstellungen für die Entwicklung, die Dateien von der Festplatte statt aus dem Binary lesen:

| Einstellung | Was sie macht |
|---------|--------------|
| `WEB_UI_DIR` | Liefert den Build der Web-App in diesem Ordner aus statt den im Binary. |
| `CONSOLE_STATIC_DIR` | Liest die eigenen Dateien der Konsole (`lang`, `public`, `protos`, `themes`, `config`) aus einem Ordner, der wie `neodesk-server/console/static/files` aufgebaut ist. |
| `CONSOLE_LANG_DIR` | Liest nur die Sprachdateien aus diesem Ordner. |

[web-ui/README.md](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md) beschreibt die Skripte, den Aufbau und die Regeln der Web-App und wie du sie mit den Paketen in einem Docker-Volume statt auf dem Host ausführst.

`neodesk-server/cmd/devseed` füllt eine Testkonsole mit erfundenen Geräten, Benutzern, Tickets und mehr, damit die Seiten etwas zu zeigen haben. Es schreibt nur in eine Datenbank, die seine Testmarkierung enthält, die Zeile `('devseed_test_stack', '1')` in der Tabelle `server_config`. So berührt es nie eine echte Installation. Seine Befehle stehen oben in `cmd/devseed/main.go`.

## Die Docker-Images bauen {#build-the-docker-images}

Im Wurzelverzeichnis des Checkouts:

```bash
docker build -t neodesk:local .
docker build -f Dockerfile.server -t neodesk-server:local .
```

`Dockerfile` ist das veröffentlichte Image `neodesk`: der Server mit seiner Web-Konsole. `Dockerfile.server` ist derselbe Server mit ausgeschalteter Konsole (`CONSOLE_PORT=0`). Beide bauen die Web-App und den Server innerhalb des Docker-Builds, der Host braucht also weder Node.js noch Go. `NEODESK_COMMIT_SHA` als Build-Argument gibt dem Binary seinen Commit.

Wie du das Image mit Compose startest, steht unter [Das Image aus dem Repository bauen](/docs/getting-started/docker#build-the-image-from-the-repository).

## Deinen Build installieren {#install-your-build}

Die Installer nehmen statt eines Release einen Build. Führe sie im Checkout aus.

- Linux: `--from-source` baut diesen Checkout, und `--binary <file>` installiert ein Binary, das du gebaut hast. Siehe [Aus dem Repository bauen](/docs/getting-started/linux#build-from-the-repository).

  ```bash
  sudo ./neodesk.sh --from-source
  ```

- Windows: `-FromSource`, oder `-Binary <path>` für ein Binary, das du gebaut hast. Siehe [Aus dem Repository bauen](/docs/getting-started/windows#build-from-the-repository).

  ```powershell
  .\neodesk.ps1 -FromSource
  ```

- Docker: `--build` baut das Image und installiert es wie das veröffentlichte.

  ```bash
  sudo bash neodesk-docker.sh --build
  ```

