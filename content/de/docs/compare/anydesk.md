---
title: NeoDesk und AnyDesk im Vergleich
description: Eine selbst gehostete Alternative zu AnyDesk. Wie sich NeoDesk und AnyDesk bei Hosting, Tarifen, Anmeldung und Plattformen unterscheiden.
order: 5
og: comparison
product: AnyDesk
logo: anydesk.svg
---

AnyDesk ist ein Dienst für Fernwartung mit Jahresabos. Der oberste Tarif,
Ultimate, läuft wahlweise in der Cloud von AnyDesk oder On-Premises, auf einer
Appliance in deinem Netz. NeoDesk ist ein Server, den du selbst betreibst, Open
Source unter der AGPL-3.0, mit dem sich der RustDesk-Client und der eigene
Client von NeoDesk verbinden. Alles, was hier über AnyDesk steht, stammt aus
dem Hilfe-Center von AnyDesk, gelesen am 25. November 2026 und aufgeführt
unter [Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**AnyDesk** passt, wenn du einen gehosteten Dienst willst und keinen eigenen
Server, wenn du Apps von einem Hersteller auf Computern, Handys, Tablets und
Fernsehern willst, wenn du seine Clients auf älteren oder ungewöhnlichen
Systemen brauchst oder wenn du eine Appliance vom Hersteller willst, die ohne
Internetverbindung arbeitet.

**NeoDesk** passt, wenn du einen eigenen Server und Anmeldung über dein
Verzeichnis willst, ohne den obersten Tarif zu kaufen, oder wenn deine Geräte
schon den RustDesk-Client nutzen.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | AnyDesk |
|---|---|---|
| Wer die Server betreibt | Du | AnyDesk, in seiner Cloud. Ultimate gibt es auch On-Premises |
| Eigene Server | Der ganze Server gehört dir | On-Premises, nur mit Ultimate: eine Appliance auf physischer oder virtueller Hardware in deinem Netz. „Only custom AnyDesk clients created in your my.anydesk portal can connect to each other“ |
| Lizenz | AGPL-3.0 | Bezahlte Jahresabos und eine kostenlose Version mit Zeitlimits für Sitzungen. Für gewerbliche Nutzung brauchen nur ausgehende Clients, die Verbindungen starten, eine Lizenz |
| Preis | Kostenlos | Hier nicht genannt; siehe die Preisseite von AnyDesk |
| Abrechnung | Keine | Jährlich im Voraus, in einer Währung je nach Land. Abos laufen meist 12 Monate und verlängern sich automatisch, wenn du nicht spätestens 30 Tage vor dem Verlängerungsdatum kündigst |
| Benutzer | Keine Grenze durch eine Lizenz | Solo 1, Standard 20, Advanced 100. Ultimate wird angepasst, die Lizenzseite nennt keine festen Zahlen |
| Verzeichnis und Single Sign-on | LDAP und Active Directory sowie OIDC, in jeder Installation | OIDC und LDAP bei Ultimate Cloud |
| API | Eine HTTP-API mit API-Schlüsseln | Eine REST-API bei Standard, Advanced, Ultimate Cloud und On-Premises |
| Konsole | Die Web-Konsole auf deinem Server | Das Portal my.anydesk |
| Handys und Tablets | Handys steuern über die RustDesk-App. Der Browser-Viewer von NeoDesk läuft auf Tablets | Eigene Apps von AnyDesk. Die Android-App startet und empfängt Sitzungen; Android ab 5 und Fire OS ab 4 lassen sich mit einem Steuerungs-Plugin fernsteuern. iOS und iPadOS ab 16 lassen sich nicht fernsteuern, und um dich von dort zu verbinden, brauchst du einen bezahlten ausgehenden Client. ChromeOS-Geräte mit Play Store kannst du ansehen, aber nicht steuern |
| Erreichbare Computer | Geräte mit dem RustDesk-Client, der NeoDesk-Client unter Windows, macOS und Linux, der MeshAgent sowie RDP- und VNC-Hosts | Windows ab XP SP2 und Windows Server ab 2003 SP2, macOS ab 11, Linux mit Xorg für eingehende Sitzungen (Wayland nur für ausgehende), Raspberry Pi OS ab 12 (ARM64). tvOS 16 kann nur ausgehende Sitzungen |

Die Tarife von AnyDesk laut Lizenzseite:

| Tarif | Lizenzierte Benutzer | Ausgehende Verbindungen gleichzeitig | Verwaltete Geräte |
|---|---|---|---|
| Solo | 1 | 1 | Bis zu 100 |
| Standard | 20 | 1, bis zu 19 weitere als Add-on | Bis zu 500 |
| Advanced | 100 | 2, bis zu 48 weitere als Add-on | Bis zu 1.000 |
| Ultimate | Angepasst | Angepasst | Angepasst |

Verwaltete Geräte sind die, die du über unbeaufsichtigten Zugriff erreichst.
In jedem Tarif kannst du dich mit beliebig vielen Geräten verbinden, an denen
jemand die Sitzung annimmt. Mit Solo startest du Verbindungen von bis zu 3
lizenzierten Geräten. Standard und Advanced verkaufen außerdem Adressbücher
und einen Namespace als Add-on.

## Was AnyDesk besser kann {#what-anydesk-does-better}

- **Kein Server zu betreiben.** In den Cloud-Tarifen betreibt AnyDesk alles.
  Mit NeoDesk installierst, aktualisierst und sicherst du den Server selbst,
  und Sitzungen über das Relay laufen über deine Bandbreite.
- **Eigene Apps für mobile Geräte.** AnyDesk hat Apps für Android, iOS,
  iPadOS, ChromeOS, tvOS und Fire OS, und die Android-App kann Sitzungen
  starten und empfangen. Mit NeoDesk nutzen Handys die RustDesk-App.
- **Sitzungen ohne Internet.** AnyDesk On-Premises startet Sitzungen ohne
  Internetverbindung, solange beide Geräte die Appliance erreichen. Die Doku
  von NeoDesk deckt den Betrieb ohne Internetzugang nicht ab;
  [Datenschutz](/docs/project/privacy) listet die externen Hosts, die der
  Server kontaktiert.
- **Ältere und ungewöhnliche Systeme.** AnyDesk führt Windows bis zurück zu
  XP SP2, Raspberry Pi OS und tvOS.

## Was NeoDesk anders macht {#what-neodesk-does-differently}

- **Dein Server, egal wofür.** ID-Server, Relay und Konsole laufen dort, wo du
  sie hinstellst, und du musst keinen obersten Tarif kaufen. Der normale
  RustDesk-Client verbindet sich ohne eigenen Build; siehe
  [RustDesk-Client verbinden](/docs/getting-started/connect-a-client).
- **Anmeldung über dein Verzeichnis in jeder Installation.**
  [LDAP und Active Directory](/docs/people/ldap) und [OIDC](/docs/people/oidc)
  melden Leute an der Konsole und im RustDesk-Client an.
- **Keine lizenzierten Clients.** Du zählst keine Benutzer, keine ausgehenden
  Verbindungen und keine verwalteten Geräte.
  [Benutzer und Rollen](/docs/people/users-and-roles) legen fest, was jemand
  darf und welche Geräte die Person sieht.
- **RDP und VNC.** [RDP- und VNC-Hosts](/docs/console/remote-targets) öffnest
  du im Browser-Viewer, ohne Agent auf dem Host.
- **Keine Analysedaten.** NeoDesk schickt keine Analysedaten, Absturzberichte
  oder Nutzungsdaten.

## Lizenz und Kosten {#license-and-cost}

AnyDesk verkauft Abos, die jährlich im Voraus bezahlt werden, in einer
Währung, die sich nach deinem Land richtet. Sie laufen meist 12 Monate und
verlängern sich automatisch, wenn du nicht spätestens 30 Tage vor dem
Verlängerungsdatum kündigst. Für gewerbliche Nutzung brauchen nur die Clients
eine Lizenz, die Verbindungen starten; Clients, die nur Sitzungen annehmen,
nicht. Die kostenlose Version hat Zeitlimits für Sitzungen. Du kannst eine
Sitzung beliebig oft neu starten, und AnyDesk empfiehlt eine bezahlte Lizenz,
um die Zeitlimits loszuwerden. Preise nennt diese Seite nicht; sie stehen auf
der Preisseite von AnyDesk.

NeoDesk kostet nichts. Du darfst es nutzen, ändern und betreiben, auch
gewerblich. Änderst du es und bietest es als Netzwerkdienst an, gibst du deine
Änderungen an die Leute weiter, die den Dienst nutzen. Eine bezahlte Version gibt es nicht. Hilfe gibt es kostenlos auf dem
[NeoDesk-Discord](https://discord.gg/nwERSawufr) und in den
[Diskussionen auf GitHub](https://github.com/neodeskapp/neodesk/discussions);
bezahlten Support und Hilfe bei der Einrichtung gibt es auf Anfrage über
[support@neode.sk](mailto:support@neode.sk). Siehe
[Preis und Support](/docs/project/license#price-and-support).

## Von AnyDesk zu NeoDesk umziehen {#move-from-anydesk-to-neodesk}

NeoDesk übernimmt nichts aus AnyDesk, du richtest die Geräte also neu ein:

1. Installiere den Server mit [Docker](/docs/getting-started/docker), unter
   [Linux](/docs/getting-started/linux) oder unter [Windows](/docs/getting-started/windows),
   und stelle die Konsole hinter [TLS](/docs/operations/reverse-proxy-tls).
2. Rolle einen Client aus. [Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers)
   beschreibt einen Einladungslink, der den NeoDesk-Client auf vielen Computern
   installiert, und ein Windows-Skript, das den normalen RustDesk-Client
   einrichtet.
3. Für den Zugriff, wenn niemand am Computer sitzt, setzt du dort ein
   permanentes Passwort; siehe
   [Unbeaufsichtigter Zugriff](/docs/console/unattended-access).
4. Für schnelle Hilfe zwischendurch schickst du einen
   [Schnellhilfe-Link](/docs/console/quick-support).
5. Kündige AnyDesk spätestens 30 Tage vor dem Verlängerungsdatum.

AnyDesk ist eine Marke ihres Inhabers. NeoDesk ist nicht mit AnyDesk
verbunden.

## Quellen {#sources}

Alle Seiten wurden am 25. November 2026 gelesen. Die Preisseite auf
anydesk.com hat automatische Abrufe abgelehnt, deshalb zitiert diese Seite
nichts daraus.

- [support.anydesk.com, AnyDesk-Lizenzen](https://support.anydesk.com/docs/anydesk-licenses):
  Benutzer, ausgehende Verbindungen, Add-ons und verwaltete Geräte je Tarif,
  die 3 lizenzierten Geräte bei Solo, unbegrenzter beaufsichtigter Zugriff und
  Ultimate als anpassbare Lizenz in der Cloud oder On-Premises.
- [support.anydesk.com, On-Premises](https://support.anydesk.com/docs/on-premises):
  nur mit Ultimate, die Appliance auf physischer oder virtueller Hardware,
  Sitzungen ohne Internet, nur eigene Clients und die Cloud-Adressen von
  AnyDesk für normale Clients.
- [support.anydesk.com, Abrechnung](https://support.anydesk.com/docs/billing-pricing-subscriptions):
  jährliche Abrechnung im Voraus, Währung je nach Land, automatische
  Verlängerung und die Kündigungsfrist von 30 Tagen.
- [support.anydesk.com, Lizenzmodell](https://support.anydesk.com/docs/how-does-the-anydesk-licensing-model-work):
  Jahresabos, verwaltet in my.anydesk, und für gewerbliche Nutzung brauchen
  nur ausgehende Clients eine Lizenz.
- [support.anydesk.com, Single Sign-on](https://support.anydesk.com/docs/single-sign-on-sso):
  OIDC und LDAP bei Ultimate Cloud.
- [support.anydesk.com, REST-API](https://support.anydesk.com/docs/rest-api):
  die Tarife mit der REST-API.
- [support.anydesk.com, unterstützte Betriebssysteme](https://support.anydesk.com/docs/supported-operating-systems):
  die Systeme, auf denen AnyDesk läuft, und was auf Handys, Tablets, ChromeOS
  und tvOS geht.
- [support.anydesk.com, Android](https://support.anydesk.com/docs/android):
  Die Android-App startet und empfängt Sitzungen.
- [support.anydesk.com, längere Sitzungen in der kostenlosen Version](https://support.anydesk.com/docs/what-if-i-need-longer-sessions-time-on-the-free-version):
  Zeitlimits für Sitzungen in der kostenlosen Version, Neustart von Sitzungen
  und die bezahlte Lizenz als Antwort von AnyDesk.
