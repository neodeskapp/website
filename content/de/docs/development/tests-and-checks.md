---
title: Tests und Prüfungen
description: Die Go-Tests, die Tests der Web-App, die Contract-Suite, das lokale Gate, das vor einem Commit alles ausführt, und die eigenen Prüfungen des Repositorys.
order: 3
---

Bevor du einen Pull Request öffnest, baue, was du geändert hast, und führe seine Tests aus. Die vollständigen Prüfungen laufen auf GitHub für jeden Pull Request, siehe [CI-Workflows](/docs/development/ci). Das [lokale Gate](#the-local-gate) führt die meisten davon in einem Durchgang auf deinem Rechner aus.

## Go-Tests {#go-tests}

In `neodesk-server`:

```bash
go vet ./...
go test -race -count=1 -timeout 30m ./...
```

Mit dem Race-Detector braucht allein das Paket der Konsole länger als das Standardlimit von `go test` von zehn Minuten, daher `-timeout 30m`. CI verteilt die Pakete auf sechs Runner. Bei einer Änderung in wenigen Paketen führe nur deren Tests aus, zum Beispiel:

```bash
go test -race -count=1 ./console/updater/... ./cli/...
```

`govulncheck ./...` prüft die Go-Abhängigkeiten auf bekannte Schwachstellen, so wie es CI tut. Installiere es mit:

```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
```

### PostgreSQL {#postgresql}

Die Datenbanktests laufen immer auf SQLite. Sie laufen zusätzlich auf PostgreSQL, wenn `NEODESK_TEST_POSTGRES_DSN` einen Server nennt; jeder Test bekommt dort ein eigenes Schema. Ohne die Variable werden diese Tests übersprungen. Ein Wegwerf-Server in Docker:

```bash
docker run -d --name bd-test-pg -p 127.0.0.1:5432:5432 \
  -e POSTGRES_USER=neodesk -e POSTGRES_DB=neodesk -e POSTGRES_PASSWORD=test-only \
  postgres:16-alpine
NEODESK_TEST_POSTGRES_DSN='postgres://neodesk:test-only@127.0.0.1:5432/neodesk?sslmode=disable' \
  go test -count=1 ./...
```

### Sicherheits-Suite {#security-suite}

```bash
bash scripts/run-security-suite.sh
```

Unter Windows lautet der Befehl `pwsh ./scripts/run-security-suite.ps1`. Die Suite führt die Go-Tests der Verbindungssicherheit in `relay`, `sessiongrant`, `crypto` und `auth` aus: Relay-Tickets, Sitzungsfreigaben, die Signatur des Servers über seinen ID-Schlüssel und Tokens. Sie laufen im Testprozess und brauchen keinen Server.

## Die Tests der Web-App {#the-web-apps-tests}

In `web-ui`:

```bash
npx -y npm@11.6.2 ci
npm run lint
npm run check
npm test
npm run build
```

| Skript | Was es ausführt |
|--------|--------------|
| `lint` | ESLint und Prettier. |
| `check` | svelte-check; Warnungen lassen es fehlschlagen. |
| `test` | Die Unit-Tests (Vitest). |
| `build` | Den Build, der auch fehlschlägt, wenn ein gebündeltes npm-Paket eine Lizenz hat, unter der die Konsole es nicht ausliefern darf. |
| `e2e` | Die End-to-End-Tests (Playwright, Chromium und Firefox) gegen eine laufende Konsole. |

`npm audit --audit-level=high` gehört ebenfalls zur CI: Ein Sicherheitshinweis mit hoher oder kritischer Stufe lässt sie fehlschlagen.

Die End-to-End-Tests brauchen eine Konsole unter `ND_URL` mit Testkonten namens `e2e_admin`, `e2e_super_admin`, `e2e_server_admin`, `e2e_global_admin`, `e2e_operator` und `e2e_viewer`, die sich ein Passwort teilen. Gib es in `E2E_PASSWORD` an oder in einer Datei, die `E2E_PASSWORD_FILE` nennt. Die Tests einer Rolle, deren Konto fehlt, werden übersprungen.

## Die Contract-Suite {#the-contract-suite}

`neodesk-server/console/contract` prüft die HTTP-Antworten der Konsole von außen. Ihre Golden Files sind aufgezeichnete Antworten der alten Node.js-Konsole und dienen als Spezifikation für die Go-Konsole. Ein Golden File ändert sich nur, wenn ein Fix eine Antwort absichtlich ändert. Die Suite hat zwei Ebenen:

- **Matrix:** eine Anfrage an jede Route der Konsole für jede von neun Rollen, von abgemeldet bis `admin`. Sie zeigt, wer was aufrufen darf und wie eine Ablehnung aussieht.
- **Cases:** von Hand geschriebene Anfragen pro Routengruppe, mit echten Parametern und Bodies.

Eine Route, die keine der beiden Ebenen erreicht, lässt die Suite fehlschlagen. Die Testdateien tragen das Build-Tag `contract`, deshalb führt `go test ./...` sie nicht aus. Gegen eine Konsole, die du selbst gestartet hast:

```bash
cd neodesk-server/console/contract
ND_URL=http://localhost:5000 go test -tags contract -count=1 -run '^TestCases$/^devices$'
```

Die Suite meldet sich mit Konten `e2e_<role>` an, mit dem Passwort aus der Datei, die `ND_PASSWORD_FILE` nennt. Die Matrix schreibt auf jede Route, die sie erreicht; nimm also eine frische Wegwerf-Konsole. Wie du Cases schreibst und Golden Files aufzeichnest und welche Variablen es noch gibt, steht in [der README der Suite](https://github.com/neodeskapp/neodesk/blob/main/neodesk-server/console/contract/README.md).

## Das lokale Gate {#the-local-gate}

Das lokale Gate führt die unten aufgeführten Prüfungen auf deinem Rechner aus. Sind seine Hooks eingeschaltet, blockiert es einen Commit oder Push, wenn eine davon fehlschlägt. GitHub Actions führt es nie aus: Dort weigert es sich zu starten.

### Welche Werkzeuge es braucht {#tools-it-needs}

- Node.js 22 oder neuer mit npm 11
- Go in der Version, die `neodesk-server/go.mod` verlangt, und `govulncheck`
- Docker mit dem Compose-Plugin und einem laufenden Daemon; das Gate zieht `postgres:16-alpine`
- Bash und ShellCheck (Git for Windows bringt Bash mit), PowerShell, ripgrep, gitleaks und Trivy
- Python und `pip-audit`, für das Python-SDK und die Bridges

### Die Hooks einschalten {#turn-on-the-hooks}

```bash
bash scripts/setup-local-gates.sh
```

```powershell
.\scripts\setup-local-gates.ps1
```

Die Einrichtung prüft, ob die Werkzeuge da sind, setzt dann `core.hooksPath=.githooks` in der Git-Konfiguration dieses Clones und sonst nichts. Ab dann führen `pre-commit` und `pre-push` das Gate aus. `git commit --no-verify` überspringt einen Hook, aber dann hat das Gate nicht bestanden.

### Ausführen {#run-it}

```bash
bash scripts/local-gate.sh
```

```powershell
.\scripts\local-gate.ps1
```

Beide rufen `go run ./cmd/repotool local-gate` in `neodesk-server` auf. `--preflight-only` (`-PreflightOnly`) prüft nur die Werkzeuge, und `--dry-run` (`-DryRun`) listet die Stufen auf, ohne sie auszuführen; das zählt nicht als bestanden.

Was es ausführt:

- Die Versionsprüfung und `git diff --check`.
- Saubere npm-Installationen und Audits der Web-App und des Node.js-SDK, die Sprachprüfung, die Herkunftsprüfung, die Unit-Tests und die Typprüfung der Web-App und die Tests des SDK.
- Python: das Kompilieren der Bridges und des SDK, die Tests des SDK und `pip-audit` für jede Requirements-Datei.
- `go vet`, die Go-Tests mit dem Race-Detector, `govulncheck`, einen Build mit `--help`, Builds für linux/amd64, linux/arm64 und windows/amd64 und die PostgreSQL-Tests gegen einen temporären PostgreSQL-Container.
- gitleaks, die Prüfung auf sensible Pfade und einen Trivy-Scan des Quellbaums.
- Die Installer: Bash-Syntax, ShellCheck, ihre Testskripte, die `--help`-Pfade und die Parse-Prüfung für PowerShell.
- Docker: jede Compose-Datei, einen Build beider Images, einen Smoke-Test des Images auf SQLite und auf PostgreSQL, Trivy-Scans beider Images und den Test mit gehärteten Bind-Mounts.

Der Bericht landet in `.local-test-results/latest.json` und `latest.md`, mit je einer datierten Kopie; `--report-dir` oder `NEODESK_LOCAL_GATE_REPORT_DIR` wählt einen anderen Ordner. Jede Prüfung endet in einem dieser Zustände:

| Zustand | Bedeutung |
|-------|---------|
| `PASS` | Die Prüfung lief und hat bestanden. |
| `FAIL` | Die Prüfung lief und hat einen Fehler, eine Schwachstelle oder ein Leck gefunden. |
| `BLOCKED` | Ein Werkzeug, Dienst oder Test fehlte, oder ein Test hat sich selbst übersprungen. |
| `OUT_OF_SCOPE` | Etwas, das ein Checkout nicht nachweisen kann, etwa ein echter RustDesk-Client oder ein Installer auf einem echten Host. |

Das Gate besteht nur, wenn jede Pflichtprüfung bestanden hat. Seine Docker-Tests nutzen eigene Container und Volumes und entfernen sie danach. Es führt nie einen Installer auf deinem Rechner aus und fasst kein installiertes NeoDesk an; diese Tests gehören auf einen Wegwerf-Rechner, siehe [Die Installer](/docs/development/installers#tests).

## Prüfungen des Repositorys {#repository-checks}

`neodesk-server/cmd/repotool` enthält die eigenen Prüfungen des Repositorys. Führe sie in `neodesk-server` aus und setze für `<command>` den Namen der Prüfung ein; `help` listet sie auf:

```bash
go run ./cmd/repotool <command>
```

Jede endet mit 0, wenn sie bestanden hat, mit 1, wenn sie etwas gefunden hat, und mit 2, wenn sie falsch aufgerufen wurde.

| Befehl | Was er prüft |
|---------|----------------|
| `bump-version --verify` | Jede Datei, die die Produktversion trägt, nennt die aus `VERSION`. Siehe [die Produktversion](/docs/development/releasing#the-product-version). |
| `i18n-check --system console` | Die Sprachdateien der Konsole, siehe [Deine Arbeit prüfen](/docs/development/translations#check-your-work). |
| `check-pairing-i18n` | Jede Sprachdatei hat die Schlüssel der Kopplungstexte und den Eintrag der Seitenleiste dafür. |
| `check-js` | Keine eingecheckte JavaScript-Datei außerhalb von `.github/javascript-allowlist.txt`. |
| `check-port-docs` | Kein Skript und keine Go-Datei stellt Port 21120 als aktiven Port dar; diese Nummer wurde nie ausgeliefert. Die Port-Tabelle, die der Befehl früher mit dem Code verglichen hat, ist jetzt [Ports und Firewall](/docs/operations/ports). |
| `check-provenance` | `THIRD_PARTY_NOTICES.md` enthält die Kurzfassung der Clean-Room-Richtlinie und die SBOM-Anforderung, und `.github/go-server-context.md` stellt keine ungeprüfte Behauptung zur Herkunft auf. Siehe [Clean-Room-Herkunftsnachweis](/docs/development/provenance#safeguards-in-the-repository). |
| `docker-smoke` | Startet das lokale Image `neodesk:local` mit neuen Volumes, wartet auf API und Konsole, meldet sich an, führt darin `neodesk-server check` aus, startet den Container neu und prüft, dass sein API-Schlüssel gleich geblieben ist. `--database-type postgres --database-url <url>` lässt den Test auf PostgreSQL laufen. |
| `local-gate` | Das lokale Gate oben. |

Drei Skripte ergänzen den Secret-Scan: gitleaks, die Prüfung auf private Adressen und Home-Ordner von Build-Rechnern und die Prüfung, dass kein Installer und keine Unit-Datei im Repository ein Geheimnis in eine systemd-Unit schreibt:

```bash
gitleaks detect --source . --config .gitleaks.toml
bash scripts/check-no-sensitive-paths.sh
bash scripts/check-security-regressions.sh
```
