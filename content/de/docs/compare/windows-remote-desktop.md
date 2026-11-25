---
title: NeoDesk und Windows Remote Desktop im Vergleich
description: Remotedesktop steckt in Windows Pro. Was es von NeoDesk bei Internetzugriff, Editionen, Sitzungen und Clients unterscheidet, und wie du beides nutzt.
order: 6
seoTitle: NeoDesk und Windows Remote Desktop im Vergleich
og: comparison
product: Windows Remote Desktop
logo: windows.svg
---

Windows Remote Desktop ist Teil von Windows: Ein Windows-PC oder -Server
betreibt den Remotedesktop-Host, und die Clients von Microsoft verbinden sich
per RDP damit. NeoDesk ist ein Server, den du selbst betreibst, Open Source
unter der AGPL-3.0, mit dem sich der RustDesk-Client und der eigene Client von
NeoDesk verbinden. NeoDesk öffnet auch RDP-Hosts im Browser, du kannst also
beides nutzen. Alles, was hier über Windows Remote Desktop steht, stammt von
den Seiten von Microsoft selbst, gelesen am 25. November 2026 und aufgeführt
unter [Quellen](#sources).

## Für wen sich was eignet {#who-each-one-suits}

**Windows Remote Desktop** passt, wenn die Computer mit Windows Pro,
Enterprise oder Windows Server laufen und in einem Netz stehen, das du schon
erreichst, etwa über ein VPN, wenn du auf einem entfernten Windows-Desktop mit
deinen eigenen Laufwerken, Druckern und Monitoren arbeitest oder wenn sich
viele Leute einen Windows Server über die Remotedesktopdienste teilen.

**NeoDesk** passt, wenn Computer hinter Routern stehen, die du nicht
verwaltest, wenn sie mit Windows Home, macOS oder Linux laufen oder wenn du
der Person hilfst, die vor dem Bildschirm sitzt. Es passt auch, wenn du eine
Konsole für alle Geräte willst, mit Konten, Rollen und Audit-Protokoll.

## Die Fakten nebeneinander {#the-facts-side-by-side}

| | NeoDesk | Windows Remote Desktop |
|---|---|---|
| Was es ist | Ein Server, den du betreibst, und der RustDesk-Client oder der NeoDesk-Client auf jedem Computer | Teil von Windows: der Remotedesktop-Host auf dem PC und die Clients von Microsoft, die sich damit verbinden |
| Wie eine Verbindung zustande kommt | Die Clients verbinden sich nach außen mit dem ID-Server und dem Relay deines Servers | Direkt von Gerät zu Gerät: Der Client braucht direkten Zugang zum PC. Übers Internet heißt das Portweiterleitung, ein VPN oder RD Gateway, eine Rolle von Windows Server |
| Erreichbare Computer | Geräte mit dem RustDesk-Client, der NeoDesk-Client unter Windows, macOS und Linux, der MeshAgent sowie RDP- und VNC-Hosts | Windows Pro, Enterprise und Education sowie Windows Server. Home-Editionen können keine Remotedesktop-Hosts sein |
| Clients | Der RustDesk-Client, der NeoDesk-Client und der Browser-Viewer der Konsole. Handys steuern über die RustDesk-App | Windows App für Windows, macOS, iOS und iPadOS, Android und ChromeOS sowie Meta Quest, dazu Remotedesktopverbindung unter Windows. Windows App im Browser verbindet sich nicht mit einem entfernten PC. Kein Client von Microsoft für Linux |
| Sitzungen gleichzeitig | Keine Grenze durch eine Lizenz | Windows 10 und 11: ein Benutzer zur Zeit. Windows Server: zwei Verbindungen zur Verwaltung; für mehr braucht es die Rolle RD-Sitzungshost und RDS-CALs |
| Hilfe für die Person am Bildschirm | Du siehst und steuerst den Bildschirm, den sie sieht; ein Schnellhilfe-Link funktioniert ohne Installation | Spiegeln (Shadowing) geht auf RD-Sitzungshost-Servern, und die Konsolensitzung lässt sich nicht spiegeln. Dafür hat Microsoft Quick Assist, bei dem die helfende Person ein Microsoft-Konto braucht |
| Anmeldung | Konten in der Konsole, mit Zwei-Faktor-Anmeldung, LDAP und Active Directory sowie OIDC | Windows-Konten, mit empfohlener Authentifizierung auf Netzwerkebene (NLA). Anmeldung mit Microsoft Entra ID an PCs, die in Entra oder hybrid eingebunden sind, mit bedingtem Zugriff, wenn deine Organisation ihn nutzt |
| Dateien, Ton und Geräte | Dateiübertragung, Zwischenablage und Ton, die Zugriffsregeln je Benutzer und Gerät ein- oder ausschalten | Lokale Laufwerke, Audio und die Zwischenablage auf jeder Plattform. Drucker unter Windows und macOS. USB-Geräte nur von Windows aus. Mehrere Monitore unter Windows, macOS und ChromeOS |
| Protokoll | Das Audit-Protokoll der Konsole und die Ereignisse des Servers, für alle Geräte an einer Stelle | Auf jedem PC: Anmeldungen im Sicherheitsprotokoll als Ereignis 4624 mit Anmeldetyp 10 und die TerminalServices-Protokolle in der Ereignisanzeige |

## Was Windows Remote Desktop besser kann {#what-windows-remote-desktop-does-better}

- **Schon in Windows enthalten.** Unter Windows Pro, Enterprise und Windows
  Server schaltest du Remotedesktop ein und verbindest dich, ohne Client zum
  Verteilen und ohne Server, solange du den PC erreichst.
- **Ein ganzer Windows-Desktop mit deinen Geräten.** Die Clients von Microsoft
  reichen deine lokalen Laufwerke, Audio und die Zwischenablage in die Sitzung
  durch, von Windows aus auch Drucker und USB-Geräte. NeoDesk kopiert Dateien
  und die Zwischenablage und spielt Ton ab, bindet deine Laufwerke oder
  USB-Geräte aber nicht im entfernten Computer ein.
- **Viele Benutzer auf einem Server.** Mit den Remotedesktopdiensten stellt ein
  Windows Server Sitzungen für viele Leute gleichzeitig bereit, lizenziert mit
  RDS-CALs pro Benutzer oder pro Gerät. NeoDesk verbindet sich mit Computern;
  es stellt keine Desktops bereit.
- **Anmeldung am PC mit Microsoft Entra ID.** PCs, die in Entra oder hybrid
  eingebunden sind, nehmen die Entra-Anmeldung für RDP an, unter deinen Regeln
  für bedingten Zugriff. NeoDesk meldet Leute an der Konsole und im
  RustDesk-Client über [OIDC](/docs/people/oidc) an, das Entra ID bereitstellen
  kann.

## Was NeoDesk anders macht {#what-neodesk-does-differently}

- **Keine offenen Ports auf den PCs.** Die Clients verbinden sich nach außen
  mit deinem Server, also erreichst du einen Computer hinter einem
  Heimrouter oder im Mobilfunknetz ohne Portweiterleitung und ohne VPN zu ihm.
  Laut Microsoft ist es nicht empfohlen, den RDP-Port eines PCs ins Internet zu
  öffnen („isn't recommended“).
- **Mehr als Windows Pro.** Der RustDesk-Client und der NeoDesk-Client laufen
  auch unter Windows Home, macOS und Linux.
- **Derselbe Bildschirm wie bei der Person vor Ort.** Eine NeoDesk-Sitzung
  zeigt den Bildschirm, den die Person am Computer sieht, und genau das
  braucht der Support. Für schnelle Hilfe zwischendurch funktioniert ein
  [Schnellhilfe-Link](/docs/console/quick-support) einmal für eine Stunde und
  installiert nichts.
- **Eine Konsole für alle Geräte.** [Geräteliste](/docs/console/devices),
  [Benutzer und Rollen](/docs/people/users-and-roles) und das
  [Audit-Protokoll](/docs/console/activity) gelten für alle Computer, statt
  eines Protokolls auf jedem PC.
- **Auch RDP-Hosts.** [RDP- und VNC-Ziele](/docs/console/remote-targets)
  öffnen sich im Browser-Viewer über deinen Server, der ein gespeichertes
  Passwort selbst einträgt, sodass es nie den Browser erreicht. Der Server
  braucht dafür guacd, und diese Sitzungen haben keinen Ton, keine
  Dateiübertragung und keine Auswahl des Bildschirms.

## Lizenz und Kosten {#license-and-cost}

Remotedesktop kommt mit Windows; du brauchst eine Edition, die Host sein kann,
etwa Windows Pro. Windows 10 und 11 lassen einen Benutzer zur Zeit an den
Computer. Ein Windows Server erlaubt zwei Verbindungen zur Verwaltung ohne
weitere Lizenzen. Für mehr Verbindungen oder für Leute, die auf dem Server
arbeiten, installierst du die Rolle RD-Sitzungshost und kaufst eine
Clientzugriffslizenz für die Remotedesktopdienste (RDS-CAL) pro Benutzer oder
pro Gerät; bis ein Lizenzserver nötig ist, gilt eine Frist von 120 Tagen.
Preise nennt diese Seite nicht.

NeoDesk kostet nichts. Du darfst es nutzen, ändern und betreiben, auch
gewerblich. Änderst du es und bietest es als Netzwerkdienst an, gibst du deine
Änderungen an die Leute weiter, die den Dienst nutzen. Eine bezahlte Version gibt es nicht. Hilfe gibt es kostenlos auf dem
[NeoDesk-Discord](https://discord.gg/nwERSawufr) und in den
[Diskussionen auf GitHub](https://github.com/neodeskapp/neodesk/discussions);
bezahlten Support und Hilfe bei der Einrichtung gibt es auf Anfrage über
[support@neode.sk](mailto:support@neode.sk). Siehe
[Preis und Support](/docs/project/license#price-and-support).

## Von Windows Remote Desktop zu NeoDesk umziehen {#move-from-windows-remote-desktop-to-neodesk}

Du kannst RDP behalten und es über NeoDesk erreichen:

1. Installiere den Server mit [Docker](/docs/getting-started/docker), unter
   [Linux](/docs/getting-started/linux) oder unter [Windows](/docs/getting-started/windows),
   und stelle die Konsole hinter [TLS](/docs/operations/reverse-proxy-tls).
2. Richte guacd ein und lege jeden Windows-PC als
   [RDP-Ziel](/docs/console/remote-targets) an. Der Server erreicht den PC in
   deinem Netz, und die Leute öffnen ihn im Browser.
3. Wo du den Bildschirm der Person vor Ort sehen willst oder der PC nicht im
   Netz des Servers steht, rollst du einen Client aus.
   [Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers)
   beschreibt einen Einladungslink, der den NeoDesk-Client auf vielen Computern
   installiert, und ein Windows-Skript, das den normalen RustDesk-Client
   einrichtet.
4. Für den Zugriff, wenn niemand am Computer sitzt, setzt du dort ein
   permanentes Passwort; siehe
   [Unbeaufsichtigter Zugriff](/docs/console/unattended-access).
5. Sobald sich niemand mehr von außen mit Port 3389 verbindet, entferne die
   Portweiterleitung dorthin auf deinem Router.

Windows und Remote Desktop sind Marken von Microsoft. NeoDesk ist nicht mit
Microsoft verbunden.

## Quellen {#sources}

Alle Seiten wurden am 25. November 2026 gelesen.

- [learn.microsoft.com, Zugriff auf deinen PC erlauben](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-access):
  die Editionen, die Host sein können, Home-Editionen nur als Client, wer sich
  verbinden darf, und die Authentifizierung auf Netzwerkebene.
- [learn.microsoft.com, unterstützte Konfiguration](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-supported-config):
  die Windows-Versionen, mit denen man sich verbinden kann.
- [learn.microsoft.com, Zugriff von außerhalb deines Netzes](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remotepc/remote-desktop-allow-outside-access):
  die direkte Verbindung, Port 3389, Portweiterleitung oder VPN und warum der
  PC nicht offen im Internet stehen sollte.
- [learn.microsoft.com, Rolle Remotedesktopgateway](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/remote-desktop-gateway-role):
  RD Gateway als Rolle von Windows Server für den Zugriff übers Internet.
- [learn.microsoft.com, getrennte Remotedesktopverbindungen](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/troubleshoot-remote-desktop-disconnected-errors):
  zwei Verbindungen zur Verwaltung ohne RDS-CALs, die Rolle RD-Sitzungshost für
  mehr und die TerminalServices-Protokolle.
- [learn.microsoft.com, RDS-Clientzugriffslizenzen](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-client-access-license):
  RDS-CALs pro Benutzer und pro Gerät und die Frist von 120 Tagen.
- [microsoft.com, Lizenzbestimmungen für Windows](https://www.microsoft.com/licensing/terms/en-US/product/WindowsDesktopOperatingSystem/all):
  ein Benutzer zur Zeit.
- [learn.microsoft.com, FAQ zu Windows Enterprise mit mehreren Sitzungen](https://learn.microsoft.com/en-us/azure/virtual-desktop/windows-multisession-faq):
  mehrere Sitzungen gleichzeitig als Fähigkeit von Windows Server außerhalb von
  Azure Virtual Desktop.
- [learn.microsoft.com, shadow](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/shadow):
  Spiegeln auf RD-Sitzungshost-Servern und dass sich die Konsolensitzung nicht
  spiegeln lässt.
- [learn.microsoft.com, Überblick über Windows App](https://learn.microsoft.com/en-us/windows-app/overview):
  die Plattformen, welche davon sich mit entfernten PCs verbinden und dass die
  Browser-Version es nicht tut.
- [learn.microsoft.com, Funktionen von Windows App je Plattform](https://learn.microsoft.com/en-us/windows-app/compare-platforms-features):
  Monitore, Audio, Laufwerke, Drucker, USB-Geräte und Zwischenablage je
  Plattform für entfernte PCs.
- [learn.microsoft.com, mstsc](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/mstsc):
  Remotedesktopverbindung unter Windows.
- [learn.microsoft.com, Verbindung zu einem in Microsoft Entra eingebundenen PC](https://learn.microsoft.com/en-us/windows/client-management/client-tools/connect-to-remote-aadj-pc):
  Entra-Anmeldung an PCs, die in Entra oder hybrid eingebunden sind, und
  bedingter Zugriff.
- [learn.microsoft.com, Quick Assist](https://learn.microsoft.com/en-us/windows/client-management/client-tools/quick-assist):
  was Quick Assist macht und dass die helfende Person ein Microsoft-Konto
  braucht.
- [learn.microsoft.com, Ereignis 4624](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4624):
  Anmeldetyp 10 für Remotedesktop-Anmeldungen.
