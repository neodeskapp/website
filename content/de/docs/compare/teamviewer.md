---
title: NeoDesk und TeamViewer im Vergleich
description: Eine selbst gehostete Alternative zu TeamViewer. Wie sich NeoDesk und TeamViewer bei Hosting, Tarifen, Anmeldung und Plattformen unterscheiden.
order: 4
og: comparison
product: TeamViewer
---

TeamViewer ist ein Dienst für Fernwartung: TeamViewer betreibt die Server, und
du kaufst ein Jahresabo. NeoDesk ist ein Server, den du selbst betreibst, Open
Source unter der AGPL-3.0, mit dem sich der RustDesk-Client und der eigene
Client von NeoDesk verbinden. Alles, was hier über TeamViewer steht, stammt von
den Seiten von TeamViewer selbst, gelesen am 23. November 2026 und aufgeführt
unter [Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**TeamViewer** passt, wenn du keinen Server betreiben willst, wenn du viele
Handys und Tablets betreust oder wenn du Single Sign-on mit
Benutzerbereitstellung aus Entra ID brauchst.

**NeoDesk** passt, wenn der Server auf deiner eigenen Maschine oder in deinem
eigenen Rechenzentrum laufen soll, oder wenn du für die Arbeit keine
Lizenzen pro Benutzer oder Kanal zahlen willst.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | TeamViewer |
|---|---|---|
| Wer die Server betreibt | Du | TeamViewer. Eine Verbindung beginnt mit einem Handshake über die Master-Server von TeamViewer |
| Eigene Server | Der ganze Server gehört dir | Nur für Tensor-Kunden mit dem Add-on Conditional Access: Router bei dir vor Ort, wobei der Verbindungsaufbau weiter über die TeamViewer-Cloud läuft („Initial connection setup is made via the TeamViewer cloud“) |
| Lizenz | AGPL-3.0 | Bezahlte Abos. Die kostenlose Version ist für die private, nicht kommerzielle Nutzung |
| Preis | Kostenlos | Hier nicht genannt; siehe die Preisseite von TeamViewer |
| Abrechnung | Keine | Jährlich. Das Abo verlängert sich alle 12 Monate, wenn du nicht spätestens 28 Tage vor Ende der Laufzeit kündigst |
| Benutzer und Sitzungen | Keine Grenze durch eine Lizenz | Je nach Tarif, von 1 Benutzer und 3 Sitzungen bei Remote Access bis 30 Benutzer und 15 Sitzungen bei Corporate |
| Zwei-Faktor-Anmeldung | Ja | Ja, in jedem Tarif |
| Verzeichnis und Single Sign-on | LDAP und Active Directory sowie OIDC, in jeder Installation | AD Connector bei Corporate und Tensor. Single Sign-on und SCIM für Entra ID bei Tensor |
| Protokoll | Das Audit-Protokoll der Konsole und die Ereignisse des Servers | Verbindungsberichte bei Corporate. Ein Audit-Protokoll bei Tensor |
| Hilfe ohne Einrichtung | Ein Schnellhilfe-Link und eine kleine App, die nichts installiert | QuickSupport |
| Sitzungen aufzeichnen | Im Browser-Viewer, als WebM-Datei | „Record and playback remote sessions“ bei Business, Corporate und Tensor |
| Handys und Tablets | Handys steuern über die RustDesk-App. Der Browser-Viewer von NeoDesk läuft auf Tablets | Apps Remote Control und QuickSupport für Android ab 8 und iOS ab 17. Verbindungen zu Mobilgeräten brauchen das Add-on Mobile Device Support |
| Erreichbare Computer | Geräte mit dem RustDesk-Client, der NeoDesk-Client unter Windows, macOS und Linux, der MeshAgent sowie RDP- und VNC-Hosts | Windows 10 22H2 und 11, Windows Server 2016 bis 2022, macOS ab 14 und Linux über TeamViewer Classic |

Die Tarife von TeamViewer laut Lizenzübersicht:

| Tarif | Lizenzierte Benutzer | Sitzungen gleichzeitig | Verwaltete Geräte |
|---|---|---|---|
| Remote Access | 1 | Bis zu 3, auf einem Gerät | Nicht angegeben |
| Business | 1 | Bis zu 3, auf einem Gerät | 200 |
| Premium | 15 | Bis zu 10, auf einem Gerät | 300 |
| Corporate | 30 | Bis zu 15, auf drei Geräten | 500 |

## Was TeamViewer besser kann {#what-teamviewer-does-better}

- **Kein Server zu betreiben.** TeamViewer betreibt die Infrastruktur, mit
  einem Netz von Routern für Verbindungen, die nicht direkt zustande kommen.
  Mit NeoDesk installierst, aktualisierst und sicherst du den Server selbst,
  und Sitzungen über das Relay laufen über deine Bandbreite.
- **Handys und Tablets.** TeamViewer hat eigene Apps für Android und iOS und
  verbindet sich mit einem Add-on auch zu Mobilgeräten. NeoDesk hat keine App
  fürs Handy; dort nimmst du die RustDesk-App, und laut Doku von RustDesk lässt
  sich ein iPhone oder iPad nicht fernsteuern.
- **Benutzerbereitstellung.** Tensor hat Single Sign-on und SCIM-Bereitstellung
  aus Entra ID. NeoDesk meldet Leute über OIDC oder LDAP an und legt ihr Konto
  bei der ersten Anmeldung an, kennt aber kein SCIM.

## Was NeoDesk anders macht {#what-neodesk-does-differently}

- **Dein Server.** ID-Server, Relay und Konsole laufen dort, wo du sie
  hinstellst. NeoDesk schickt keine Analysedaten, Absturzberichte oder
  Nutzungsdaten; [Datenschutz](/docs/project/privacy) listet jeden Host, den
  der Server kontaktiert.
- **Gewerbliche Nutzung erlaubt.** Die AGPL-3.0 erlaubt dir, NeoDesk für die
  Arbeit zu nutzen. Die kostenlose Version von TeamViewer ist für private
  Zwecke, und TeamViewer zählt schon das Homeoffice als kommerzielle Nutzung.
- **Keine Plätze, keine Kanäle.** Lege so viele Konten und Geräte an, wie du
  brauchst. [Benutzer und Rollen](/docs/people/users-and-roles) legen fest, was
  jemand darf und welche Geräte die Person sieht.
- **Anmeldung aus deinem Verzeichnis in jeder Installation.**
  [LDAP und Active Directory](/docs/people/ldap) und [OIDC](/docs/people/oidc)
  melden Leute an der Konsole und im RustDesk-Client an.
- **RDP und VNC.** [RDP- und VNC-Hosts](/docs/console/remote-targets) öffnest
  du im Browser-Viewer, ohne Agent auf dem Host.

## Lizenz und Kosten {#license-and-cost}

TeamViewer verkauft Abos, die jedes Jahr bezahlt und verlängert werden, und
sie verlängern sich von selbst, wenn du nicht spätestens 28 Tage vor Ende der
Laufzeit kündigst. Die kostenlose Version ist für die private Nutzung: Familie
und Freunden helfen oder auf eigene Computer zugreifen, die nicht gewerblich
genutzt werden. Als kommerziell zählt für TeamViewer „any use of TeamViewer for
purposes that are either directly or indirectly paid for“, das Homeoffice
eingeschlossen. Preise nennt diese Seite nicht; sie stehen auf der Preisseite
von TeamViewer.

NeoDesk kostet nichts. Du darfst es nutzen, ändern und betreiben, auch
gewerblich. Änderst du es und bietest es als Netzwerkdienst an, gibst du deine
Änderungen an die Leute weiter, die den Dienst nutzen. Bezahlten Support gibt
es nicht. Siehe [Lizenz](/docs/project/license).

## Von TeamViewer zu NeoDesk umziehen {#move-from-teamviewer-to-neodesk}

NeoDesk übernimmt nichts aus TeamViewer, du richtest die Geräte also neu ein:

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
5. Kündige TeamViewer spätestens 28 Tage vor Ende der Laufzeit.

TeamViewer ist eine Marke ihres Inhabers. NeoDesk ist nicht mit TeamViewer
verbunden.

## Quellen {#sources}

Alle Seiten wurden am 23. November 2026 gelesen.

- [teamviewer.com, Preise](https://www.teamviewer.com/en/pricing/): jährliche
  Abrechnung, automatische Verlängerung und die Kündigungsfrist von 28 Tagen.
- [teamviewer.com, Lizenzübersicht](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-classic/licensing/purchase/licenses-overview/):
  Benutzer, Sitzungen und verwaltete Geräte je Tarif und das Add-on Mobile
  Device Support.
- [teamviewer.com, Produktbeschreibung von TeamViewer Core](https://www.teamviewer.com/en/product-descriptions/teamviewer-core/):
  die kostenlose Version für die private, nicht kommerzielle Nutzung und die
  Zwei-Faktor-Authentifizierung in jedem Tarif.
- [teamviewer.com, Verdacht auf kommerzielle Nutzung](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-classic/licensing/personal-use/commercial-use-suspected/):
  was als kommerzielle Nutzung zählt.
- [teamviewer.com, Sicherheitserklärung](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/security/security-statement/):
  der Handshake über die Master-Server und das Router-Netz.
- [teamviewer.com, Hybrid Conditional Access](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-tensor/conditional-access/hybrid-conditional-access/):
  Router bei dir vor Ort für Tensor.
- [teamviewer.com, Funktionen der Lizenz Business](https://www.teamviewer.com/en-us/global/support/knowledge-base/teamviewer-remote/licenses/licenses-and-features/business-license-feature-overview/):
  QuickSupport und Aufzeichnung bei Business.
- [teamviewer.com, Funktionen der Lizenz Corporate](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/licenses/licenses-and-features/corporate-license-feature-overview/):
  AD Connector, Verbindungsberichte und Aufzeichnung bei Corporate.
- [teamviewer.com, Funktionen der Lizenz Tensor](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/licenses/licenses-and-features/tensor-license-feature-overview/):
  Single Sign-on, SCIM, AD Connector, Audit-Protokoll und Aufzeichnung bei
  Tensor.
- [teamviewer.com, unterstützte Betriebssysteme](https://www.teamviewer.com/en/global/support/knowledge-base/teamviewer-remote/download-and-installation/supported-operating-systems-for-teamviewer-remote/):
  die Systeme, auf denen TeamViewer Remote läuft.
- [rustdesk.com, Client-Doku](https://rustdesk.com/docs/en/client/): iOS lässt
  sich nicht fernsteuern.
