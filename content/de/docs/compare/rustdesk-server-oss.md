---
title: NeoDesk und RustDesk Server OSS im Vergleich
description: Der freie Server von RustDesk besteht aus hbbs und hbbr. NeoDesk erledigt beides in einem Programm und bringt Web-Konsole, Konten und Anmeldung mit.
order: 2
og: comparison
product: RustDesk Server OSS
logo: rustdesk.svg
---

RustDesk Server OSS ist der freie Server von RustDesk: zwei Programme, hbbs
und hbbr. NeoDesk erledigt dieselbe Arbeit in einem Programm und bringt
zusätzlich die API mit, bei der sich der Client anmeldet, eine Web-Konsole,
Benutzerkonten und Anmeldung. Beide sind kostenlos, stehen unter der AGPL-3.0
und funktionieren mit dem normalen RustDesk-Client. Alles, was hier über
RustDesk Server OSS steht, stammt von den Seiten von RustDesk selbst und aus
seinem GitHub-Repository, gelesen am 25. November 2026 und aufgeführt unter
[Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**RustDesk Server OSS** passt, wenn der Client nur einen Server zum Anmelden
und ein Relay braucht: Du richtest jeden Client von Hand ein und brauchst
keine Benutzerkonten, kein Adressbuch, keine Konsole und kein Protokoll. Er
kommt vom selben Team wie der Client.

**NeoDesk** passt, wenn du dazu eine Geräteliste willst, Konten, mit denen
sich Leute im Client anmelden, Anmeldung über LDAP oder OIDC, eine Freigabe
für neue Geräte und ein Audit-Protokoll, ohne Server Pro zu kaufen. Läuft bei
dir heute hbbs und hbbr, übernimmt NeoDesk deren Schlüssel, und deine Clients
arbeiten weiter.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | RustDesk Server OSS |
|---|---|---|
| Lizenz | AGPL-3.0 | AGPL-3.0 |
| Preis | Kostenlos | Kostenlos |
| Programme | Eins, `neodesk-server`: ID-Server, Relay, Client-API und Web-Konsole | Zwei: hbbs für ID, Rendezvous und Signalisierung, hbbr für das Relay |
| Installation | Docker, ein Skript für Linux mit systemd, ein Skript für 64-Bit-Windows | Docker (empfohlen), ein Installationsskript bei Techahold, .deb-Pakete, Windows mit PM2 oder NSSM, Synology. Release-Builds für Linux auf x86 und ARM und für 64-Bit-Windows |
| Ports für die Clients | 21115 bis 21117 und 21121 über TCP, 21116 über UDP | 21115 bis 21117 über TCP, 21116 über UDP. 21118 und 21119 nur für den Web-Client |
| Web-Konsole, Konten, API, OIDC, LDAP, 2FA, Geräteverwaltung | Ja | Nicht enthalten. Die Doku von RustDesk verweist dafür auf Server Pro |
| Adressbuch im Client | Ja, persönlich und gemeinsam pro Organisation | RustDesk nennt das Adressbuch bei den Gründen, Server Pro statt OSS zu wählen |
| Kommandozeilen-Werkzeuge | `neodesk-server reset-password` und die Befehle update, status und backup der Installer | rustdesk-utils |
| Schlüssel | NeoDesk liest die Schlüsseldateien `id_ed25519` von RustDesk so, wie sie sind | Die Clients brauchen den öffentlichen Schlüssel des Servers. hbbs legt das Schlüsselpaar in `id_ed25519` und `id_ed25519.pub` ab |

## Was RustDesk Server OSS besser kann {#what-rustdesk-server-oss-does-better}

- **Das Team hinter dem Client.** RustDesk baut den Client und diesen Server.
  NeoDesk ist ein eigenes Projekt, das das Protokoll des Clients spricht.
- **Weniger zu betreiben.** Zwei Programme, keine Web-App, keine Konten.
  NeoDesk bringt eine Konsole, eine Client-API auf 21121 und Benutzerkonten
  mit, und das heißt mehr einzurichten, zu aktualisieren und zu sichern.
- **Mehr Wege zur Installation.** RustDesk hat Anleitungen für Docker, ein
  Installationsskript für Linux, .deb-Pakete, Windows-Dienste und Synology-NAS
  und veröffentlicht Builds für Linux auf x86 und ARM, mit 32 und 64 Bit.
- **Längere Geschichte.** Sein erstes Release auf GitHub, 1.1.5, erschien im
  März 2022, das neueste, 1.1.16, im Juli 2026. NeoDesk hat bisher nur
  Vorabversionen, die erste vom November 2026.

## Was NeoDesk anders macht {#what-neodesk-does-differently}

- **Ein Programm.** `neodesk-server` betreibt ID-Server, Relay, die API für
  die Clients und die Konsole; siehe [Einführung](/docs/getting-started/introduction).
- **Konten im Client.** Leute melden sich im normalen RustDesk-Client mit ihrem
  Konsolenkonto an, mit einem Verzeichniskonto über
  [LDAP oder Active Directory](/docs/people/ldap) oder per
  [Single Sign-on](/docs/people/oidc), und bekommen ihr Adressbuch.
  [Organisationen](/docs/people/organizations) teilen ein gemeinsames
  Adressbuch mit ihren Mitgliedern.
- **Freigabe vor dem Zugriff.** Im Modus **Verwaltet** wartet ein neues Gerät
  unter **Registrierungsanfragen**, bis es jemand genehmigt; siehe
  [Registrierung](/docs/console/enrollment).
- **Eine Konsole.** Die [Geräteliste](/docs/console/devices), Benutzer und
  Rollen, ein [Audit-Protokoll](/docs/console/activity),
  [Remote Desktop im Browser](/docs/console/remote-in-browser) und
  [Schnellhilfe-Links](/docs/console/quick-support).
- **Ein Client ohne öffentlichen Server.** Laut Client-Doku von RustDesk
  verbindet sich der normale Client nach der Installation mit den öffentlichen
  Servern von RustDesk; deinen eigenen Server trägst du in seinen
  Netzwerkeinstellungen ein. Im NeoDesk-Client ist kein öffentlicher Server
  eingebaut, und [Computer hinzufügen](/docs/console/add-a-computer) verbindet
  ihn über einen Einladungslink mit deinem Server.

## Lizenz und Kosten {#license-and-cost}

Beide Server sind kostenlos und stehen unter der AGPL-3.0. Du darfst sie
nutzen, ändern und betreiben, auch gewerblich. Änderst du einen davon und
bietest ihn als Netzwerkdienst an, gibst du deine Änderungen an die Leute
weiter, die den Dienst nutzen. Keiner von beiden hat einen Bezahltarif;
Konsole und Konten verkauft RustDesk als
[Server Pro](/docs/compare/rustdesk-server-pro). Für NeoDesk gibt es bezahlten
Support und Hilfe bei der Einrichtung auf Anfrage über
[support@neode.sk](mailto:support@neode.sk); siehe
[Preis und Support](/docs/project/license#price-and-support).

## Von RustDesk Server OSS zu NeoDesk umziehen {#move-from-rustdesk-server-oss-to-neodesk}

[Umzug von einem RustDesk-Server](/docs/getting-started/migrate-from-rustdesk)
beschreibt jeden Schritt, unter Linux, Windows und in Docker. Kurz gesagt:

1. Kopiere den alten Datenordner mit `id_ed25519`, `id_ed25519.pub` und
   `db_v2.sqlite3`, dann stoppe hbbs und hbbr.
2. Gib NeoDesk das alte Schlüsselpaar: unter Linux und Windows vor der
   Installation, in Docker danach in den Container.
3. Betreibe NeoDesk unter der alten Adresse, oder lass den alten DNS-Namen
   auf den neuen Server zeigen.
4. Lass die Clients herein: Genehmige sie unter **Registrierungsanfragen**,
   oder schalte auf **Offen**, solange sie zurückkommen.

Die Clients behalten ihre Einstellungen und ihre IDs. Die Geräteliste beginnt
leer und füllt sich, wenn sich die Clients verbinden; auf PostgreSQL kann der
Installer die Geräte aus der Datenbank von RustDesk übernehmen.

RustDesk stammt von der Purslane Tech Pte. Ltd. NeoDesk ist weder mit RustDesk
noch mit Purslane Tech verbunden und wird von ihnen nicht unterstützt; siehe
[Lizenz](/docs/project/license#trademark).

## Quellen {#sources}

Alle Seiten wurden am 25. November 2026 gelesen.

- [rustdesk.com, Doku zu Server OSS](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/):
  Server OSS ist frei und quelloffen, hbbs übernimmt ID, Rendezvous und
  Signalisierung, hbbr das Relay, die Installationsanleitungen, und Web-Konsole,
  API, OIDC, LDAP, 2FA und Geräteverwaltung, für die RustDesk auf Server Pro
  verweist.
- [rustdesk.com, Doku zur Installation von Server OSS](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/install/):
  Docker als empfohlene Installation, das Installationsskript bei Techahold,
  .deb-Pakete von der Release-Seite und ID-Server und öffentlicher Schlüssel,
  die die Clients brauchen.
- [rustdesk.com, Doku zu Server OSS mit Docker](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/docker/):
  die Ports, und dass 21118 und 21119 nur dem Web-Client dienen und ohne ihn
  geschlossen bleiben können.
- [rustdesk.com, Server OSS unter Windows](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/windows/):
  hbbs und hbbr mit PM2 oder NSSM betreiben.
- [rustdesk.com, Server OSS auf Synology](https://rustdesk.com/docs/en/self-host/rustdesk-server-oss/synology/):
  Anleitungen für DSM 6 und den Container Manager von DSM 7.2.
- [rustdesk.com, Doku zu Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/):
  Konten, Web-Konsole, Adressbuch und Protokollverwaltung bei den Gründen,
  Server Pro zu wählen, wenn OSS nicht reicht.
- [rustdesk.com, Preise](https://rustdesk.com/pricing): Selbst hosten mit OSS
  kostet nichts, Server Pro hat Bezahltarife.
- [github.com, rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server):
  die Lizenz AGPL-3.0 und die drei Programme, die der Build erzeugt: hbbs,
  hbbr und rustdesk-utils.
- [github.com, Lizenz von rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server/blob/master/LICENSE):
  die Bedingungen der AGPL-3.0 für Nutzung, Änderungen und Netzwerkdienste.
- [github.com, Quellcode von rustdesk-server, common.rs](https://github.com/rustdesk/rustdesk-server/blob/master/src/common.rs)
  und [peer.rs](https://github.com/rustdesk/rustdesk-server/blob/master/src/peer.rs):
  die Schlüsseldateien `id_ed25519` und `id_ed25519.pub` und die Datenbank
  `db_v2.sqlite3`.
- [github.com, Releases von rustdesk/rustdesk-server](https://github.com/rustdesk/rustdesk-server/releases):
  das älteste Release, 1.1.5 vom März 2022, das neueste, 1.1.16 vom Juli
  2026, und die Builds für Linux auf x86 und ARM und für 64-Bit-Windows.
- [rustdesk.com, Client-Doku](https://rustdesk.com/docs/en/client/): Der
  Client verbindet sich nach der Installation mit den öffentlichen Servern,
  und ID-Server, Relay und Schlüssel trägst du in seinen Einstellungen unter
  Netzwerk ein.
- [rustdesk.com, Nutzungsbedingungen](https://rustdesk.com/terms): Die
  Purslane Tech Pte. Ltd. betreibt die öffentlichen ID- und Relay-Server und
  veröffentlicht Client und Server OSS unter einer Open-Source-Lizenz.
