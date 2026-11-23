---
title: CI-Workflows
description: Die GitHub-Actions-Workflows des Repositorys: wann jeder läuft, was er prüft oder veröffentlicht und was zu tun ist, wenn einer fehlschlägt.
order: 6
---

Die Workflows liegen in `.github/workflows`. Ihre Namen stehen hier so, wie GitHub Actions sie anzeigt. Die Release-Workflows beschreibt [Branches, Versionen und Releases](/docs/development/releasing#release-workflows); diese Seite listet sie nur auf.

## Prüfungen bei Pushes und Pull Requests {#checks-on-pushes-and-pull-requests}

Diese Workflows laufen bei Pushes auf `main` und bei Pull Requests, die meisten nur, wenn sich ihre Pfade ändern:

| Workflow | Läuft, wenn sich das ändert | Was er macht |
|----------|------------------------|--------------|
| Go Server CI | `neodesk-server/`, `web-ui/` | `go vet` und `govulncheck`; die Go-Tests mit dem Race-Detector, verteilt auf sechs Runner mit 30 Minuten pro Paket; die Mesh-Interop-Tests; und der Release-Build: Die Web-App wird gebaut, die Sprachdateien werden mit `i18n-check` geprüft, die Web-App wird eingebettet, und der gebaute Server wird nach `-version` gefragt. |
| Web UI CI | `web-ui/`, `neodesk-server/protos/` | Installiert die Pakete der Web-App mit npm 11, schlägt bei einem Befund von `npm audit` mit hoher oder kritischer Stufe fehl und führt dann `lint`, `check`, `test` und `build` aus. |
| Installer CI | die Installer, ihre Testskripte, `neodesk-server/cli`, der Updater, Docker- und Compose-Dateien | Prüft, dass die Skripte auf oberster Ebene in git ausführbar sind, parst jeden Bash-Installer und lässt ShellCheck darüber laufen, führt die Testskripte der Installer aus, parst `neodesk.ps1` unter Windows, führt die Go-Tests der Befehle und Pakete aus, die die Installer nutzen, ruft bei jedem Bash-Installer den `--help`-Pfad auf und validiert die drei Compose-Dateien. Außerdem testet er `scripts/docker-latest.sh`, das entscheidet, wann die Docker-Images `latest` bekommen. Siehe [die Tests der Installer](/docs/development/installers#tests). |
| CDAP SDK CI | `sdks/`, `bridges/`, `neodesk-server/cdap/` | Baut das Node.js-SDK und lässt dann das Beispiel jedes SDK und jede Bridge mit ihrer Beispielkonfiguration gegen das Gateway laufen (`go test ./cdap/`). |
| Version Verify | jede Datei, die die Version trägt, `CHANGELOG.md`, `neodesk-server/cmd/repotool/` | `bump-version --verify`. |
| Secret Scan | jeder Push und jeder Pull Request | gitleaks über die Dateien, die Prüfung auf sensible Pfade, die Prüfungen `check-port-docs`, `check-pairing-i18n` und `check-js` von repotool (siehe [Prüfungen des Repositorys](/docs/development/tests-and-checks#repository-checks)) und die Prüfung auf Sicherheitsregressionen (`scripts/check-security-regressions.sh`, mit eigenem Test). |

Alle außer Web UI CI brechen einen Lauf ab, wenn ein neuerer Push auf denselben Branch oder Pull Request einen neuen startet. Ein abgebrochener Lauf ist also kein Fehlschlag.

Installer CI hat zwei weitere Jobs, die nur laufen, wenn du ihn von Hand mit einem Image-Tag startest (Standard: `latest`): den Test mit gehärteten Bind-Mounts und einen Laufzeit-Smoke-Test. Der Smoke-Test startet das veröffentlichte Image mit `docker-compose.quick.single.yml`, prüft `/api/health` auf 21121 und `/health` auf 5000 und führt im Container `neodesk-server check` aus.

## Release-Workflows {#release-workflows}

| Workflow | Wann |
|----------|------|
| Version Bump | Bei jedem Push auf `main`, außer bei den Bump-Commits selbst |
| Release Go server | Ein `v*`-Tag, ein Push auf `main`, der den Server oder die Web-App ändert, oder von Hand |
| Build & Release Go Server | Pushes auf `main`, `v*`-Tags oder von Hand; behält seine Builds nur als Dateien des Laufs |
| Build & Publish Docker Images | Von Version Bump nach jedem Bump auf `main` gestartet, ein gepushter `v*`-Tag oder von Hand |

## Geplante Workflows {#scheduled-workflows}

| Workflow | Wann | Was er macht |
|----------|------|--------------|
| CodeQL | Montags oder von Hand | Code-Scanning für JavaScript und TypeScript, Go, Python, Rust und die Workflows. |
| RustDesk Upstream Watch | Montag, Mittwoch und Freitag oder von Hand | Sucht nach neuen stabilen Releases des RustDesk-Clients und -Servers, öffnet für jedes ein Issue mit dem Label „Next Updates“ zur Prüfung und committet die zuletzt gesehenen Tags in `config/rustdesk-upstream-watch.json` auf `main`. Siehe [Die Upstream-Überwachung](/docs/development/rustdesk-compatibility#the-upstream-watch). |
| Remote Gateway Supply Chain | Montags, bei Pull Requests, die `remote-gateway/` ändern, oder von Hand | Prüft den gepinnten Upstream-Quellcode des Remote-Gateways, seine Prüfsummen und Lizenzen und führt die Go-Sicherheitstests des Gateways aus. |
| Remote Gateway Dependency Update | Montags oder von Hand | Öffnet einen Pull Request auf `main`, wenn es vom gepinnten Gateway-Quellcode eine neuere Version gibt. |

Dependabot öffnet jede Woche gruppierte Update-Pull-Requests für die npm-Pakete der Web-App, die Go-Module und die GitHub Actions.

## Was ein Push auf main startet {#what-one-push-to-main-starts}

Ein Push auf `main` startet Secret Scan, Version Bump und die Prüfungen und Builds, zu denen seine Pfade passen. Der Bump-Commit wird mit dem eigenen Token des Workflows gepusht, und ein solcher Push startet keinen Workflow. Deshalb startet Version Bump den Build der Docker-Images für `main` selbst, mit dem Tag `dev`. Go Server CI, Web UI CI und CDAP SDK CI überspringen einen Push, dessen letzte Commit-Nachricht `[version-bump]` enthält.

Ein Push kann also mehrere Läufe zeigen, und wenn mehrere davon fehlschlagen, haben die Ursachen oft nichts miteinander zu tun. Sieh dir jeden Lauf einzeln an.

## Häufige Fehler {#common-failures}

**Version Verify: `neodesk.sh: expected X, got Y`.** Eine Datei nennt eine andere Version als `VERSION`. In `neodesk-server`:

```bash
go run ./cmd/repotool bump-version --sync
go run ./cmd/repotool bump-version --verify
```

**Secret Scan: „leaks found“ oder „sensitive pattern“.** gitleaks hat etwas gefunden, das wie ein Geheimnis aussieht, oder die Prüfung auf sensible Pfade hat eine private Adresse oder einen Home-Ordner eines Build-Rechners gefunden. Entferne es; nimm in Beispielen Adressen wie `203.0.113.10`.

**Web UI CI: Die Installation schlägt fehl.** npm 10, das mit Node.js 22 kommt, kann den Abhängigkeitsbaum der Web-App nicht auflösen. Installiere mit npm 11:

```bash
npx -y npm@11.6.2 ci
```

**Web UI CI: `npm audit`.** Ein Paket hat einen Sicherheitshinweis mit hoher oder kritischer Stufe. Aktualisiere es oder pinne eine korrigierte Version mit `overrides` in `web-ui/package.json`.

**Installer CI: Ein Skript ist in git nicht ausführbar.** `./script.sh` würde in einem frischen Clone fehlschlagen. Behebe es mit diesem Befehl und setze für `<script>` den Pfad des Skripts ein:

```bash
git update-index --chmod=+x <script>
```

**Version Bump: Der Push schlägt fehl.** Ein anderer Push war schneller. Der Workflow macht einen Rebase und versucht es fünfmal. Lässt sich der Bump nicht sauber rebasen, starte den Job noch einmal, sobald der andere Push durch ist.

**Build & Publish Docker Images: Die GHCR-Prüfung schlägt fehl.** Die Registry hat auch nach drei Versuchen keine Zugangsdaten für den Push herausgegeben. Das ist ein Problem bei GitHub und kein Build-Fehler; starte den Workflow später noch einmal.

**Release Go server: Das Release eines Tags hat keine Assets.** Starte **Release Go server** für den Tag mit dem Kanal `stable`.

**Ein Tag ohne Docker-Images.** Der Push des Tags startet den Image-Build, aber GitHub startet keinen, wenn mehr als drei Tags auf einmal gepusht werden. Läufe von Tags kommen nacheinander dran, und GitHub bricht einen wartenden Lauf ab, wenn hinter ihm der Lauf eines anderen Tags ankommt. Starte **Build & Publish Docker Images** von Hand auf dem Tag mit dem Image-Tag `latest`, siehe [Bei einem v*-Tag](/docs/development/releasing#on-a-v-tag).

## Die Prüfungen lokal ausführen {#run-the-checks-locally}

Die Befehle hinter den Pflichtprüfungen, vom Wurzelordner des Checkouts aus:

```bash
(cd neodesk-server && go run ./cmd/repotool bump-version --verify)
(cd neodesk-server && go vet ./... && go test -race -count=1 -timeout 30m ./...)
(cd web-ui && npx -y npm@11.6.2 ci && npm run lint && npm run check && npm test && npm run build)
gitleaks detect --source . --config .gitleaks.toml
bash scripts/check-no-sensitive-paths.sh
bash scripts/check-security-regressions.sh
```

CI führt jede Prüfung auf GitHub aus. Vor einem Pull Request reicht es deshalb, die Tests der Teile auszuführen, die du geändert hast, siehe [Tests und Prüfungen](/docs/development/tests-and-checks). Das [lokale Gate](/docs/development/tests-and-checks#the-local-gate) führt die meisten davon aus, ohne das Lint der Web-App, und ergänzt Prüfungen für Docker, Trivy und Python.
