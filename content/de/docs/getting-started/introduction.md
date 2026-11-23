---
title: Einführung
description: Was NeoDesk ist, woraus es besteht und was du brauchst, um es zu betreiben.
order: 1
---

NeoDesk ist ein selbst gehosteter Server für den Remote-Desktop-Client
RustDesk, mit einer Web-Konsole für deine Geräte und die Menschen, die sie
nutzen. Diese Seite erklärt, woraus NeoDesk besteht und was du vor der
Installation brauchst. Sie beschreibt NeoDesk {{VERSION}}.

## Was es macht {#what-it-does}

Ein RustDesk-Client braucht einen Server: um sich dort zu registrieren, um
andere Clients zu finden und um eine Sitzung weiterzuleiten, wenn zwei Computer
sich nicht direkt erreichen. Der Open-Source-Server von RustDesk erledigt das
mit zwei Programmen, hbbs und hbbr. NeoDesk macht dieselbe Arbeit und bringt
dazu:

- die API, über die sich der RustDesk-Client anmeldet und sein Adressbuch
  abgleicht
- eine Web-Konsole mit der Geräteliste, den Registrierungsanfragen, Benutzern
  und Rollen, einem Aktivitätsprotokoll und Remote Desktop im Browser
- die Anmeldung an der Konsole mit Zwei-Faktor-Codes, LDAP oder Active
  Directory oder OIDC

Deine Geräte können weiter den normalen RustDesk-Client nutzen, auf Computern
wie auf Handys: Du trägst deinen Server ein, sonst ändert sich auf der
Client-Seite nichts. NeoDesk hat außerdem einen eigenen Client für Windows,
macOS und Linux, der sich über einen Einladungslink mit deinem Server
verbindet.

## Woraus es besteht {#what-it-is-made-of}

Ein einziges Programm, `neodesk-server`, erledigt alles. Alle drei
Installationswege starten es im selben Modus, in dem ein Prozess Folgendes
betreibt:

- den ID-Server, der die Aufgabe von hbbs übernimmt: Hier registrieren sich die
  Clients und finden einander
- den Relay-Server, der die Aufgabe von hbbr übernimmt: Er trägt eine Sitzung,
  wenn sich die beiden Computer nicht direkt erreichen
- die API für RustDesk-Clients
- die Web-Konsole

Jeder Teil lauscht auf seinem eigenen Port. Die Konsole nutzt 5000, ID- und
Relay-Server nutzen 21115 bis 21119, und die API für Clients nutzt 21121.
[Ports](/docs/operations/ports) listet alle auf und sagt, welche davon die
Clients brauchen.

Die Web-Konsole ist eine Svelte-App. Sie wird beim Bauen in das Binary
eingebaut, deshalb braucht der laufende Server kein Node.js. Nur ein Build aus
dem Quellcode braucht Node.js, und der Docker-Build bringt sein eigenes mit.

Die meisten Daten hält der Server an zwei Stellen:

- **Eine Datenbank.** Standardmäßig ist das eine SQLite-Datei,
  `db_v2.sqlite3`. PostgreSQL geht auch, siehe
  [PostgreSQL](/docs/operations/postgresql). Geräte, Konten und die
  Einstellungen der Konsole liegen alle darin.
- **Ein Schlüsselpaar.** Beim ersten Start erzeugt der Server `id_ed25519` und
  `id_ed25519.pub`. Die Clients bekommen den öffentlichen Schlüssel und prüfen
  damit, dass sie mit deinem Server sprechen. Geht der private Schlüssel
  verloren, erzeugt der Server ein neues Paar, und jeder Client braucht den
  neuen Schlüssel.

Die Konsole legt außerdem Dateien in ihrem Datenordner ab, etwa hochgeladene
Bilder und Schriften, Dateien aus dem Chat und ihre eigenen Backups. Nichts
davon verlässt den Server von selbst; [Datenschutz](/docs/project/privacy)
listet jeden Host, den NeoDesk kontaktiert.

## NeoDesk und RustDesk {#neodesk-and-rustdesk}

NeoDesk funktioniert mit dem normalen RustDesk-Client von der Release-Seite
von RustDesk. Du baust keinen eigenen Client. Die Seite **Übersicht** der
Konsole zeigt die vier Werte, die ein Client braucht: ID-Server, Relay-Server,
API-Server und Schlüssel.

Beim NeoDesk-Client musst du keinen davon eintippen. **Computer hinzufügen**
auf der Seite **Geräte** erzeugt einen Einladungslink, der den Client
installiert und den Computer mit deinem Server verbindet, siehe
[Computer hinzufügen](/docs/console/add-a-computer).

Der Code liegt unter
[github.com/neodeskapp/neodesk](https://github.com/neodeskapp/neodesk).
NeoDesk ist als Fork von [BetterDesk](https://github.com/UNITRONIX/BetterDesk)
von UNITRONIX entstanden und steht unter der
[AGPL-3.0](/docs/project/license).

## Was du brauchst {#what-you-need}

Es gibt drei Wege, NeoDesk zu installieren. Jeder installiert denselben Server.

| Weg | Was der Rechner braucht |
|-----|-------------------------|
| [Docker](/docs/getting-started/docker) | Docker mit Compose 2.24 oder neuer und Zugriff auf `ghcr.io`, wo das Image veröffentlicht ist. Das Installationsskript installiert Docker, wenn es fehlt. |
| [Linux](/docs/getting-started/linux) | Root-Zugriff, systemd und apt-get, dnf, yum oder pacman. Einen 64-Bit-x86-, arm64- oder armv7-Prozessor und Zugriff auf github.com, wo die Releases liegen. |
| [Windows](/docs/getting-started/windows) | 64-Bit-Windows, PowerShell als Administrator und Zugriff auf github.com. NSSM ist optional und macht den Server zu einem Windows-Dienst; ohne NSSM läuft der Server als geplante Aufgabe. |

Keiner davon braucht Go oder Node.js auf dem Rechner: Docker startet das
veröffentlichte Image, und die Skripte für Linux und Windows laden ein Release
herunter. Nur wer mit dem Linux- oder Windows-Skript aus dem Repository baut,
braucht sie; wie das geht, steht auf den Installationsseiten.

Docker ist der kürzeste Weg: Ein Befehl installiert alles, siehe
[Mit dem Skript installieren](/docs/getting-started/docker#install-with-the-script).

Egal welchen Weg du nimmst, die Clients müssen den Server erreichen: mindestens
21116 über TCP und UDP sowie 21117 und 21121 über TCP. Verbinden sich deine
Geräte über das Internet, braucht der Server eine Adresse, die sie von dort
erreichen, etwa eine öffentliche IP-Adresse oder einen Domainnamen.

## Wie es weitergeht {#where-to-go-next}

1. Installiere NeoDesk mit [Docker](/docs/getting-started/docker), unter
   [Linux](/docs/getting-started/linux) oder unter
   [Windows](/docs/getting-started/windows).
2. [Melde dich zum ersten Mal an](/docs/getting-started/first-sign-in), ändere
   das Admin-Passwort und trage die Adresse ein, die die Clients nutzen.
3. Füge deine Computer hinzu: mit dem NeoDesk-Client über
   [Computer hinzufügen](/docs/console/add-a-computer) oder
   [indem du einen RustDesk-Client verbindest](/docs/getting-started/connect-a-client).
4. Lerne die Konsole kennen, am besten mit der
   [Übersicht](/docs/console/overview) und der
   [Geräteliste](/docs/console/devices).

Bevor du die Konsole ins Internet stellst, setze einen Reverse Proxy mit TLS
davor: siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).
