---
title: NeoDesk und MeshCentral im Vergleich
description: MeshCentral verwaltet Computer über seinen eigenen Agenten. NeoDesk bedient RustDesk-Clients und nimmt auch MeshAgent-Geräte auf. Fakten und Umzug.
order: 3
og: comparison
product: MeshCentral
---

MeshCentral und NeoDesk sind beide Open-Source-Server, die du selbst
betreibst, mit einer Web-Konsole für den Fernzugriff. MeshCentral ist um
seinen eigenen Agenten gebaut, den MeshAgent. NeoDesk ist um den
RustDesk-Client gebaut und spricht zusätzlich das Protokoll des MeshAgent,
derselbe Agent kann sich also mit beiden verbinden. Alles, was hier über
MeshCentral steht, stammt von dessen Website, Doku und Repository, gelesen am
23. November 2026 und aufgeführt unter [Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**MeshCentral** passt, wenn du deine eigenen Computer über einen Agenten aus
dem Browser verwaltest, auf jedem davon ein Terminal und die Dateien haben
willst, Intel AMT nutzt oder Anmeldung per SAML oder einen Server unter macOS
oder FreeBSD brauchst.

**NeoDesk** passt, wenn deine Geräte den RustDesk-Client nutzen, wenn sich
Leute auch aus der RustDesk-App verbinden sollen oder wenn du RustDesk-Geräte,
MeshAgent-Geräte sowie RDP- und VNC-Hosts in einer Geräteliste haben willst.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | MeshCentral |
|---|---|---|
| Lizenz | AGPL-3.0 | Apache 2.0 |
| Preis | Kostenlos | Kostenlos, erhältlich über npm |
| Server läuft auf | Docker, Linux mit systemd (x86-64, arm64, armv7), 64-Bit-Windows | Windows, Linux, macOS und FreeBSD |
| Installation | Das veröffentlichte Docker-Image oder Installationsskripte, die ein Release herunterladen. Ohne Node.js | `npm install meshcentral`, mit Node.js und npm. Die Doku hat auch eine Anleitung für Docker |
| Datenbank | SQLite oder PostgreSQL | MongoDB, PostgreSQL, MariaDB oder MySQL, oder eine lokale Datenbank |
| Was sich verbindet | Der normale RustDesk-Client, der NeoDesk-Client, der unveränderte MeshAgent sowie RDP- und VNC-Hosts ohne Agenten | MeshAgent unter Windows, Linux, macOS und FreeBSD, ein Android-Agent und Computer mit Intel AMT |
| Gesteuert wird aus | Einem Browser auf Desktop oder Tablet, der RustDesk-App, dem NeoDesk-Client | Dem Browser; dazu gibt es eine mobile Website |
| Anmeldung | Passwort mit Codes aus einer Authenticator-App, LDAP oder Active Directory, OIDC | SAML, OpenID Connect und LDAP; Anmeldung in zwei Schritten mit einer Authenticator-App; YubiKey |
| Werkzeuge am Gerät | Remote Desktop mit Dateiübertragung. Bei MeshAgent-Geräten zusätzlich Terminal, Dateien, Port-Weiterleitungen und Energiebefehle | Die Tabs Desktop, Files und Terminal |
| Aufzeichnung | Im Browser-Viewer als WebM-Datei; bei MeshAgent-Sitzungen auf dem Server | „Record Session to file“ im Tab Desktop |
| Protokoll | Ein Audit-Protokoll der Konsole und die Ereignisse des Servers, 90 Tage aufbewahrt | Der Tab Events jedes Agenten, „your audit log“ |
| Um Hilfe bitten | Ein Schnellhilfe-Link und Hilfeanfragen aus dem NeoDesk-Client | MeshCentral Assistant, ein Werkzeug im Infobereich, das eine Hilfeanfrage senden kann |

## Was MeshCentral besser kann {#what-meshcentral-does-better}

- **Es ist der eigene Server des MeshAgent.** NeoDesk spricht das Protokoll des
  Agenten und bietet die Werkzeuge, die seine
  [MeshAgent-Seite](/docs/console/meshagent#using-a-meshagent-device) aufzählt.
  Für alles Weitere, was der Agent kann, ist MeshCentral die Referenz.
- **Mehr Wege zur Anmeldung.** SAML und YubiKey, die NeoDesk nicht hat.
- **Läuft an mehr Orten.** Server und Agent von MeshCentral laufen auch unter
  macOS und FreeBSD, und die Datenbank kann MongoDB oder MariaDB sein. NeoDesk
  installierst du mit Docker, unter Linux oder unter Windows.
- **Intel AMT.** MeshCentral erreicht Computer, auf denen Intel AMT aktiviert
  ist. NeoDesk nicht.
- **Eine mobile Website.** MeshCentral hat eine. Der Browser-Viewer von
  NeoDesk braucht einen Bildschirm in Desktop- oder Tablet-Größe; auf dem Handy
  nimmst du die RustDesk-App.
- **Eine freizügige Lizenz.** Unter Apache 2.0 darfst du MeshCentral ändern
  und als Dienst betreiben, ohne deine Änderungen zu veröffentlichen. Die
  AGPL-3.0 von NeoDesk verlangt, dass du Änderungen an die Leute weitergibst,
  die den Dienst nutzen.

## Was NeoDesk anders macht {#what-neodesk-does-differently}

- **RustDesk-Clients.** Der normale RustDesk-Client verbindet sich ohne
  Änderung, auf Computern und Handys, und die Leute melden sich darin mit ihrem
  Konsolenkonto an; siehe
  [RustDesk-Client verbinden](/docs/getting-started/connect-a-client).
- **Beide Arten von Geräten in einer Liste.** RustDesk-Geräte,
  [MeshAgent-Geräte](/docs/console/meshagent) und
  [RDP- und VNC-Hosts](/docs/console/remote-targets) stehen unter **Geräte**
  nebeneinander.
- **Freigabe für jeden Agenten.** Ein neuer MeshAgent wartet immer unter
  **Registrierungsanfragen**, bis ihn jemand genehmigt, egal in welchem
  [Registrierungsmodus](/docs/console/enrollment).
- **Hilfe für einen Computer, der nicht eingerichtet ist.** Die
  [Schnellhilfe](/docs/console/quick-support) erstellt einen Link, der einmal
  für eine Stunde gilt. Die Person lädt eine kleine App, klickt auf
  **Erlauben**, und installiert wird nichts.
- **Ein Go-Programm.** `neodesk-server` läuft ohne Node.js; die Konsole ist in
  das Binary eingebaut.

## Lizenz und Kosten {#license-and-cost}

Beide sind kostenlos. MeshCentral steht unter der Lizenz Apache 2.0; seine
Website nennt keinen Bezahltarif. NeoDesk steht unter der AGPL-3.0: Du darfst
es nutzen, ändern und betreiben, auch gewerblich, und wenn du es änderst und
als Netzwerkdienst anbietest, gibst du deine Änderungen an die Nutzer weiter.
Siehe [Lizenz](/docs/project/license).

## Von MeshCentral zu NeoDesk umziehen {#move-from-meshcentral-to-neodesk}

NeoDesk nimmt den unveränderten MeshAgent, du behältst also den Agenten und
lässt ihn auf NeoDesk zeigen. Die Schritte stehen unter
[MeshAgent-Geräte](/docs/console/meshagent):

1. Mach die Konsole über HTTPS erreichbar, unter der Adresse, die die Agenten
   nutzen werden: hinter einem [Reverse Proxy mit TLS](/docs/operations/reverse-proxy-tls)
   oder mit dem eigenen HTTPS der Konsole.
2. Öffne unter **Einstellungen**, **Allgemein**, **MeshCentral-Kompatibilität**
   den Punkt **MeshAgent auf einem Gerät installieren** und lade die .msh-Datei
   herunter. Prüfe ihre Zeile `MeshServer=`.
3. Installiere den MeshAgent auf jedem Gerät mit dieser .msh-Datei.
4. Genehmige jeden Agenten unter **Registrierungsanfragen**.

NeoDesk übernimmt nichts aus MeshCentral: Benutzer, Gruppen und Anmeldung
richtest du in der Konsole neu ein. Aufzeichnungen und Ereignisse bleiben bei
MeshCentral.

NeoDesk ist nicht mit dem Projekt MeshCentral verbunden.

## Quellen {#sources}

Alle Seiten wurden am 23. November 2026 gelesen.

- [meshcentral.com](https://meshcentral.com/): was MeshCentral ist, wo Server
  und Agent laufen und dass es kostenlos über npm erhältlich ist.
- [github.com, Ylianst/MeshCentral](https://github.com/Ylianst/MeshCentral): die
  Lizenz Apache 2.0 und der Android-Agent.
- [docs.meshcentral.com, Startseite](https://docs.meshcentral.com/): die Datenbanken und
  die Anleitung für Docker.
- [docs.meshcentral.com, Schnellstart](https://docs.meshcentral.com/install/quickstart/):
  die Installation über npm und was sie voraussetzt.
- [docs.meshcentral.com, Benutzerhandbuch](https://docs.meshcentral.com/meshcentral/):
  Wege zur Anmeldung, die mobile Website und Intel AMT.
- [docs.meshcentral.com, Geräte-Tabs](https://docs.meshcentral.com/meshcentral/devicetabs/):
  die Tabs Desktop, Files, Terminal und Events und die Aufzeichnung von Sitzungen.
- [github.com, Ylianst/MeshCentralAssistant](https://github.com/Ylianst/MeshCentralAssistant):
  MeshCentral Assistant und seine Hilfeanfragen.
