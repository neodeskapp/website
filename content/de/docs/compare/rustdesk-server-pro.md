---
title: NeoDesk und RustDesk Server Pro im Vergleich
description: NeoDesk ist eine freie Open-Source-Alternative zu RustDesk Server Pro. Was beide können, was Pro besser macht, Lizenzen, Preise und der Umzug.
order: 1
og: comparison
product: RustDesk Server Pro
logo: rustdesk.svg
---

Beide sind Server für den RustDesk-Client, die du selbst betreibst, mit
Web-Konsole, Benutzerkonten und Audit-Protokoll. RustDesk Server Pro ist der
kostenpflichtige Server von RustDesk. NeoDesk ist Open Source unter der
AGPL-3.0 und hat keinen Bezahltarif. Alles, was hier über Server Pro steht,
stammt von den Seiten von RustDesk selbst, gelesen am 25. November 2026 und
aufgeführt unter [Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**RustDesk Server Pro** passt, wenn du den Server samt Kundensupport bei der
Firma kaufen willst, die auch den Client baut, wenn deine Clients mit fest
eingetragenem Server kommen sollen (der Custom Client Generator, ab dem Tarif
Basic), oder wenn du Relay-Server an mehreren Standorten brauchst.

**NeoDesk** passt, wenn du Konsole, Benutzerkonten, Anmeldung über LDAP oder
OIDC und ein Audit-Protokoll auf deinem eigenen Server haben willst, ohne
Lizenzgebühr, ohne Grenze bei Benutzern oder Geräten und ohne Lizenzprüfung.
Außerdem landen Computer mit dem Agenten von MeshCentral sowie RDP- und
VNC-Hosts in derselben Geräteliste.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | RustDesk Server Pro |
|---|---|---|
| Lizenz | AGPL-3.0 | Proprietär: „commercial, proprietary self-hosted server software“ |
| Preis | Kostenlos | Ab 11,88 US-Dollar im Monat bei jährlicher Zahlung, so zeigt es die Preisseite von RustDesk am 25. November 2026 |
| Benutzer und Geräte | Keine Grenze durch eine Lizenz | Tarif Individual: 1 Benutzer zum Anmelden und 20 verwaltete Geräte. Basic: 10 Benutzer und 100 Geräte. Mehr in den Customized-Tarifen |
| Lizenzprüfung | Keine | Der Server meldet sich einmal am Tag bei rustdesk.com. Klappt das nicht, versucht er es bis zu 7 Tage lang weiter, danach lässt sich die Lizenz nicht mehr prüfen. Einen komplett abgeschotteten Betrieb (air-gapped) unterstützt RustDesk nach eigener Aussage nicht |
| Installation | Docker, Linux mit systemd oder 64-Bit-Windows | Docker oder install.sh unter Linux mit systemd. Die Installation unter Windows führt RustDesk als veraltet |
| Web-Konsole | Ja | Ja, in jedem Bezahltarif |
| Zwei-Faktor-Anmeldung | Ja | Ja, in jedem Bezahltarif |
| LDAP und OIDC | Ja | Ab dem Tarif Basic |
| Adressbuch | Persönliche Adressbücher und ein gemeinsames pro Organisation | Ja, in jedem Bezahltarif |
| Protokolle | Aktionen in der Konsole, Ereignisse des Servers und die Verbindungs-, Dateiübertragungs- und Alarmeinträge der Clients. 90 Tage aufbewahrt | Verbindungs-, Dateiübertragungs-, Alarm- und Konsolenprotokolle. Wie viele Tage sie aufbewahrt werden, stellst du ein; 0 heißt unbegrenzt |
| Remote Desktop im Browser | Der Web-Viewer der Konsole, in jeder Installation | Der selbst gehostete Web-Client, nur in Tarifen mit Benutzer × 10 + Geräte von mindestens 400 |
| Relay-Server | Ein Relay, eingebaut in den Server | Verteilte Relay-Server in jedem Bezahltarif. Mit einer GeoLite2-Datenbank wählt der Server selbst das nächstgelegene Relay |
| Support | Kostenlose Hilfe auf Discord und GitHub; bezahlter Support auf Anfrage über support@neode.sk | Kundensupport von RustDesk in jedem Bezahltarif |
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
- **Mehrere Relays.** Jeder Bezahltarif hat verteilte Relay-Server, und der
  Server kann jede Verbindung zum nächstgelegenen schicken. NeoDesk gibt
  jedem Gerät eine Relay-Adresse.
- **Längere Aufbewahrung.** Pro hält Protokolle so lange, wie du einstellst,
  auch unbegrenzt. NeoDesk löscht seine Einträge nach 90 Tagen. Nur die
  Ereignisse des Servers kann es zusätzlich mit `AUDIT_LOG_FILE` in eine Datei
  schreiben, die du behältst; siehe
  [Überwachung](/docs/operations/monitoring#audit-entries).
- **Support vom Hersteller.** Jeder Bezahltarif enthält den Kundensupport von
  RustDesk. Bezahlten Support für NeoDesk gibt es auf Anfrage, ohne Tarif dahinter.

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
  unter **Beitrittsanfragen**, bis es jemand genehmigt; siehe
  [Beitrittsanfragen](/docs/console/enrollment).
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

RustDesk verkauft Server Pro nur als Jahrestarife, mit Preisen in US-Dollar.
Laut Preisseite ist das „NOT a SaaS subscription“: Den Server betreibst du
selbst. Die Tarife verlängern sich nicht von allein, und RustDesk schickt
14 Tage vor Ablauf einer Lizenz eine Erinnerung per E-Mail. Eine Lizenz läuft
immer nur auf einem Rechner. Die Tarife, wie die Preisseite von RustDesk sie
am 25. November 2026 zeigt, jeweils als Monatspreis bei jährlicher Zahlung:

| Tarif | Preis | Enthalten |
|---|---|---|
| Free | 0 US-Dollar | Der Open-Source-Server, nicht Server Pro: Online-Status und Community-Support |
| Individual | 11,88 US-Dollar im Monat | 1 Benutzer zum Anmelden, 20 verwaltete Geräte, unbegrenzt gleichzeitige Verbindungen, 2FA, Web-Konsole, Adressbuch, Audit-Protokoll, ID ändern, Zugriffssteuerung, zentrale Einstellungen, verteilte Relay-Server |
| Basic | 23,88 US-Dollar im Monat | 10 Benutzer und 100 verwaltete Geräte, dazu OIDC, LDAP, gruppenübergreifender Zugriff und der Custom Client Generator |
| Customized | ab 23,88 US-Dollar im Monat | Basic, dazu 1,20 US-Dollar für jeden weiteren Benutzer und 0,12 US-Dollar für jedes weitere Gerät |
| Customized V2 | ab 23,88 US-Dollar im Monat | Basic mit begrenzt vielen gleichzeitigen Verbindungen, dazu 1,20 US-Dollar für jeden weiteren Benutzer, 0,12 US-Dollar für jedes weitere Gerät und 24 US-Dollar für jede weitere gleichzeitige Verbindung |

NeoDesk kostet nichts. Die AGPL-3.0 erlaubt dir, es zu nutzen, zu ändern und
zu betreiben, auch gewerblich. Änderst du es und bietest es als Netzwerkdienst
an, gibst du deine Änderungen an die Leute weiter, die den Dienst nutzen. Eine bezahlte Version gibt es nicht. Hilfe gibt es kostenlos auf dem
[NeoDesk-Discord](https://discord.gg/nwERSawufr) und in den
[Diskussionen auf GitHub](https://github.com/neodeskapp/neodesk/discussions);
bezahlten Support und Hilfe bei der Einrichtung gibt es auf Anfrage über
[support@neode.sk](mailto:support@neode.sk). Siehe
[Preis und Support](/docs/project/license#price-and-support). Ein
garantiertes SLA gibt es nicht.

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
  bei Pro; wie du sie mit dem Skript audits.py exportierst, steht in der Doku
  von RustDesk.
- Jeder Client meldet sich als neues Gerät. Im Modus **Verwaltet** wartet er
  auf die Freigabe, oder du schaltest auf **Offen**, solange die Clients
  zurückkommen; siehe
  [Die Clients wieder hereinlassen](/docs/getting-started/migrate-from-rustdesk#let-the-clients-back-in).
- Die Tarife von Pro verlängern sich nicht von allein, du musst also nichts
  kündigen.

RustDesk stammt von der Purslane Tech Pte. Ltd. NeoDesk ist weder mit RustDesk
noch mit Purslane Tech verbunden und wird von ihnen nicht unterstützt; siehe
[Lizenz](/docs/project/license#trademark).

## Quellen {#sources}

Alle Seiten wurden am 25. November 2026 gelesen.

- [rustdesk.com, Preise](https://rustdesk.com/pricing): Tarife, Preise,
  Benutzer, Geräte und gleichzeitige Verbindungen pro Tarif, die Funktionen
  jedes Tarifs, nur jährliche Zahlung, „NOT a SaaS subscription“, keine
  automatische Verlängerung und die Erinnerung 14 Tage vor Ablauf,
  Kundensupport in den Bezahltarifen und die Bedingung für den Web-Client.
- [rustdesk.com, Doku zu Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/):
  Installationswege, Docker als empfohlener Weg, die als veraltet markierte
  Installation unter Windows und was Pro dem Open-Source-Server hinzufügt.
- [rustdesk.com, Doku zur Installation von Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/installscript/):
  install.sh für systemd unter Linux und den Schlüssel `id_ed25519` vom
  freien Server zu Pro umziehen.
- [rustdesk.com, Doku zur Web-Konsole von Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/console/):
  Protokollarten, die Einstellung zur Aufbewahrung (0 heißt unbegrenzt) und
  der Export mit audits.py.
- [rustdesk.com, Doku zur Lizenz von Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/license/):
  Eine Lizenz läuft auf einem Rechner, und der Server braucht Internet oder
  einen Proxy, um sie zu prüfen.
- [rustdesk.com, Doku zu den Relay-Servern von Server Pro](https://rustdesk.com/docs/en/self-host/rustdesk-server-pro/relay/):
  mehrere Relay-Server und die Wahl des nächstgelegenen per GeoLocation.
- [RustDesk-FAQ auf GitHub](https://github.com/rustdesk/rustdesk/wiki/FAQ#how-often-does-pro-check-license):
  Pro meldet sich täglich über Port 443 bei rustdesk.com und versucht es
  bei einem Fehler jede Minute neu, bis zu 7 Tage lang.
- [rustdesk.com, Blogbeitrag zum Betrieb offline und air-gapped](https://rustdesk.com/blog/rustdesk-server-pro-offline-air-gapped/):
  Nach etwa sieben Tagen offline lässt sich die Lizenz nicht mehr prüfen, und
  ein komplett abgeschotteter Betrieb wird nicht unterstützt.
- [rustdesk.com, Blogbeitrag zum unbeaufsichtigten Zugriff](https://rustdesk.com/blog/rustdesk-unattended-access-setup/):
  „Server Pro is commercial, proprietary self-hosted server software.“
- [rustdesk.com, Nutzungsbedingungen](https://rustdesk.com/terms): Die
  Purslane Tech Pte. Ltd. betreibt die öffentlichen ID- und Relay-Server und
  veröffentlicht Client und Server OSS unter einer Open-Source-Lizenz.
