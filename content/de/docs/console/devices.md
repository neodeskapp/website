---
title: Die Geräteliste
description: Geräte finden, filtern, sortieren und ordnen, mehrere auf einmal bearbeiten und RDP- oder VNC-Computer hinzufügen.
order: 2
---

Öffne **Geräte**, dann **Alle Geräte**, um jedes Gerät zu sehen, das dein Konto sehen darf. Ordner und Gruppen stehen links, die Suche und die Filter über der Tabelle. Ein Klick irgendwo auf eine Zeile öffnet das Gerät in einem Seitenbereich, beschrieben in [Gerätedetails und Verbinden](/docs/console/device-details).

![Die Geräteliste mit Ordnern und Gruppen links](shot:devices)

Die Überschrift sagt, wie viele Geräte es gibt und wie viele davon online sind. Statusänderungen kommen live an, und die ganze Liste lädt alle 60 Sekunden neu, solange der Tab sichtbar ist.

Um einen Client auf einen neuen Computer zu bringen, klicke über der Liste auf **Computer hinzufügen**: Das erzeugt einen Einladungslink, der den Client installiert und den Computer mit diesem Server verbindet. Siehe [Computer hinzufügen](/docs/console/add-a-computer).

## Suchen {#searching}

Tippe in **ID, Name, Benutzer oder Tag suchen**. Die Suche durchsucht die ID, den Anzeigenamen, den Hostnamen, den Benutzer, die Plattform, den Typ, die Tags, die Notiz und die IP-Adresse. Jedes Wort, das du eingibst, muss irgendwo vorkommen, in beliebiger Reihenfolge. Groß- und Kleinschreibung spielt keine Rolle.

Du kannst ein Gerät auch über die obere Leiste finden. **Seiten, Einstellungen, Geräte und Personen durchsuchen** (Strg+K) listet passende Geräte auf. Wählst du eines, öffnet sich die Geräteliste, gefiltert auf dieses Gerät und mit geöffnetem Seitenbereich.

## Statusfilter {#status-filters}

Die Schaltflächen neben der Suche grenzen die Liste nach Status ein:

| Filter | Zeigt |
|---|---|
| **Alle** | Jedes Gerät |
| **Online** | Geräte, die gerade online sind |
| **Offline** | Geräte, die offline und nicht gesperrt sind |
| **Mesh-Agenten** | Geräte, die sich über einen MeshAgent verbinden |
| **Gesperrt** | Gesperrte Geräte |

Das Menü **Tags** grenzt die Liste weiter ein: Hake einen oder mehrere Tags an, um nur die Geräte zu zeigen, die alle davon haben. Auf der Schaltfläche steht dann, welche Tags aktiv sind.

Ist ein Filter aktiv, sagt eine Zeile über der Tabelle, wie viele Geräte er zeigt, zum Beispiel „4 von 30 angezeigt“.

## Spalten und Sortierung {#columns-and-sorting}

| Spalte | Zeigt |
|---|---|
| **ID** | Die ID des Geräts, mit einer Schaltfläche zum Kopieren |
| **Hostname** | Den Anzeigenamen, wenn einer gesetzt ist, sonst den Hostnamen, den das Gerät gemeldet hat |
| **Gerätetyp** | Die Art des Clients, zum Beispiel **RustDesk**, **Mobilgerät** oder **Mesh-Agent** |
| **Plattform** | Das Betriebssystem und seine Version, so wie das Gerät sie gemeldet hat |
| **Zuletzt gesehen** | Wann sich das Gerät zuletzt beim Server gemeldet hat, oder **Nie** |
| **Status** | **Online**, **Offline**, **Gesperrt**, **Kein Signal**, **Gelöscht** oder **Deaktiviert** für ein ausgeschaltetes RDP/VNC-Ziel |
| **Tags** | Die Tags des Geräts |

**Kein Signal** heißt, dass der Client vor Kurzem die API des Servers erreicht hat, aber nicht beim Signalserver registriert ist. Der Hinweis am Status rät, den Client nach dem Umzug auf einen neuen Server neu zu starten.

**Spalten** blendet **Gerätetyp**, **Plattform**, **Zuletzt gesehen**, **Status** und **Tags** aus oder ein. **ID** und **Hostname** bleiben immer. Dieser Browser merkt sich deine Wahl. Auf schmalen Bildschirmen klappen manche Spalten von selbst weg.

Zum Sortieren klicke auf eine Spaltenüberschrift; ein zweiter Klick kehrt die Reihenfolge um. Sortieren kannst du nach **ID**, **Hostname**, **Gerätetyp**, **Plattform** und **Zuletzt gesehen**. Am Anfang ist die Liste nach **Zuletzt gesehen** sortiert, die neuesten zuerst.

## Ordner {#folders}

Die Ordner stehen links. **Alle Geräte** zeigt alles, **Nicht zugewiesen** zeigt Geräte ohne Ordner, und jeder Ordner zeigt seine Geräte. Die Zahl neben jedem Eintrag sagt, wie viele Geräte darin sind. Ordner und Gruppen wirken als ein gemeinsamer Filter: Wählst du eine Gruppe, siehst du Geräte aus allen Ordnern, und wählst du einen Ordner, siehst du Geräte aus allen Gruppen.

Ein Gerät liegt immer nur in einem Ordner. So verschiebst du Geräte:

- Ziehe eine Zeile mit der Maus auf einen Ordner. Lege sie auf **Nicht zugewiesen** ab, um das Gerät aus seinem Ordner zu nehmen.
- Wähle **In Ordner verschieben** im Zeilenmenü, oder für mehrere Geräte in der Leiste über der Tabelle.
- Wähle den Ordner, wenn du das Gerät bearbeitest oder genehmigst.

**Neuer Ordner** fragt nach einem Namen mit bis zu 50 Zeichen und einer Farbe. Konten, die Benutzer ändern dürfen, bekommen außerdem **Zugelassene Benutzer** und **Zugelassene Benutzergruppen**: wer den Ordner sehen darf. Lass beide leer, dann bleibt der Ordner für alle sichtbar, die Geräte sehen dürfen.

Jeder Ordner hat ein Menü (die drei Punkte oder ein Rechtsklick) mit **Bearbeiten** und **Löschen**. Wenn du einen Ordner löschst, bleiben seine Geräte erhalten; sie sind danach keinem Ordner zugewiesen.

## Gruppen {#groups}

Gruppen sind ein zweiter Weg, Geräte zu ordnen. Sie stehen unter den Ordnern. Eine Gruppe ist eine Menge von Geräten: Du kannst die Liste nach ihr filtern, Zugriffsregeln auf sie anwenden und sie auf bestimmte Personen beschränken. **Neue Gruppe** fragt nach:

- **Gruppenname**.
- **Dynamische Gruppe aus Tag**: Ist das Feld angehakt, kommt jedes Gerät mit dem Tag aus **Tag-Filter** von selbst in die Gruppe. Ist es nicht angehakt, fügst du die Geräte selbst hinzu.
- **Wer sie sieht**: **Zugelassene Benutzer** und **Zugelassene Benutzergruppen**, wie bei Ordnern, für Konten, die Benutzer ändern dürfen.

Um ein Gerät von Hand in eine Gruppe zu legen, ziehe seine Zeile auf die Gruppe oder nutze **Gruppen verwalten** im Zeilenmenü. Ein Gerät kann nur in einer Gruppe sein, die du von Hand füllst. Legst du es auf einer anderen Gruppe ab, wechselt es dorthin, und hakst du in **Gruppen verwalten** zwei Gruppen an, schlägt das mit „A device can belong to only one group“ fehl. Dynamische Gruppen nehmen keine abgelegten Geräte an: Ändere stattdessen die Tags des Geräts.

Das Gruppenmenü hat **Bearbeiten** und **Löschen**, und für Konten, die die Abrechnung verwalten, **Abrechnung**, um der Gruppe ein Supportpaket zuzuweisen.

## Tags {#tags}

Ein Tag ist ein kurzes Wort an einem Gerät, bis zu 50 Zeichen lang. Tags fügst du hinzu oder entfernst sie, wenn du ein Gerät bearbeitest, im Tab **Tags und Notizen** seines Seitenbereichs oder mit **Tags verwalten** im Zeilenmenü. Entfernst du dort einen Tag, verschwindet er nur von diesem Gerät.

Um einen Tag auf allen Geräten, die du sehen kannst, umzubenennen oder zu löschen, öffne das Menü **Tags** über der Tabelle und wähle **Tags verwalten**. Dynamische Gruppen, die den Tag nutzen, werden beim Umbenennen angepasst; nach dem Löschen bleiben sie leer, bis du sie änderst.

## Mehrere Geräte auswählen {#selecting-several-devices}

Konten, die Geräte bearbeiten, löschen oder teilen dürfen, bekommen ein Kontrollkästchen in jeder Zeile und eines in der Kopfzeile, das alle auswählt. Sind Geräte ausgewählt, zeigt eine Leiste über der Tabelle, wie viele es sind, und bietet:

- **Tags**: Angehakte Tags kommen auf jedes ausgewählte Gerät, abgewählte werden entfernt, halb angehakte bleiben, wie sie sind.
- **In Ordner verschieben**: legt alle in einen Ordner.
- **Gastzugriff-Link**: ein zeitlich begrenzter Link zum Web-Viewer für diese Geräte, für jemanden ohne Konto in der Konsole. Siehe [Gerätedetails und Verbinden](/docs/console/device-details#guest-access-links).
- **Löschen**: löscht sie nach einer Bestätigung. Sie lassen sich wiederherstellen, siehe [Gelöschte Geräte](#deleted-devices).
- **Auswahl aufheben**.

Die Sammelaktionen überspringen gelöschte Geräte und RDP/VNC-Ziele in der Auswahl.

## Das Zeilenmenü {#the-row-menu}

Jede Zeile hat an ihrem Ende ein Menü (die drei Punkte); ein Rechtsklick auf die Zeile öffnet es ebenfalls. Es enthält nur, was dein Konto mit diesem Gerät tun darf:

- **Web-Remote**, **Gastzugriff-Link**, **CDAP Snapshot Viewer** und **Über Desktop-Client verbinden**. Was jeder Eintrag tut und braucht, steht in [Gerätedetails und Verbinden](/docs/console/device-details#connecting).
- **Gerätedetails** öffnet den Seitenbereich, **Bearbeiten** öffnet ihn gleich zum Bearbeiten.
- **Tags verwalten**, **Gruppen verwalten** und **In Ordner verschieben**.
- **ID ändern** gibt dem Gerät auf dem Server eine neue ID aus 6 bis 16 Buchstaben, Ziffern, Bindestrichen und Unterstrichen. Der Server schickt die neue ID an das Gerät, wenn es in diesem Moment online ist, und der NeoDesk-Client übernimmt sie. Ein NeoDesk-Client, der dann offline ist, und ein normaler RustDesk-Client behalten ihre alte ID, bis du die neue von Hand im Client einträgst. Ändere die ID deshalb, wo es geht, im Client auf dem Gerät. Bei einem Gerät, das online ist, warnt die Konsole vorher.
- **Issue a new token** beendet den aktuellen Gerätetoken des Geräts. Das Gerät bekommt einen neuen, wenn es sich das nächste Mal meldet: Es weist dazu seinen Schlüssel mit einer Signatur nach, die die Uhrzeit enthält. Ein Gerät, dessen Uhr mehr als 5 Minuten von der des Servers abweicht, bekommt keinen neuen Token. Normale RustDesk-Clients nutzen keine Gerätetokens.
- **Sperren** oder **Entsperren** und **Löschen**, beschrieben weiter unten.

Ein Gerät, das sich über einen MeshAgent verbindet, bekommt außerdem die MeshAgent-Werkzeuge, solange es online ist, etwa **Terminal**, **Dateibrowser** und die Energiebefehle. Siehe [MeshAgent-Geräte](/docs/console/meshagent).

## Gesperrte Geräte {#banned-devices}

**Sperren** fragt nach einem optionalen Grund, der im Seitenbereich des Geräts und im Audit-Protokoll erscheint. Das Gerät wird getrennt und kann sich nicht mehr mit diesem Server verbinden, bis du es entsperrst. Der RustDesk-Client auf dem Gerät meldet nur, dass der Server nicht erreichbar ist. Gesperrte Geräte bleiben mit dem Status **Gesperrt** in der Liste; der Filter **Gesperrt** zeigt nur sie. **Entsperren** lässt das Gerät wieder verbinden.

## Gelöschte Geräte {#deleted-devices}

**Löschen** öffnet einen Dialog, dessen Schaltfläche **Löschen** erst nach drei Sekunden klickbar wird. Jedes Löschen trennt das Gerät. Standardmäßig wird das Gerät ausgeblendet, und seine ID bleibt reserviert: Der Server lehnt eine Registrierung unter dieser ID ab, bis du das Gerät wiederherstellst oder endgültig löschst. Zwei Optionen ändern das:

- **Dauerhaft löschen (ID freigeben)** entfernt den Geräteeintrag und gibt die ID frei, sodass sich der Client erneut registrieren kann. Alles, was der Server zu der ID gespeichert hat, geht mit: ihr Schlüssel und Schlüsselanfragen, gespeicherte Gerätepasswörter und die gespeicherte Anmeldung, Freigaben, Gruppen, Ordner, Zugriffsregeln und Einstellungen. Eine neue Installation unter derselben ID erbt nichts davon. Audit-Protokoll und Verbindungsverlauf bleiben.
- **Gerät widerrufen** sperrt zusätzlich die Geräte-ID, sodass sich das Gerät unter ihr nicht mehr verbinden kann. Die Sperre wird gespeichert und bleibt nach einem Neustart bestehen, auch zusammen mit **Dauerhaft löschen (ID freigeben)**.

Hake **Gelöschte anzeigen** an, um ausgeblendete Geräte zu sehen. Sie erscheinen ausgegraut mit **Gelöscht** neben dem Namen, und ihr Menü bietet **Wiederherstellen** und **Gerät dauerhaft löschen**. Dieser Browser merkt sich, ob **Gelöschte anzeigen** an ist.

## RDP/VNC-Ziel hinzufügen {#add-rdpvnc-target}

**RDP/VNC-Ziel hinzufügen** fügt einen Computer hinzu, der keinen RustDesk- oder NeoDesk-Client hat, etwa einen Windows-PC mit eingeschaltetem Remotedesktop oder einen Linux-Rechner mit VNC-Server. Verbunden wird dann im Browser, über diesen Server. Das Ziel erscheint in der Liste wie jedes andere Gerät, und **Verbinden** öffnet es im Browser.

Der Server erreicht diese Computer über guacd, den Daemon von Apache Guacamole. guacd gehört nicht zum Server und muss zuerst eingerichtet werden. Das Formular, die Einrichtung und was eine Sitzung kann, beschreibt [RDP- und VNC-Ziele](/docs/console/remote-targets).

## Zugriffsregeln {#access-rules}

**Zugriffsregeln** ist unter der Liste eingeklappt. Eine Regel schaltet Funktionen des RustDesk-Clients wie Dateiübertragung, Zwischenablage und Ton für ausgewählte Benutzer und Geräte ein oder aus. Clients, auf die eine Regel passt, bekommen deren Einstellungen vom Server.

## Was deine Rolle erlaubt {#what-your-role-allows}

Alle, die Geräte sehen dürfen, können die Liste durchsuchen, filtern und öffnen. Alles Weitere hängt von der Rolle ab. Das hier sind die Standardwerte; ein Administrator kann sie ändern, siehe [Benutzer und Rollen](/docs/people/users-and-roles).

| Aktion | Rollen |
|---|---|
| Bearbeiten, Tags, Ordner, Gruppen, **In Ordner verschieben**, **Issue a new token** | Super-Admin, Globaler Administrator, Remote-Operator |
| **Gastzugriff-Link** | Super-Admin, Globaler Administrator, Remote-Operator |
| **Sperren**, **Löschen**, **ID ändern** | Super-Admin, Globaler Administrator |
| **Computer hinzufügen** | Super-Admin, Globaler Administrator |
| **RDP/VNC-Ziel hinzufügen** | Super-Admin, Globaler Administrator |
