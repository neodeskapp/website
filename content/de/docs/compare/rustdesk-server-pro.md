---
title: NeoDesk und RustDesk Server Pro im Vergleich
description: NeoDesk ist eine freie Open-Source-Alternative zu RustDesk Server Pro. Was beide können, was Pro besser macht, Lizenzen, Preise und der Umzug.
order: 1
og: comparison
product: RustDesk Server Pro
---

Beide sind Server für den RustDesk-Client, die du selbst betreibst, mit
Web-Konsole, Benutzerkonten und Audit-Protokoll. RustDesk Server Pro ist der
kostenpflichtige Server von RustDesk. NeoDesk ist Open Source unter der
AGPL-3.0 und hat keinen Bezahltarif. Alles, was hier über Server Pro steht,
stammt von den Seiten von RustDesk selbst, gelesen am 23. November 2026 und
aufgeführt unter [Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**RustDesk Server Pro** passt, wenn du den Server bei der Firma kaufen willst,
die auch den Client baut, wenn deine Clients mit fest eingetragenem Server
kommen sollen (der Custom Client Generator, ab dem Tarif Basic), oder wenn du
Relay-Server an mehreren Standorten brauchst.

**NeoDesk** passt, wenn du Konsole, Benutzerkonten, Anmeldung über LDAP oder
OIDC und ein Audit-Protokoll auf deinem eigenen Server haben willst, ohne
Lizenzgebühr, ohne Grenze bei Benutzern oder Geräten und ohne Lizenzprüfung.
Außerdem landen Computer mit dem Agenten von MeshCentral sowie RDP- und
VNC-Hosts in derselben Geräteliste.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | RustDesk Server Pro |
|---|---|---|
| Lizenz | AGPL-3.0 | Proprietär: „commercial, proprietary self-hosted server software“ |
| Preis | Kostenlos | Ab 11,88 US-Dollar im Monat bei jährlicher Zahlung, Stand 23. November 2026 |
| Benutzer und Geräte | Keine Grenze durch eine Lizenz | Tarif Individual: 1 Benutzer zum Anmelden und 20 verwaltete Geräte. Basic: 10 Benutzer und 100 Geräte. Mehr in den Customized-Tarifen |
| Lizenzprüfung | Keine | Der Server meldet sich etwa einmal am Tag bei rustdesk.com. Ein komplett abgeschotteter Betrieb (air-gapped) wird nicht unterstützt |
| Installation | Docker, Linux mit systemd oder 64-Bit-Windows | Docker oder install.sh unter Linux mit systemd. Die Installation unter Windows führt RustDesk als veraltet |
| Web-Konsole | Ja | Ja, in jedem Bezahltarif |
| Zwei-Faktor-Anmeldung | Ja | Ja, in jedem Bezahltarif |
| LDAP und OIDC | Ja | Ab dem Tarif Basic |
| Adressbuch | Persönliche Adressbücher und ein gemeinsames pro Organisation | Ja, in jedem Bezahltarif |
| Protokolle | Aktionen in der Konsole, Ereignisse des Servers und die Verbindungs-, Dateiübertragungs- und Alarmeinträge der Clients. 90 Tage aufbewahrt | Verbindungs-, Dateiübertragungs-, Alarm- und Konsolenprotokolle. Die Aufbewahrung stellst du ein, auch unbegrenzt |
| Remote Desktop im Browser | Der Web-Viewer der Konsole, in jeder Installation | Der selbst gehostete Web-Client, nur in Tarifen mit Benutzer × 10 + Geräte von mindestens 400 |
| Relay-Server | Ein Relay, eingebaut in den Server | Verteilte Relay-Server in jedem Bezahltarif |
| Client mit eingetragenem Server | Kein eigener Build. Der NeoDesk-Client tritt deinem Server über einen Einladungslink bei | Custom Client Generator, ab dem Tarif Basic |
| Was sich verbindet | Der normale RustDesk-Client, der NeoDesk-Client, der unveränderte MeshAgent sowie RDP- und VNC-Hosts | Der RustDesk-Client |

## Was Server Pro besser kann {#what-server-pro-does-better}

- **Client und Server aus einer Hand.** RustDesk baut den Client und Server
  Pro. NeoDesk ist ein eigenes Projekt, das das Protokoll des Clients spricht.
- **Clients mit eingebautem Server.** Der Custom Client Generator baut ab dem
  Tarif Basic einen Client, der schon auf deinen Server zeigt. NeoDesk baut
  keine eigenen Clients: Im normalen Client trägst du vier Werte ein oder
  importierst sie als eine Zeichenkette, und nur der NeoDesk-Client richtet
  sich über einen Einladungslink selbst ein.
- **Mehrere Relays.** Jeder Bezahltarif hat verteilte Relay-Server. NeoDesk
  gibt jedem Gerät eine Relay-Adresse.
- **Längere Aufbewahrung.** Pro hält Protokolle so lange, wie du einstellst,
  auch unbegrenzt. NeoDesk löscht seine Einträge nach 90 Tagen. Nur die
  Ereignisse des Servers kann es zusätzlich mit `AUDIT_LOG_FILE` in eine Datei
  schreiben, die du behältst; siehe
  [Überwachung](/docs/operations/monitoring#audit-entries).

## Was NeoDesk anders macht {#what-neodesk-does-differently}

- **Keine Lizenz zu kaufen.** Es gibt keine Gebühr, keinen Tarif und keine
  Grenze bei Benutzern oder Geräten, und der Server prüft bei niemandem eine
  Lizenz. [Datenschutz](/docs/project/privacy) listet jeden Host, den er
  kontaktiert.
- **Anmeldung in jeder Installation.** [LDAP und Active Directory](/docs/people/ldap),
  [OIDC](/docs/people/oidc) und [Zwei-Faktor-Anmeldung](/docs/people/two-factor)
  sind immer dabei. Verzeichnis- und Single-Sign-on-Konten melden sich auch im
  normalen RustDesk-Client an.
- **Freigabe vor dem Zugriff.** Im Modus **Verwaltet** wartet ein neues Gerät
  unter **Registrierungsanfragen**, bis es jemand genehmigt; siehe
  [Registrierung](/docs/console/enrollment).
- **Remote Desktop im Browser** in jeder Installation, für Browser auf
  Desktop und Tablet; siehe [Remote Desktop im Browser](/docs/console/remote-in-browser).
- **Hilfe ohne Einrichtung.** Die [Schnellhilfe](/docs/console/quick-support)
  erstellt einen Link, der einmal für eine Stunde gilt: Die Person lädt eine
  kleine App, klickt auf **Erlauben**, und installiert wird nichts.
  [Computer hinzufügen](/docs/console/add-a-computer) erstellt einen
  Einladungslink, der den NeoDesk-Client installiert und den Computer gleich
  genehmigt aufnimmt.
- **Andere Gerätearten.** Computer mit dem unveränderten
  [MeshAgent](/docs/console/meshagent) und [RDP- und VNC-Hosts](/docs/console/remote-targets)
  über den Guacamole-Daemon stehen in derselben Geräteliste.
- **Windows und PostgreSQL.** [Windows](/docs/getting-started/windows) ist eine
  ganz normale Installation, und als Datenbank dient SQLite oder
  [PostgreSQL](/docs/operations/postgresql).

Es gibt auch Grenzen, mit denen Pro-Nutzer vielleicht nicht rechnen.
Browser-Sitzungen zu RustDesk-Geräten laufen immer über das Relay. Eine
NeoDesk-App fürs Handy gibt es nicht: Auf dem Handy nimmst du die RustDesk-App.
Einen Gastzugriff-Link kannst du nicht vor seinem Ablauf beenden.

## Lizenz und Kosten {#license-and-cost}

RustDesk verkauft Server Pro als Jahrestarife in US-Dollar. Laut Preisseite
ist das „NOT a SaaS subscription“: Den Server betreibst du selbst. Die Tarife
verlängern sich nicht von allein, und RustDesk schickt 14 Tage vor Ablauf
einer Lizenz eine Erinnerung per E-Mail. Die Tarife, Stand 23. November 2026,
jeweils bei jährlicher Zahlung:

| Tarif | Preis | Enthalten |
|---|---|---|
| Free | 0 US-Dollar | Online-Status und Community-Support |
| Individual | 11,88 US-Dollar im Monat | 1 Benutzer zum Anmelden, 20 verwaltete Geräte, unbegrenzt gleichzeitige Verbindungen, 2FA, Web-Konsole, Adressbuch, Audit-Protokoll, ID ändern, Zugriffssteuerung, zentrale Einstellungen, verteilte Relay-Server |
| Basic | 23,88 US-Dollar im Monat | 10 Benutzer und 100 verwaltete Geräte, dazu OIDC, LDAP, gruppenübergreifender Zugriff und der Custom Client Generator |
| Customized | ab 23,88 US-Dollar im Monat | Basic, dazu 1,20 US-Dollar für jeden weiteren Benutzer und 0,12 US-Dollar für jedes weitere Gerät |
| Customized V2 | ab 23,88 US-Dollar im Monat | Basic mit begrenzt vielen gleichzeitigen Verbindungen, dazu 24 US-Dollar für jede weitere gleichzeitige Verbindung |

NeoDesk kostet nichts. Die AGPL-3.0 erlaubt dir, es zu nutzen, zu ändern und
zu betreiben, auch gewerblich. Änderst du es und bietest es als Netzwerkdienst
an, gibst du deine Änderungen an die Leute weiter, die den Dienst nutzen. Ein
optionaler Commercial Grant für private Änderungen gehört zu einem Sponsoring
ab 50 US-Dollar im Monat; zum Betrieb von NeoDesk braucht ihn niemand. Bezahlten
Support und ein garantiertes SLA gibt es nicht. Siehe
[Lizenz](/docs/project/license).

## Von Server Pro zu NeoDesk umziehen {#move-from-server-pro-to-neodesk}

Die [Umzugsanleitung](/docs/getting-started/migrate-from-rustdesk) von NeoDesk
ist für den freien Server von RustDesk geschrieben, also hbbs und hbbr: Du
behältst Schlüsselpaar und Adresse, und die Clients verbinden sich mit NeoDesk
wie vorher. Bei Server Pro gilt zusätzlich:

- Die Doku von RustDesk zieht einen freien Server zu Pro um, indem sie seine
  Datei `id_ed25519` kopiert. Ein Pro-Server hält seinen Schlüssel also in
  derselben Art Datei. Die Doku von NeoDesk deckt eine Pro-Installation nicht
  ab, probier den Schlüssel deshalb erst mit einem Test-Client aus, bevor du
  alle umziehst.
- NeoDesk übernimmt nichts aus Pro. Benutzer, Gruppen, Adressbücher und die
  Anmeldung richtest du in der Konsole neu ein. Die Protokolle von Pro bleiben
  bei Pro.
- Jeder Client meldet sich als neues Gerät. Im Modus **Verwaltet** wartet er
  auf die Freigabe, oder du schaltest auf **Offen**, solange die Clients
  zurückkommen; siehe
  [Die Clients wieder hereinlassen](/docs/getting-started/migrate-from-rustdesk#let-the-clients-back-in).
- Die Tarife von Pro verlängern sich nicht von allein, du musst also nichts
  kündigen.

„RustDesk“ ist eine Marke des RustDesk-Teams. NeoDesk ist nicht mit dem
RustDesk-Team verbunden und wird nicht von ihm unterstützt; siehe
[Lizenz](/docs/project/license#trademark).

## Quellen {#sources}

Alle Seiten wurden am 23. November 2026 gelesen.

- [rustdesk.com, Preise](https://rustdesk.com/pricing): Tarife, Preise,
  Grenzen, Abrechnung, Verlängerung und die Bedingung für den Web-Client.
- [rustdesk.com, Doku zu Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/):
  Installationswege und die veraltete Installation unter Windows.
- [rustdesk.com, Doku zur Web-Konsole von Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/console/):
  Protokollarten und wie lange Protokolle aufbewahrt werden.
- [rustdesk.com, Doku zur Installation von Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/installscript/):
  den Schlüssel `id_ed25519` vom freien Server zu Pro umziehen.
- [rustdesk.com, Blogbeitrag zum Betrieb offline und air-gapped](https://rustdesk.com/blog/rustdesk-server-pro-offline-air-gapped/):
  die tägliche Lizenzprüfung und abgeschottete Installationen.
- [rustdesk.com, Blogbeitrag zum unbeaufsichtigten Zugriff](https://rustdesk.com/blog/rustdesk-unattended-access-setup/):
  „Server Pro is commercial, proprietary self-hosted server software.“
