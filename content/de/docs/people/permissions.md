---
title: Berechtigungen
description: Ändern, was eine Rolle darf, Konsolenbereiche für eine Person oder Benutzergruppe mit dem Konsolenzugriff einschränken und Remote-Sitzungen begrenzen.
order: 2
---

Eine Rolle ist eine Reihe von Berechtigungen, die jedes Konto mit dieser Rolle hat. An zwei Stellen änderst du, was Personen dürfen: Die Seite **Rollen und Berechtigungen** ändert eine Rolle für alle, die sie haben. Der **Konsolenzugriff** auf der Seite Benutzer schränkt einzelne Teile der Konsole und die Client-Funktionen von Remote-Sitzungen für eine Person oder eine Benutzergruppe ein.

## Rollen und Berechtigungen {#roles-and-permissions}

Nur Konten mit der Rolle Super-Admin oder Administrator sehen diese Seite. Öffne **Personen**, dann **Rollen und Berechtigungen**.

![Die Seite Rollen und Berechtigungen mit der ausgewählten Rolle Serveradministrator](shot:permissions)

Wähle rechts unter **Rolle** eine Rolle aus. Darunter siehst du die Beschreibung der Rolle und eine Zeile wie „Erlaubt: 10 von 45 Berechtigungen. Vom Standard geändert: 0.“ Die Berechtigungen sind in Gruppen eingeteilt: Geräte, RDP- und VNC-Ziele, Benutzer, Organisationen, Registrierung, Chat, Protokoll und Überwachung, Serververwaltung, Erscheinungsbild, Abrechnung, IoT-Geräte (CDAP), MeshCentral-Agenten und NeoDesk-Agenten. Jede Zeile zeigt den Namen der Berechtigung und darunter ihren Codenamen, etwa `device.view`.

### Berechtigung ändern {#change-a-permission}

1. Wähle die Rolle aus.
2. Setze oder entferne den Haken bei der Berechtigung. Die Änderung wird sofort gespeichert: Die Zeile zeigt **Wird gespeichert…**, dann **Gespeichert** oder den Grund, warum es nicht geklappt hat.
3. Eine geänderte Zeile zeigt **Geändert (Standard: erlaubt)** oder **Geändert (Standard: nicht erlaubt)** und hat eine Schaltfläche **Zurücksetzen**, die den Standard wiederherstellt.

Um jede Berechtigung der Rolle auf ihren Standard zurückzusetzen, klicke unter **Zurücksetzen** auf **Alle Änderungen zurücksetzen…** und bestätige. Die Tabelle der Standardwerte steht unter [Benutzer und Rollen](/docs/people/users-and-roles#what-each-role-can-do).

Änderungen gelten ab der nächsten Seite, die Personen mit dieser Rolle öffnen. Niemand wird dadurch abgemeldet.

### Was du nicht ändern kannst {#what-you-cannot-change}

- Super-Admin und Administrator haben immer jede Berechtigung. Wählst du eine der beiden aus, steht dort „Diese Rolle hat immer alle Berechtigungen. Das lässt sich nicht ändern.“
- Die Rolle Pro-Lizenz bekommt nie eine Berechtigung für Geräte oder für RDP- und VNC-Ziele und nie **Organisationsgeräte verwalten**. Bei Pro-Lizenz sind diese Zeilen aus und gesperrt, mit dem Hinweis „Ohne Wirkung: Ein Pro-Lizenzkonto erhält nie Geräteberechtigungen.“
- Wer welche Rolle vergeben darf, legt die Rolle selbst fest (siehe [wer welche Rolle vergeben darf](/docs/people/users-and-roles#who-can-give-which-role)). Eine Berechtigung, die du einer Rolle gibst, zählt dabei mit: Eine Rolle, die mehr hat als die Rolle Globaler Administrator, kann ein Globaler Administrator nicht mehr vergeben. Eine Rolle, die keine Rolle vergeben darf, kann keine Konten anlegen oder löschen. Deshalb sind bei Serveradministrator, Remote-Operator, Betrachter, Gastlink-Aussteller und Pro-Lizenz **Benutzer erstellen** und **Benutzer löschen** aus und gesperrt, mit dem Hinweis „Ohne Wirkung: Diese Rolle kann keine Rolle vergeben und daher keine Konten anlegen oder löschen.“

Wurde für eine Zeile eine Änderung gespeichert, bevor sie gesperrt war, wird sie weiter als geändert angezeigt und lässt sich mit **Zurücksetzen** zurücknehmen.

## Konsolenzugriff {#panel-access}

Der Konsolenzugriff schränkt ein, was eine Person oder eine Benutzergruppe in jedem Teil der Konsole tun darf. Er gibt nie mehr, als die Rolle der Person erlaubt.

Öffne **Personen**, dann **Benutzer**. Wähle im Menü der Zeile einer Person, oder einer Gruppe unter **Benutzergruppen**, den Eintrag **Konsolenzugriff…**. Das Fenster listet die Bereiche der Konsole in Gruppen (Kern, Verwaltung, Betrieb, Kommerzialisierung, Sicherheit und System), mit einer Stufe für jeden Bereich:

| Stufe | Wirkung |
| --- | --- |
| **Keiner** | Der Bereich zeigt, dass die Person keinen Zugriff hat, und der Server lehnt seine Anfragen ab. |
| **Lesen** | Die Person kann den Bereich öffnen und lesen, aber nichts darin ändern. |
| **Voll** | Lesen und Ändern, soweit die Rolle es erlaubt. |
| **Standard für Rolle oder Gruppe** | Keine Einstellung für diese Person. Bei einer Gruppe heißt diese Auswahl **Nicht festgelegt**. |

Die Zeile **Alle Bereiche dieser Gruppe** setzt alle Bereiche einer Gruppe auf einmal. Klicke auf **Speichern**, um die Einstellungen im Fenster zu speichern. Zum Ansehen brauchst du die Berechtigung **Benutzer anzeigen**. Zum Speichern brauchst du **Benutzer bearbeiten** und eine Rolle, die die Person oder jedes Mitglied der Gruppe ändern darf (siehe [wer welche Rolle vergeben darf](/docs/people/users-and-roles#who-can-give-which-role)). Für dein eigenes Konto oder eine Gruppe, in der du bist, darf das Speichern deinen Zugriff behalten oder verringern, aber nie erweitern; sonst antwortet der Server „You cannot widen your own panel access“.

Wird eine Benutzergruppe gelöscht, behält jedes Mitglied die Bereichsstufen und Client-Funktionen, die die Gruppe für es heruntergesetzt hat, als eigene Einstellungen. Eine Grenze, die an der Gruppe hing, bleibt also eine Grenze.

### Welche Einstellung gilt {#which-setting-wins}

Für jeden Bereich entscheidet die erste dieser Einstellungen, die es gibt. Das Ergebnis wird dann auf das begrenzt, was die Rolle erlaubt:

1. Die eigene Einstellung der Person für den Bereich.
2. Die eigene Einstellung der Person für die Gruppe, zu der der Bereich gehört.
3. Die höchste Einstellung unter den Benutzergruppen der Person.
4. Die Rolle.

Unter jeder Zeile zeigt das Fenster, was gerade gilt und woher es kommt, zum Beispiel „Jetzt: Lesen, aus der Rolle“. Ist eine Einstellung höher, als die Rolle erlaubt, steht dort „Die Rolle erlaubt hier Lesen; diese Grenze gilt weiterhin.“

Bereichseinstellungen gelten nicht für Konten mit den Rollen Super-Admin und Administrator: Sie haben überall immer vollen Zugriff und können so den Zugriff jeder Person reparieren.

Der Server lehnt das Speichern ab, wenn es dir selbst den Schreibzugriff auf **Benutzer** nehmen würde, für dein Konto oder über eine deiner Benutzergruppen. Die Meldung lautet „Du kannst dir nicht selbst den Schreibzugriff auf Benutzer nehmen: Du könntest den Konsolenzugriff dann nicht mehr ändern.“

## Client-Funktionen {#client-features}

Der Teil **Client-Funktionen** im selben Fenster begrenzt, was eine Person in Remote-Sitzungen tun darf. Jede Funktion steht auf **Standard**, **Ein** oder **Aus**:

| Funktion | Wenn sie aus ist |
| --- | --- |
| **Fernsteuerung** | Die Sitzung zeigt den Bildschirm, ohne Maus und Tastatur. Bei einem NeoDesk-Agenten sind im Seitenbereich des Geräts Bildschirm, Tastatur und Maus, das Starten und Beenden von Diensten und das Beenden von Prozessen aus. |
| **Dateiübertragung** | Keine Dateiübertragung und kein Drucken vom Gerät auf den Drucker der Person, die sich verbindet. Bei einem NeoDesk-Agenten sind die Dateien im Seitenbereich des Geräts aus. |
| **Zwischenablage** | Keine gemeinsame Zwischenablage, auch nicht mit einem NeoDesk-Agenten. |
| **Audio** | Kein Ton vom Gerät. |
| **Tunnel und Portweiterleitung** | Keine TCP-Tunnel, und damit auch kein RDP über RustDesk. |
| **Terminal** | Keine Terminal-Sitzung und kein Terminal auf einem NeoDesk-Agenten. |
| **Fernneustart** | Das Gerät lässt sich aus der Sitzung nicht neu starten. |
| **Datenschutzmodus** | Kein Datenschutzmodus. |

Die eigene Einstellung der Person entscheidet. Hat sie keine, entscheiden ihre Benutzergruppen: Die Funktion ist an, wenn irgendeine Gruppe sie einschaltet, und aus, wenn jede Gruppe, die sie festlegt, sie ausschaltet. Gibt es nirgends eine Einstellung, ist sie an. Anders als die Bereichseinstellungen gelten die Client-Funktionen auch für Konten mit den Rollen Super-Admin und Administrator.

Sie gelten für Sitzungen, die die Person im angemeldeten Zustand startet: aus der RustDesk-App, die mit ihrem Konto angemeldet ist, und aus dem [Web-Viewer](/docs/console/remote-in-browser) der Konsole. Im Web-Viewer gelten sie auch für CDAP-, MeshCentral- und RDP- oder VNC-Sitzungen, und im Seitenbereich des Geräts für die Werkzeuge des NeoDesk-Agenten: Ein Werkzeug, dessen Funktion aus ist, antwortet zum Beispiel mit „The terminal is turned off for your account“, bevor etwas beim Gerät ankommt. Ein RustDesk-Gerät hält sich daran, wenn es den NeoDesk-Client oder RustDesk 1.4.5 oder neuer nutzt, nicht unter Android; **Datenschutzmodus** braucht den NeoDesk-Client oder RustDesk 1.4.7 oder neuer. Eine Dateiübertragungs-, Terminal- oder Tunnelsitzung, die die Person nicht öffnen darf, wird beim Start abgelehnt. Sitzungen über einen [Gastzugangslink](/docs/console/device-details#guest-access-links) folgen den Client-Funktionen des Kontos, das den Link erstellt hat.

Eine RustDesk-App, die nicht angemeldet ist, startet Sitzungen ohne diese Grenzen. Um diese Lücke zu schließen, schalte **Nur angemeldete RustDesk-Apps können Sitzungen starten** unter **Einstellungen**, **Allgemein** ein.
