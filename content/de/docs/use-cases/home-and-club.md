---
title: Eigener Server zu Hause oder im Verein
description: NeoDesk mit Docker auf einem kleinen Server oder einer Synology betreiben, HTTPS mit Let's Encrypt einrichten und Familie oder Verein helfen.
order: 3
og: use-case
---

Du hilfst deinen Eltern mit ihrem Laptop, oder du betreust die paar Computer
eines Vereins. NeoDesk gibt dir dafür einen eigenen Server, auf einem Mini-PC,
einem NAS oder einem kleinen gemieteten Server. Die Computer, denen du hilfst,
verbinden sich mit ihm, und du arbeitest in seiner Web-Konsole oder in der
RustDesk-App. Diese Seite zeigt die Einrichtung, mit einem Link in die Doku
für jeden Schritt.

## Was du brauchst {#what-you-need}

- Eine Maschine mit Docker und Compose ab Version 2.24: einen Linux-Rechner,
  ein Synology-NAS oder einen gemieteten Server. Unter Linux installiert das
  Installationsskript Docker, wenn es fehlt.
- Für Computer außerhalb deines Heimnetzes: eine öffentliche Adresse oder
  einen DNS-Namen für die Maschine und diese Ports, an deinem Router zu ihr
  weitergeleitet: 21115 bis 21117 und 21121 über TCP und 21116 über UDP. Siehe
  [Ports und Firewall](/docs/operations/ports).

## Mit Docker installieren {#install-with-docker}

Auf einem Linux-Rechner installiert ein Befehl alles:

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/install.sh | sudo bash
```

Am Ende zeigt er die Adresse der Konsole, das Admin-Passwort und die vier
Werte, die RustDesk-Clients brauchen. Das Admin-Passwort erscheint nur einmal,
kopier es also. [Installation mit Docker](/docs/getting-started/docker)
erklärt jede Option.

## Auf einem Synology-NAS {#on-a-synology-nas}

Eine Synology betreibt dieselbe Compose-Datei im Container Manager. Die
Weboberfläche von DSM belegt Port 5000, den Standardport der Konsole, gib der
Konsole deshalb mit `NEODESK_CONSOLE_PORT` in der Datei `.env` einen anderen
Port. Sollen die Daten in einem freigegebenen Ordner liegen statt in einem
Docker-Volume, setze `PUID` und `PGID` auf den Besitzer dieses Ordners.
[Docker auf einem Synology-NAS](/docs/getting-started/docker/synology) hat die
Dateien und die Schritte.

## HTTPS mit deiner eigenen Domain {#https-with-your-own-domain}

Die Konsole spricht reines HTTP, bis du ihr ein Zertifikat gibst. Das
Docker-Installationsskript nimmt dir das ab: Mit einem DNS-Namen, der auf den
Server zeigt, stellt es einen kleinen Traefik-Container vor die Konsole. Der
holt ein Zertifikat von Let's Encrypt und erneuert es selbst.

Für eine neue Installation gibst du den Namen und eine E-Mail-Adresse für die
Ablaufhinweise von Let's Encrypt an:

```bash
curl -fsSL https://raw.githubusercontent.com/neodeskapp/neodesk/main/install.sh | sudo bash -s -- --domain <console-domain> --letsencrypt-email <email-address>
```

Setze deinen DNS-Namen für `<console-domain>` und deine E-Mail-Adresse für
`<email-address>` ein. Für eine Installation, die schon läuft, startest du das
Skript in ihrem Ordner mit denselben beiden Werten:

```bash
cd /opt/neodesk/docker
sudo bash neodesk-docker.sh --domain <console-domain> --email <email-address>
```

Setze dieselben Werte für `<console-domain>` und `<email-address>` ein.

Was sich ändert:

- Die Ports 80 und 443 müssen den Server erreichen und auf ihm frei sein. Das
  Skript bricht ab, wenn ein anderes Programm sie belegt, warnt, wenn der
  DNS-Name noch nicht auf den Server zeigt, und wartet auf das Zertifikat.
- Die Konsole antwortet dann unter `https://` und deinem DNS-Namen. Ihr
  eigener Port antwortet nur noch auf der Maschine selbst.
- `--letsencrypt-staging` holt ein Testzertifikat vom Staging-Server von
  Let's Encrypt, dem Browser nicht vertrauen. `--no-traefik` bei
  `neodesk-docker.sh` entfernt Traefik wieder.

Die RustDesk-Clients nutzen weiter ihre eigenen Ports. Hast du schon einen
Reverse Proxy, siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

## Die Computer aufnehmen {#bring-the-computers-in}

Für einen Computer, dem du öfter hilfst, öffnest du **Geräte**, wählst
**Computer hinzufügen** und schickst den Einladungslink. Die Person installiert
über den Link den NeoDesk-Client, und der Computer erscheint in deiner
Geräteliste, schon genehmigt; siehe
[Computer hinzufügen](/docs/console/add-a-computer).

Für einmalige Hilfe schickst du stattdessen einen
[Schnellhilfe-Link](/docs/console/quick-support). Er gilt einmal für eine
Stunde, die Person klickt in einer kleinen App auf **Erlauben**, und
installiert wird nichts.

Für dein Handy öffnest du **Übersicht** und klickst unter
**Client-Einrichtung** auf **QR anzeigen**. Die RustDesk-App auf dem Handy
scannt den Code und füllt die Servereinstellungen aus.

![Die Seite Übersicht mit der markierten Spalte Client-Einrichtung](shot:client-setup)

## Einen Computer zu Hause aufwecken {#wake-a-computer-at-home}

Der Server kann einen Computer in seinem eigenen Netz per Wake-on-LAN
aufwecken: Öffne **Support**, **Netzwerk-Tools**, dann **Wake-on-LAN**, und
gib die MAC-Adresse des Computers ein. Das Paket geht vom Server aus, das
klappt also für Computer im selben Netz wie der Server. Siehe
[Unbeaufsichtigter Zugriff und Wake-on-LAN](/docs/console/unattended-access#wake-on-lan).

## Am Laufen halten {#keep-it-running}

Aktualisiere mit demselben Skript, in seinem Ordner:

```bash
cd /opt/neodesk/docker
sudo bash neodesk-docker.sh update
```

Es sichert vorher die Daten und geht zum alten Image zurück, wenn der neue
Container nicht gesund startet. Sichere die Schlüsseldateien des Servers mit
den Daten: An ihnen erkennen deine Clients den Server, und ohne sie braucht
jeder Client einen neuen Schlüssel. Siehe [Aktualisieren](/docs/operations/updating)
und [Backup und Wiederherstellung](/docs/operations/backup).

## Was es kostet {#what-it-costs}

NeoDesk ist kostenlos und Open Source unter der AGPL-3.0. Es schickt keine
Analysedaten, Absturzberichte oder Nutzungsdaten;
[Datenschutz](/docs/project/privacy) listet die Hosts, die der Server
kontaktiert, etwa GitHub für die Client-Downloads. Bezahlten Support gibt es
nicht.
