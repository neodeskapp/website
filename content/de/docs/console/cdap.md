---
title: CDAP-Geräte
description: Sensoren, Controller und Agenten über CDAP verbinden lassen, ihre Werte und Steuerelemente sehen und ihnen Befehle senden.
order: 13
---

CDAP ist das eigene Protokoll des Servers für Geräte, die keine RustDesk-Clients sind: Sensoren, Controller, Kameras, SCADA-Systeme, Netzwerkgeräte und Agenten. Ein Gerät verbindet sich mit dem CDAP-Gateway des Servers und meldet, welche Werte und Steuerelemente es hat, und die Konsole zeigt sie unter **Geräte**, **IoT-Geräte**. Diese Seite behandelt den Betrieb des Gateways und die Arbeit mit diesen Geräten. Wie du ein Gerät oder eine Bridge für CDAP baust, steht in [CDAP-Protokoll](/docs/development/cdap-protocol) und [CDAP-SDKs und Bridges](/docs/development/cdap-sdks).

## Das Gateway {#the-gateway}

Das Gateway lauscht auf Port 21122 und ist eingeschaltet, solange es niemand ausschaltet. **Gateway ausschalten** und **Gateway einschalten** auf der Seite der IoT-Geräte schalten es beim nächsten Neustart des Servers aus und ein, und was du dort wählst, hat Vorrang vor `CDAP_ENABLED`. Die Variable entscheidet nur, solange niemand diese Schaltflächen benutzt hat. `CDAP_PORT` verlegt das Gateway auf einen anderen Port. Die Installer für Linux und Windows öffnen 21122 in der Firewall, außer die env-Datei setzt `CDAP_ENABLED=N`; die Schaltflächen beachten sie nicht. Die Docker-Compose-Dateien veröffentlichen 21122, und die Ein-Zeilen-Installation für Docker öffnet ihn in ufw oder firewalld, ob das Gateway an oder aus ist. Geräte müssen ihn direkt erreichen; er läuft nicht über die Konsole oder einen Reverse Proxy.

Ohne weitere Einstellungen nimmt das Gateway unverschlüsselte Verbindungen an. `CDAP_TLS=Y` fügt TLS mit dem Zertifikat des Servers hinzu (`TLS_CERT` und `TLS_KEY`), und `CDAP_TLS_REQUIRED=Y` lehnt unverschlüsselte Verbindungen ab. Beides braucht dieses Zertifikat. Siehe [Konfiguration](/docs/operations/configuration) und [Ports](/docs/operations/ports).

## Wie sich ein Gerät anmeldet {#how-a-device-signs-in}

Die Software oder Bridge des Geräts entscheidet, wie es sich beim Gateway anmeldet. Es gibt drei Wege:

- **Ein Konto der Konsole** mit seinem Passwort.
- **Ein API-Schlüssel** des Servers.
- **Ein Gerätetoken**, der zu diesem Gerät gehört. Das Gerät muss schon auf dem Server sein und darf nicht gesperrt, deaktiviert oder gelöscht sein.

Ein Gerät, das sich mit einem Konto oder einem API-Schlüssel anmeldet, tritt dem Server unter der ID bei, die es angibt; die Rolle dieses Kontos oder Schlüssels braucht deshalb die Berechtigung **Registrierungen genehmigen**. Eine ID, die ein anderes Konto oder ein anderer Schlüssel registriert hat, wird abgelehnt, ebenso ein gesperrtes Gerät.

Ein angemeldetes Gerät erscheint auf der Seite **IoT-Geräte**, solange es verbunden ist, und in [der Geräteliste](/docs/console/devices) mit dem Namen und dem Typ, die es angegeben hat.

## Die Seite IoT-Geräte {#the-iot-devices-page}

Öffne **Geräte**, dann **IoT-Geräte**; in der Seitenleiste steht der Eintrag unter **4 weitere anzeigen**. Die Seite braucht die Berechtigung **CDAP anzeigen**.

| Spalte | Zeigt |
|---|---|
| **Gerät** | Name und ID des Geräts |
| **Art** | Den Typ, den das Gerät angegeben hat, etwa **IoT**, **SCADA**, **OS-Agent**, **Netzwerk**, **Kamera** oder **Benutzerdefiniert** |
| **Status** | **Verbunden** oder **Getrennt** |
| **Adresse** | Die Adresse, von der aus es sich verbunden hat |
| **Verbunden seit** | Wie lange die aktuelle Verbindung schon besteht |
| **Werte und Steuerungen** | Wie viele das Gerät gemeldet hat |
| **Lebenszeichen** | Wie oft es sich in dieser Verbindung gemeldet hat |

**Nach Name, ID oder Adresse suchen** und die Schaltflächen unter **Geräteart** grenzen die Liste ein. Die Seite lädt alle 10 Sekunden neu, solange der Tab sichtbar ist. Der Abschnitt **Gateway** neben der Liste zeigt den Port und ob Verbindungen verschlüsselt sind, zum Beispiel „Gateway an, Port 21122. Verbindungen sind nicht verschlüsselt.“

## Die Seite eines Geräts {#a-devices-page}

Klicke auf ein Gerät, um seine Seite zu öffnen. Oben stehen sein Typ, sein Status, wie lange es schon verbunden ist, und seine Firmware. Ist es offline, sagt die Seite „Das Gerät ist offline. Die Werte unten sind möglicherweise veraltet.“

- **Werte und Steuerungen**: was das Gerät gemeldet hat, etwa Messanzeigen, Schalter, Schaltflächen, Schieberegler, Listen, Diagramme und Tabellen, bei manchen Geräten auch ein Terminal, sein Bildschirm, ein Videostream oder seine Dateien. Die Werte laden alle 3 Sekunden neu. Ein Steuerelement, das das Gerät dafür markiert hat, fragt vorher „Diesen Befehl senden?“.
- **Aktive Warnungen**: die Warnungen, die das Gerät ausgelöst hat und die noch offen sind.
- **Gesendete Befehle**: die letzten 50 Befehle, die von dieser Seite gesendet wurden, mit ihrem Ergebnis. **Liste leeren** leert sie.
- **Verknüpfte Remote-Desktop-Geräte**: Geräte aus der Geräteliste, die zu diesem IoT-Gerät gehören. **Gerät verknüpfen** fragt nach der Geräte-ID.

Was ein Konto dort tun darf, hängt von seinen Berechtigungen ab:

| Berechtigung | Erlaubt |
|---|---|
| **CDAP-Befehle ausführen** | Steuerelemente ändern, Schaltflächen drücken, den Videostream und das Verknüpfen von Geräten |
| **CDAP-Terminal verwenden** | Das Terminal und den Bildschirm |
| **CDAP-Dateien verwalten** | Den Dateibrowser |

Ohne diese Berechtigungen erscheinen die Werte trotzdem, aber die Steuerelemente lassen sich nicht ändern. Die Standardwerte pro Rolle stehen in [Was jede Rolle darf](/docs/people/users-and-roles#what-each-role-can-do).
