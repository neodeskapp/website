---
title: Datenschutz
description: Was NeoDesk auf deinem Server speichert und welche Hosts der Server, die Konsole und die Installer kontaktieren, und wann.
order: 2
---

NeoDesk läuft auf einem Rechner, den du kontrollierst. Das Projekt betreibt keinen Dienst, der deine Geräte, Konten oder Sitzungen empfängt, und der Code schickt keine Analysedaten, Absturzberichte oder Nutzungsdaten an irgendwen. Diese Seite listet, was der Server speichert, und jeden Host, den er kontaktiert. Sie beschreibt den Code von NeoDesk {{VERSION}} aus [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk); andere Builds können abweichen.

## Was auf deinem Server bleibt {#what-stays-on-your-server}

Die Datenbank, eine SQLite-Datei oder PostgreSQL, enthält:

- Geräte: ID, IP-Adresse, Hostname, Betriebssystem, Client-Version, wann das Gerät zuletzt online war, sowie seine Notizen und Tags
- Konten: Benutzername, E-Mail-Adresse, Anzeigename, Passwort-Hash, Rolle, Zwei-Faktor-Geheimnis und letzte Anmeldung
- die Adressbücher, die RustDesk-Clients abgleichen
- Gerätemetriken (Auslastung von CPU, Arbeitsspeicher und Festplatte), das Audit-Protokoll der Konsole, die Ereignisse des Servers und Aufzeichnungen über Verbindungen und Dateiübertragungen
- die Nachrichten, die im **Chat** geschickt werden

Der Server speichert Chatnachrichten so, wie sie geschrieben wurden. Sie sind nicht Ende-zu-Ende-verschlüsselt: Wer die Datenbank lesen kann, kann auch sie lesen. Die stündliche Bereinigung löscht sie nicht.

Die Konsole legt außerdem Dateien in ihrem Datenordner ab, etwa hochgeladene Bilder und Schriften, Dateien aus dem Chat und ihre eigenen Backups. [Backup und Wiederherstellung](/docs/operations/backup#what-to-back-up) listet jede Datei für jede Installationsart, und unter [Monitoring](/docs/operations/monitoring#how-long-records-are-kept) steht, wie lange der Server jede Art von Aufzeichnung aufbewahrt.

## Was der Server von selbst kontaktiert {#what-the-server-contacts-on-its-own}

Diese Verbindungen entstehen, ohne dass jemand etwas tut.

### Die öffentliche IP-Adresse {#the-public-ip-address}

Bei jedem Start fragt der Server `https://checkip.amazonaws.com`, dann `https://api.ipify.org`, dann `https://ifconfig.me/ip` nach seiner öffentlichen IPv4-Adresse. Scheitert HTTPS, versucht er dieselben Hosts über einfaches HTTP. Clients bekommen diese Adresse als Relay-Adresse, außer `RELAY_SERVERS` oder die Einstellungen der Konsole nennen einen Relay-Server. Die Abfrage beim Start läuft auch dann, wenn einer genannt ist. Findet der Server keine öffentliche Adresse und ist kein Relay-Server genannt, fragt er alle 60 Sekunden erneut, bis er eine findet.

Um seine Adresse im lokalen Netz zu erfahren, fragt der Server das Betriebssystem, welche Adresse es nutzen würde, um 8.8.8.8 zu erreichen. Dabei wird kein Paket verschickt.

### Zeitserver {#time-servers}

Alle 60 Sekunden fragt der Server jeden Zeitserver auf seiner Liste per NTP (UDP-Port 123) nach der Zeit und vergleicht sie mit seiner eigenen Uhr. Die Liste ist pool.ntp.org, time.google.com und time.cloudflare.com. Ändern kannst du sie unter **Einstellungen**, **Zeitzonen**, **Zeitserver** oder mit `NTP_SERVERS` in der env-Datei. Steht dein eigener Zeitserver auf der Liste, bleiben diese Abfragen in deinem Netz.

### Das lokale Netz {#the-local-network}

Die Konsole beantwortet Discovery-Anfragen auf UDP-Port 21119 (`DISCOVERY_PORT`), damit Apps im selben Netz sie finden. Sie antwortet nur Absendern aus einem lokalen Netz: Loopback, die privaten und Link-Local-Bereiche, Carrier-Grade NAT und die Netze der eigenen Schnittstellen des Servers. Die Antwort enthält den Namen des Rechners, die NeoDesk-Version, die Ports, den öffentlichen Schlüssel des Servers, die IPv4-Adressen des Servers und die Adresse der Konsole. Die Konsole sendet nichts, bis eine Anfrage eintrifft.

Ist `PANEL_MDNS` eingeschaltet, kündigt sich die Konsole außerdem per mDNS (UDP-Port 5353) als `_neodesk._tcp` an, mit Port, Adresse und Version. Ohne diese Einstellung gibt es keine Ankündigung.

## Was der Server kontaktiert, wenn jemand eine Funktion nutzt {#what-the-server-contacts-when-someone-uses-a-feature}

### Updates {#updates}

Wenn jemand **Einstellungen**, **Updates** öffnet und wenn jemand auf **Jetzt prüfen** klickt, fragt die Konsole die API von GitHub (api.github.com) nach den Releases von neodeskapp/neodesk oder des Repositorys, das `UPDATE_GITHUB_OWNER` und `UPDATE_GITHUB_REPO` nennen. Sie behält die Antworten zwei Minuten lang. **Install Update** lädt das Release von github.com und den Datei-Hosts von GitHub herunter.

Die Anfragen tragen den User-Agent `NeoDesk-Console/<version>` und keine Kennung deiner Installation. GitHub sieht die IP-Adresse des Servers, wie bei jedem Download. Ein Token in `UPDATE_GITHUB_TOKEN` oder `GITHUB_TOKEN` geht nur an api.github.com. Siehe [Aktualisieren](/docs/operations/updating#the-updates-page-in-the-console).

### Client-Downloads für Einladungen {#client-downloads-for-invites}

Ein Einladungslink aus **Computer hinzufügen** oder **Schnellhilfe** öffnet eine Seite, auf der der Client zum Download bereitsteht. Um sie zu füllen, sucht der Server höchstens alle sechs Stunden das neueste Release von neodeskapp/neodesk-client auf GitHub, oder das neueste Pre-Release, solange es kein stabiles gibt. Ein Paket lädt er herunter, wenn es zum ersten Mal jemand anfordert, prüft es gegen die signierten Prüfsummen des Releases und legt es in seinem Datenordner ab. `NEODESK_CLIENT_REPO` nennt ein anderes Repository. Mit `NEODESK_CLIENT_RELEASE_DIR` nimmt der Server die Pakete aus diesem Ordner und fragt GitHub nicht.

### Support-Agenten {#support-agents}

**Neueste Version importieren** auf der Seite **Support-Agenten** lädt das neueste signierte Release des Support-Agenten von neodeskapp/neodesk-client auf GitHub herunter, oder aus dem Repository, das `NEODESK_SUPPORT_RELEASE_REPO` nennt. Bis jemand darauf klickt, wird nichts geholt.

### E-Mail {#mail}

Die Konsole verschickt E-Mails nur über den Mailserver, der unter **Einstellungen**, **E-Mail** oder in `SMTP_HOST` eingestellt ist (siehe [Konfiguration](/docs/operations/configuration#mail)). Sie verschickt Alarme, Hilfeanfragen von Geräten sowie Einladungs- und Schnellhilfe-Links, die jemand per E-Mail verschicken will. Der Verbindungstest meldet sich am Mailserver an, ohne eine E-Mail zu verschicken. Ohne Mailserver verschickt die Konsole keine E-Mails.

### Schriften {#fonts}

Wählt jemand unter **Einstellungen**, **Darstellung** eine Schrift aus **Google Fonts**, lädt der Server sie von fonts.googleapis.com und fonts.gstatic.com herunter. Danach liefert die Konsole die Schrift selbst aus.

### Anmeldeanbieter {#sign-in-providers}

Mit Single Sign-on spricht der Server mit den Adressen des Anbieters, wenn sich jemand anmeldet und wenn jemand auf **Discovery testen** klickt. Ist **Automatische Discovery** an, holt er außerdem beim Start das Discovery-Dokument des Anbieters, und zwar alle zwei Minuten, bis er eines bekommt. Schickt der Anbieter bei der Anmeldung eine Bildadresse mit, lädt die Konsole das Bild herunter und speichert es als Bild des Kontos. Siehe [Single Sign-on mit OIDC](/docs/people/oidc).

Mit LDAP oder Active Directory verbindet sich der Server mit dem Verzeichnisserver, wenn sich jemand mit einem Verzeichniskonto anmeldet oder die Einstellungen testet. Siehe [LDAP und Active Directory](/docs/people/ldap).

### Hosts, die ein Admin einträgt {#hosts-an-administrator-names}

Diese Funktionen erreichen nur die Adressen, die jemand in der Konsole einträgt:

- **Netzwerküberwachung** pingt die Ziele, öffnet ihre Ports oder ruft ihre URLs ab.
- **Netzwerk-Tools** prüft Zertifikate und fragt DNS-Einträge der Namen ab, die du einträgst.
- [RDP- und VNC-Ziele](/docs/console/remote-targets) verbinden sich über guacd mit den RDP- und VNC-Hosts, die du hinzufügst.
- Wake-on-LAN sendet einen Broadcast im eigenen Netz des Servers.

## Was der Browser lädt {#what-the-browser-loads}

Die Seiten der Konsole tragen eine Content-Security-Policy, nach der der Browser Skripte, Styles, Schriften und Bilder nur von der Konsole laden und sich mit nichts anderem verbinden darf. Die Links der Konsole zu GitHub, etwa zum Projekt, zu den Releases von RustDesk und zu den Sponsorenseiten, sind einfache Links: Es wird nichts gesendet, bis jemand auf einen davon klickt.

## Installer und Docker {#installers-and-docker}

Die Installationsskripte laden NeoDesk von GitHub herunter, und die Docker-Compose-Dateien ziehen das Image `ghcr.io/neodeskapp/neodesk`. Fehlt Docker, lädt `neodesk-docker.sh` das Installationsskript von Docker von get.docker.com herunter. Ein Build aus dem Quellcode lädt Go von go.dev, Go-Module von proxy.golang.org und die npm-Pakete der Web-App herunter.

Auch die Installer fragen nach der öffentlichen IP-Adresse des Servers:

| Wo | Hosts, die gefragt werden, in dieser Reihenfolge |
|---|---|
| `neodesk.sh` unter Linux | ifconfig.me, icanhazip.com |
| `neodesk.ps1` unter Windows | ipv4.icanhazip.com, ifconfig.me, icanhazip.com |
| Das Docker-Image, bei jedem Start, solange `RELAY_SERVERS` leer ist | checkip.amazonaws.com, api.ipify.org, ifconfig.me |

## Eine Verbindung melden, die hier fehlt {#report-a-connection-this-page-misses}

Stellst du fest, dass NeoDesk einen Host kontaktiert, den diese Seite nicht nennt, melde das so, wie es [SECURITY.md](https://github.com/neodeskapp/neodesk/blob/main/SECURITY.md) beschreibt, und nicht in einem öffentlichen Issue.
