---
title: Die Übersicht
description: Was die erste Seite nach der Anmeldung zeigt, von dem, worum sich jemand kümmern muss, bis zu den Werten für einen RustDesk-Client.
order: 1
---

**Übersicht** ist die erste Seite, die du nach der Anmeldung siehst. Sie zeigt, was deine Aufmerksamkeit braucht, wie es deinen Geräten geht, die Remote-Sitzungen und Hilfeanfragen der letzten zwei Wochen und die Werte, die ein RustDesk-Client zum Verbinden braucht. Um zu ihr zurückzukehren, öffne **Geräte**, dann **Übersicht**.

![Die Übersicht mit den Abschnitten Benötigt Aufmerksamkeit, Geräte, Verlauf und Client-Einrichtung](shot:overview)

Die Seite lädt ihre Zahlen alle 30 Sekunden neu, solange der Browser-Tab sichtbar ist. Manche Teile erscheinen nur für Konten, die sie nutzen dürfen; bei jedem Abschnitt unten steht, für welche.

## Benötigt Aufmerksamkeit {#needs-attention}

Diese Liste zeigt, worum sich gerade jemand kümmern muss. Jede Zeile erscheint nur, solange es etwas zu tun gibt, und ein Klick darauf öffnet die Seite, auf der du das erledigst.

- **Serverstatus**: Der ID-Server oder der Relay-Server läuft nicht. Die Zeile nennt den Server und sagt, was deshalb nicht funktioniert, zum Beispiel „Der Relay-Server läuft nicht. Verbindungen über das Relay schlagen fehl.“ Sie zeigt auch „Unbekannt“, wenn die Konsole den Server nicht abfragen konnte. Der Klick öffnet **Serverstatus** unter **Server**, für Konten, die Servereinstellungen ändern dürfen.
- **Beitrittsanfragen**: wie viele Geräte auf eine Genehmigung warten. Die Zeile öffnet [Beitrittsanfragen](/docs/console/enrollment). Nur Konten, die Geräte genehmigen dürfen, sehen sie.
- **Hilfeanfragen**: wie viele Hilfeanfragen offen sind. Die Zeile öffnet **Hilfeanfragen** unter **Support**. Sie braucht die Berechtigungen, Geräte zu sehen und den Chat zu nutzen.
- **Gesperrte Geräte**: wie viele Geräte gesperrt sind. Die Zeile öffnet die Geräteliste mit dem Filter **Gesperrt**.

Wenn nichts wartet, steht in der Liste „Nichts erfordert Aufmerksamkeit. ID- und Relay-Server laufen.“

## Geräte {#devices}

Dieser Abschnitt zeigt, wie viele Geräte der Server kennt, zum Beispiel „30 Geräte insgesamt.“, und einen Balken, der sie in **online**, **offline** und **gesperrt** aufteilt. Ein gesperrtes Gerät zählt nur als gesperrt, deshalb ergeben die drei Zahlen zusammen die Gesamtzahl.

Jede Zahl ist ein Link zur Geräteliste mit dem passenden Statusfilter. **Geräteliste öffnen** öffnet [die Geräteliste](/docs/console/devices) ohne Filter.

Konten, die keine Geräte sehen dürfen, bekommen diesen Abschnitt nicht.

## Verlauf {#trends}

Zwei Diagramme zeigen die letzten 14 Tage. Es sind dieselben Diagramme wie unten auf der Seite **Berichte** unter **Aktivität**.

- **Fernsitzungen pro Tag**: die Remote-Sitzungen, die der Server pro Tag aufgezeichnet hat. Der Satz über dem Diagramm nennt die Summe, den Tag mit den meisten Sitzungen und die durchschnittliche Dauer einer Sitzung.
- **Eingegangene und erledigte Hilfeanfragen**: wie viele Hilfeanfragen an jedem Tag eingegangen sind und wie viele erledigt wurden, und wie viele noch offen sind. Eine Hilfeanfrage zählt an dem Tag als erledigt, an dem sie zuletzt geändert wurde.

Unter jedem Diagramm öffnet **Zahlen anzeigen** dieselben Daten als Tabelle.

Der Server zählt die Sitzungen von höchstens 500 Geräten. Auf einem größeren Server sagt der Satz, wie viele Geräte er erfasst hat, zum Beispiel „Enthält die ersten 500 von 800 Geräten.“ Der Server behält das Ergebnis fünf Minuten lang, deshalb kann es so lange dauern, bis eine gerade beendete Sitzung erscheint.

Der Verlauf erscheint für Konten, die die Seiten unter **Aktivität** öffnen dürfen. Siehe [Aktivität und Audit-Protokoll](/docs/console/activity).

## Client-Einrichtung {#client-setup}

Die Seitenspalte enthält die vier Werte, die ein RustDesk-Client braucht: **ID-Server**, **Relay-Server**, **API-Server** und **Schlüssel**. Jeder Wert hat eine Schaltfläche **Kopieren**. Der Schlüssel bleibt verborgen, bis du auf **Anzeigen** klickst.

**Client-Serveradresse** ist die Adresse, aus der die Werte gebildet werden. Gib eine andere Adresse ein und klicke auf **Werte anzeigen**, um die Werte für diese Adresse zu bekommen, zum Beispiel wenn Clients den Server unter einem anderen Namen erreichen. Das ändert nur, was die Seite zeigt; die Einstellung des Servers selbst liegt unter **Einstellungen**, **Allgemein**, **Öffentliche Client-Endpunkte**. Sind die Adressen dort gesetzt, ist das Feld gesperrt, und ein Link führt dich zur Einstellung.

Zeigen die Werte nur auf diesen Computer (localhost), warnt ein Hinweis, dass andere Computer und Handys sie nicht erreichen.

Die Schaltflächen unter den Werten:

- **Mit Code koppeln** erzeugt einen Einmalcode für einen NeoDesk-Agenten. Der Code gilt 10 Minuten. Nur Konten, die Geräte genehmigen dürfen, sehen diese Schaltfläche.
- **Alles kopieren** kopiert die vier Werte, einen pro Zeile, jeweils mit seinem Namen.
- **QR anzeigen** zeigt einen QR-Code, den die RustDesk-App auf einem Handy scannen kann, um die Servereinstellungen auszufüllen.
- **Mehr** enthält **Deploy-String kopieren** und **Windows-Installationsskript (Intune)**.

Unter den Schaltflächen stehen Links zu **RustDesk herunterladen**, der offiziellen Release-Seite auf GitHub, zu **Support-Agenten** für die Admin-Rollen und zu **Serverschlüssel und QR-Code**. Die letzten beiden öffnen ihre Tabs von [Computer hinzufügen](/docs/console/add-a-computer) unter **Geräte**.

Wie du diese Werte in einen Client einträgst, steht in [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).

## Serverstatus {#server-status}

Der letzte Abschnitt zeigt, ob die Teile des Servers laufen:

| Zeile | Was sie zeigt |
|---|---|
| **ID-Server** | **Läuft**, **Gestoppt** oder **Unbekannt** |
| **Relay-Server** | **Läuft**, **Gestoppt** oder **Unbekannt** |
| **Web-Konsole** | Immer **Läuft**, denn du siehst sie gerade an |
| **Web-Konsole läuft seit** | Wie lange die Web-Konsole seit ihrem Start läuft |

**Ports** ist eingeklappt. Klappe es auf, um die Ports zu sehen, auf denen der Server lauscht: **Signal (TCP/UDP)**, **NAT test (TCP)**, **WebSocket signal**, **REST API (HTTP)**, **Relay (TCP)**, **WebSocket relay**, **Console (HTTP)** und **Client API (HTTP)**. Wofür jeder Port da ist, erklärt [Ports](/docs/operations/ports).

Konten, die Servereinstellungen ändern dürfen, bekommen außerdem **Serverstatus öffnen**, das **Serverstatus** unter **Server** öffnet.
