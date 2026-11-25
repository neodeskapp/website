---
title: Branches, Versionen und Releases
description: Der Branch main, wie die Produktversion hochgezählt wird, was die Release-Workflows veröffentlichen und die Checkliste vor einem stabilen Release.
order: 5
---

Für Maintainer. Wie aus einer Änderung ein Entwicklungs-Build wird und aus einem Tag ein Release mit Binaries und Docker-Images. Wie Installationen einen Kanal wählen, steht in [Aktualisieren](/docs/operations/updating#release-channels).

## Branches {#branches}

`main` ist der einzige Branch des Repositorys: der Standard-Branch und das Ziel von Pull Requests. Releases sind `v*`-Tags auf diesem Branch. Ein Tag mit Suffix, etwa `v3.6.0-rc.1`, wird als Pre-Release veröffentlicht.

## Die Produktversion {#the-product-version}

Die Datei `VERSION` im Wurzelordner enthält die Produktversion. Der Server und seine Web-Konsole melden dieselbe. Diese Dateien wiederholen sie, und jeder Bump schreibt sie alle:

- `VERSION`, `neodesk-server/VERSION` und `neodesk-server/internal/productversion/VERSION`, das ins Binary eingebettet wird
- die Installer: `install/neodesk.sh`, `install/neodesk.ps1`, `install/neodesk-docker.sh` und `install/install.sh`
- `docker/Dockerfile`, `docker/Dockerfile.server` und `docker/entrypoint.sh`
- `CHANGELOG.md`: Der Abschnitt `## [Unreleased]` wird zum Abschnitt der neuen Version, mit Datum und Vergleichslink, und darüber beginnt ein neuer, leerer `## [Unreleased]`

Die SDKs unter `sdks/` haben eigene Versionen.

Der Bump-Workflow erledigt das mit `repotool` (in `neodesk-server`):

```bash
go run ./cmd/repotool bump-version --verify            # every file names the version in VERSION
go run ./cmd/repotool bump-version --sync              # write VERSION into the files that drifted
go run ./cmd/repotool bump-version --patch             # +0.0.1
go run ./cmd/repotool bump-version --minor             # +0.1.0
go run ./cmd/repotool bump-version --set 3.6.0-rc.5    # an explicit version, X.Y.Z or X.Y.Z-suffix
go run ./cmd/repotool bump-version --patch --dry-run   # show the new version, write nothing
go run ./cmd/repotool bump-version --list-paths        # the files a bump writes
```

## Release-Workflows {#release-workflows}

### Bei jedem Push auf main {#on-every-push-to-main}

- **Version Bump** erhöht die Patch-Version, committet `chore: bump version to X.Y.Z [version-bump]` und pusht das auf `main`. Trifft der Push auf einen anderen, macht der Workflow einen Rebase und versucht es erneut, bis zu fünfmal. Danach startet er **Build & Publish Docker Images** auf `main` mit dem Tag `dev`, denn ein Push mit dem eigenen Token des Workflows startet von sich aus keinen anderen Workflow.
- **Release Go server** ersetzt, wenn der Push `neodesk-server/`, `web-ui/` oder `install/` ändert, das Pre-Release mit dem Tag `dev` durch einen neuen Build. Der Entwicklungskanal installiert es.

Der Entwicklungskanal und der Docker-Tag heißen `dev`. Sie bezeichnen den Entwicklungs-Build und keinen Branch; einen Branch `dev` gibt es nicht.

### Bei einem v*-Tag {#on-a-v-tag}

Ein stabiles Release oder ein Release Candidate entsteht nur aus einem Tag, den du pushst. Kein Merge und kein Push auf `main` erzeugt eins.

1. Der Tag muss `v` plus die Version in `VERSION` am getaggten Commit sein, sonst brechen **Release Go server** und **Build & Publish Docker Images** ab.
2. **Release Go server** baut das Release und veröffentlicht es mit seinen Release Notes: `release-notes/<tag>.md` aus dem getaggten Commit, gefolgt von jedem Commit seit dem Release davor, eingeklappt, die `release-notes/body.sh` anhängt. Ohne diese Datei nimmt er die Notes, die GitHub erzeugt. Ein Tag mit Suffix, etwa `v3.6.0-rc.1`, wird als Pre-Release veröffentlicht; ein Tag ohne Suffix wird das neueste Release.
3. **Build & Publish Docker Images** startet beim selben Push des Tags und veröffentlicht beide Images, siehe [Docker-Images](#docker-images). Er startet vom Tag aus, nicht vom Release, denn ein Release, das mit dem eigenen Token des Workflows angelegt wurde, startet keinen anderen Workflow.

Pushe den Tag einzeln und setze für `<version>` die Version ein. GitHub startet keinen Workflow, wenn mehr als drei Tags auf einmal gepusht werden.

```bash
git push origin v<version>
```

### Was ein Release enthält {#what-a-release-holds}

**Release Go server** baut die Web-App einmal, bettet sie ein und baut den Server für linux/amd64, linux/arm64, linux/armv7 und windows/amd64. Das Release bekommt:

- die vier Binaries, `neodesk-server-<os>-<arch>`, mit der Web-Konsole darin;
- `manifest.json` mit Version, Commit, Branch sowie SHA-256 und Größe jedes Binarys;
- `manifest.sig`, die ed25519-Signatur des Manifests;
- die Installer `install.sh`, `neodesk.sh`, `neodesk.ps1` und `neodesk-docker.sh` und die Compose-Dateien `docker-compose.single.yml`, `docker-compose.quick.single.yml` und `docker-compose.quick.single.macvlan.yml` aus `install/`, unter ihren bloßen Namen;
- `SHA256SUMS`, für `sha256sum -c`, die die Binaries, `manifest.json`, die Installer und die Compose-Dateien auflistet;
- `SHA256SUMS.sig`, die ed25519-Signatur der Liste, die die Installer prüfen, bevor sie ihre eigene Kopie ersetzen.

Die öffentlichen Installationsbefehle holen die Installer und Compose-Dateien über neode.sk, das zum neuesten Release führt, das sie hat. Ein Release ohne sie bricht also die Installationsbefehle.

Der Signaturschlüssel ist das Repository-Secret `RELEASE_SIGNING_KEY`, ein privater ed25519-Schlüssel als PKCS#8-PEM. Seine öffentliche Hälfte ist in den Server und in `install/neodesk.sh` eingebaut. Der Updater der Konsole und die Installer lehnen ein Release ohne gültige Signatur ab. Nur eine Erstinstallation unter Windows prüft allein die SHA-256-Summe, weil Windows kein Werkzeug für die Signatur hat, bevor der Server da ist. Ohne das Secret bricht der Workflow ab, bevor er etwas veröffentlicht. Ist die Repository-Variable `NEODESK_RELEASE_PUBLIC_KEY` gesetzt, wird die Signatur auch gegen sie geprüft. Vor dem Veröffentlichen prüft der Workflow das Release so, wie es der Updater tut. Ein Release, das er selbst anlegt, beginnt als Entwurf und wird öffentlich, sobald alle seine Dateien da sind.

Solange es kein stabiles Release gibt, installiert der stabile Kanal das neueste Pre-Release, und den Entwicklungs-Build nur dann, wenn es auch kein Pre-Release gibt. Das Feld branch im Manifest nennt den Update-Kanal, `main` für stabil und `dev` für Entwicklung, so wie Installationen ihn in `UPDATE_GITHUB_BRANCH` speichern; es ist nicht der git-Branch.

**Build & Release Go Server** ist ein eigener Workflow, der bei Pushes auf `main` und bei Tags den Server ohne die Web-Konsole baut. Er behält die Binaries als Dateien seines Laufs und veröffentlicht nichts.

### Client-Releases {#client-releases}

Der Desktop-Client wird aus seinem eigenen Repository veröffentlicht, [neodeskapp/neodesk-client](https://github.com/neodeskapp/neodesk-client), mit Tags `desktop-v<version>`. Seine `SHA256SUMS.sig` ist mit demselben Schlüssel signiert, und die Konsole prüft sie, bevor **Computer hinzufügen** und **Schnellhilfe** ein Paket herausgeben.

### Docker-Images {#docker-images}

**Build & Publish Docker Images** baut zwei Images für amd64 und arm64:

- `ghcr.io/neodeskapp/neodesk`: der Server mit seiner Web-Konsole, das Image, das die Docker-Installation betreibt;
- `ghcr.io/neodeskapp/neodesk-server`: der Server mit ausgeschalteter Konsole.

Für `main` baut er nur bei den Bump-Commits, damit ein Image immer die Version von `main` trägt. Ein Build von `main` bekommt die Tags `dev` und `sha-<commit>`. Ein `v*`-Tag bekommt die Version (`3.6.0-rc.1`) und den Tag (`v3.6.0-rc.1`), ein stabiles Release außerdem `X.Y`.

`latest` wandert zu den Images eines Tags, wenn der Tag ein stabiles Release ist. Solange das Repository kein stabiles Release hat, wandert es auch zu einem Pre-Release, wenn kein veröffentlichtes Pre-Release neuer ist. Das ist das Release, das die Installer zu diesem Zeitpunkt installieren. `latest` kommt nie von `main`. Der Schritt „Decide whether latest moves to this tag“ des Laufs sagt, warum es gewandert ist oder nicht. Läufe von Tags kommen nacheinander dran, daher entscheidet ein späterer Tag erst, nachdem der frühere veröffentlicht hat.

Schlägt der arm64-Build fehl, wird das amd64-Image trotzdem veröffentlicht. Ein manueller Lauf auf einem `v*`-Tag mit dem Tag `latest` veröffentlicht dasselbe wie der Push des Tags; auf `main` wird er abgelehnt.

## Vor einem stabilen Release {#before-a-stable-release}

Bevor du den Tag pushst:

- Der Commit, den du taggst, hat Go Server CI, Web UI CI, Installer CI, Secret Scan und Version Verify bestanden.
- Das [lokale Gate](/docs/development/tests-and-checks#the-local-gate) besteht, oder wenigstens die Go-Tests, die Tests der Web-App und die Versionsprüfung.
- Die Sicherheits-Suite besteht:

  ```bash
  bash scripts/run-security-suite.sh
  ```

- Das Image, das aus dem Checkout gebaut wird, startet und ist healthy:

  ```bash
  docker compose -f install/docker-compose.single.yml up -d --build
  curl http://localhost:21121/api/health
  curl http://localhost:3375/health
  ```

- Auf einem Wegwerf-Rechner mit Linux behält eine Installation mit `--auto`, danach `--update`, danach `--uninstall` die Daten, und eine erneute Installation nutzt sie dann:

  ```bash
  sudo ./install/neodesk.sh --auto
  ```

  Dasselbe unter Windows mit `-Auto`, `-Update` und `-Uninstall`, und mit `neodesk-docker.sh` für Docker.
- `neodesk-server check` besteht gegen jede Installation, siehe [Health-Checks](/docs/development/installers#health-checks).
- Der Diff enthält keine Geheimnisse, keine Debug-Ausgaben und keine privaten Adressen.

Nach dem Tag:

- Das Release `vX.Y.Z` existiert und hat die vier Binaries, `manifest.json`, `manifest.sig`, die vier Installer, die drei Compose-Dateien, `SHA256SUMS` und `SHA256SUMS.sig`.
- Der Lauf von **Build & Publish Docker Images** für den Tag hat beide Images mit dem Versions-Tag veröffentlicht, und mit `latest`, wenn der Tag es bekommen hat.
- Starte **Installer CI** von Hand mit dem Image-Tag `X.Y.Z`: Seine Smoke-Tests laufen dann mit dem veröffentlichten Image und den Compose-Dateien seines Release.

Ist ein Schritt zum Veröffentlichen fehlgeschlagen, starte ihn von Hand neu: **Release Go server** auf dem Tag mit dem Kanal `stable` oder **Build & Publish Docker Images** auf dem Tag mit dem Tag `latest`.
