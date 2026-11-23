---
title: Gerätedetails und Verbinden
description: Der Seitenbereich eines Geräts Tab für Tab, wie du ein Gerät bearbeitest und auf welchen Wegen du dich mit ihm verbindest.
order: 4
---

Ein Klick auf ein Gerät in [der Geräteliste](/docs/console/devices) öffnet seinen Seitenbereich am Rand der Seite. Der Bereich zeigt alles, was der Server über das Gerät weiß, lässt dich das Gerät ändern und verbindet dich mit ihm.

![Der Seitenbereich eines Geräts mit geöffnetem Tab Übersicht](shot:device)

Die Kopfzeile zeigt den Namen des Geräts, seine ID mit einer Schaltfläche zum Kopieren, seinen Status, seine Plattform und den Benutzer, der am Gerät angemeldet ist. Die Fußzeile enthält **Bearbeiten**, **Verbinden** und **Schließen**. Auch Escape schließt den Bereich.

Solange der Bereich offen ist, steht die ID des Geräts in der Adressleiste (`?open=` gefolgt von der ID). So kannst du einen Link als Lesezeichen speichern oder teilen, der dasselbe Gerät öffnet. Der Bereich lädt das Gerät alle 15 Sekunden neu, solange der Tab sichtbar ist.

## Tabs {#tabs}

Der Bereich zeigt nur die Tabs, die zum Gerät passen:

| Tab | Erscheint bei |
|---|---|
| **Übersicht** | Jedem Gerät |
| **Hardware** und **Metriken** | Jedem Gerät außer RDP/VNC-Zielen |
| **Live-Daten** | Jedem Gerät außer RDP/VNC-Zielen, dem Support-Agenten und gelöschten Geräten |
| **Tags und Notizen** | Jedem Gerät |
| **Aktionen** | Wenn dein Konto mindestens eine Sache mit dem Gerät tun darf |

### Übersicht {#overview}

Ist das Gerät gesperrt, steht oben ein Hinweis, wann und von wem, und der Grund, falls einer angegeben wurde. Danach folgen diese Abschnitte:

- **Aktuelle Auslastung**: CPU-, Arbeitsspeicher- und Festplattennutzung als Balken, wenn das Gerät sie meldet.
- **Identität**: **ID**, **Anzeigename**, **Hostname**, **Benutzername**, **Plattform** und, wenn das Gerät sie gesendet hat, seine UUID, **Version** und **Funktionen**.
- **Verbindung**: nur bei einem RDP/VNC-Ziel, mit Technik, Adresse, dem Umgang mit dem Passwort, TLS und ob das Ziel aktiviert ist.
- **Verbindungsmodus**: nur bei Clients, die zwischen **Normal** und **Nur eingehend** wechseln können. Wähle den Modus, gib einen Grund an (er kommt ins Audit-Protokoll) und klicke auf **Modus anwenden**. Das Gerät wechselt, wenn es sich das nächste Mal meldet. Beim Support-Agenten sagt dieser Abschnitt nur, dass er bei „nur eingehend“ bleibt.
- **Netzwerk**: **IP-Adresse**, **Ordner** und **Gruppen**.
- **Zeitstempel**: **Erstmals gesehen** und **Zuletzt gesehen**, dazu **Statusstufe**, wenn die Stufe eines Online-Geräts **Degraded** oder **Critical** ist.

### Hardware {#hardware}

Was der Client über den Rechner gemeldet hat: System, Prozessor, Arbeitsspeicher, Bildschirme und Encoding-Fähigkeiten. Bei einem Gerät mit dem NeoDesk-Agenten folgt sein Inventarbericht mit Laufwerken, Netzwerkadaptern und den installierten Programmen, die du durchsuchen kannst. **Erneut auslesen** bittet das Gerät, seine Hardwaredaten noch einmal zu senden; dafür brauchst du die Berechtigung, Geräte zu bearbeiten.

Hat das Gerät nie etwas gemeldet, steht im Tab „Keine Hardwareinformationen verfügbar“.

### Metriken {#metrics}

- **Server-Metriken**: eine kurze Zusammenfassung.
- **Auslastungsverlauf**: ein Diagramm der CPU-, Arbeitsspeicher- und Festplattennutzung aus den Heartbeats, die das Gerät sendet. Eine Lücke in den Linien heißt, dass keine Messwerte ankamen, meist weil das Gerät aus war.
- **Verfügbarkeitsverlauf**: die Statuswechsel eines Tages als Band und als Tabelle, mit **Vorheriger Tag** und **Nächster Tag**. Der Server zeichnet sie nur auf, solange **Verfügbarkeitsverlauf** unter **Einstellungen**, **Allgemein** eingeschaltet ist.
- **Verbindungssitzungen**: wer sich mit dem Gerät verbunden hat, wann, von welcher IP-Adresse, ob die Verbindung **Direkt / Punch** lief oder über das **Relay** ging und wie lange sie dauerte.

### Live-Daten {#live-data}

Ansichten, die beim Öffnen vom Agenten auf dem Gerät gelesen werden: **Services**, **Processes**, **Events**, **Activity** und **Dateien**. Ist das Gerät offline und hat es die Ansicht schon einmal gesendet, erscheint sie sofort, unter „Das Gerät ist offline. Das hat es zuletzt gesendet:“ und der Uhrzeit. Sonst wartet die Anfrage, bis sich das Gerät wieder meldet: Die Ansicht sagt „Beim Gerät angefragt“ und zeigt die Antwort von selbst, sobald sie ankommt.

Dienste starten und beenden, Prozesse beenden und die Ansicht **Dateien** brauchen die Berechtigung, Geräte zu bearbeiten.

### Tags und Notizen {#tags--notes}

Tags ändern sich sofort, wenn du einen hinzufügst oder entfernst. Tippe einen Tag ein und drücke Enter oder **Hinzufügen**, oder wähle einen, den andere Geräte nutzen. Entfernst du hier einen Tag, verschwindet er nur von diesem Gerät. Die Notiz hat eine eigene Schaltfläche **Speichern**. Ohne die Berechtigung, Geräte zu bearbeiten, kannst du beides nur lesen.

### Aktionen {#actions}

Alles, was dein Konto mit dem Gerät tun darf, als Liste mit einer Zeile dazu, was jeder Eintrag tut. Die Einträge sind gruppiert:

- **Verbindung**: die Wege, dich zu verbinden, siehe [Verbinden](#connecting).
- **Mesh Agent**: für Geräte, die sich über einen MeshAgent verbinden, Werkzeuge wie **Terminal**, **Dateibrowser**, **Befehl ausführen**, **TCP-Port-Relay**, **UDP port relay** und die Energiebefehle. Siehe [MeshAgent-Geräte](/docs/console/meshagent#using-a-meshagent-device).
- **Verwaltung**: **Bearbeiten**, **Gruppen verwalten**, **ID ändern**, **Issue a new token** und **Sperren** oder **Entsperren**. Siehe [Das Zeilenmenü](/docs/console/devices#the-row-menu).
- **Gefahrenbereich**: **Löschen**, das das Gerät ausblendet und seine ID behält oder es endgültig löscht. Siehe [Gelöschte Geräte](/docs/console/devices#deleted-devices).

Beim Support-Agenten, der nur eingehende Verbindungen annimmt, zeigt der Tab statt der Verwaltungsaktionen, was verfügbar ist (grundlegende Statistiken und Remote Desktop). Bei einem gelöschten Gerät bietet er nur **Wiederherstellen** und **Gerät dauerhaft löschen**.

## Ein Gerät bearbeiten {#editing-a-device}

**Bearbeiten** in der Fußzeile macht den oberen Teil von **Übersicht** zu einem Formular mit **Anzeigename**, **Benutzername**, **Notiz**, **Ordner** und **Tags**. Der Anzeigename erscheint in der Liste statt des Hostnamens; lass ihn leer, dann zeigt die Liste den Hostnamen. **Speichern** sendet nur, was sich geändert hat. **Abbrechen** verlässt das Formular, ohne zu speichern; Escape fragt vorher nach, wenn sich etwas geändert hat.

**Bearbeiten** im Zeilenmenü und im Tab **Aktionen** öffnet dasselbe Formular. Bei einem RDP/VNC-Ziel öffnet **Bearbeiten** stattdessen das Formular des Ziels, mit seiner Adresse, der Anmeldung und den Sicherheitseinstellungen.

Zum Bearbeiten brauchst du die Berechtigung, Geräte zu bearbeiten. Standardmäßig haben sie Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator.

## Verbinden {#connecting}

**Verbinden** in der Fußzeile öffnet das Gerät im Web-Viewer, in einem neuen Browser-Tab. Ist schon ein Viewer-Tab offen, öffnet sich das Gerät stattdessen dort als weiterer Tab. Das Zeilenmenü und der Tab **Aktionen** bieten weitere Wege:

| Option | Was sie tut | Was sie braucht |
|---|---|---|
| **Web-Remote** (die Schaltfläche **Verbinden**) | Öffnet das Gerät im Browser, ohne etwas zu installieren | Ein Konto, das sich mit Geräten verbinden darf, und einen Browser auf einem Desktop-Rechner oder Tablet. Siehe [Remote Desktop im Browser](/docs/console/remote-in-browser) |
| **Desktop-Client** (**Über Desktop-Client verbinden** im Zeilenmenü) | Öffnet einen `rustdesk://`-Link mit der ID des Geräts, der die RustDesk-App auf diesem Computer startet | RustDesk, auf diesem Computer installiert und für diesen Server eingerichtet, siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client) |
| **CDAP Snapshot Viewer** | Öffnet in einem neuen Tab einen Viewer, der Bilder des Bildschirms statt eines Live-Streams zeigt | Ein Gerät, das über den Kanal seines Agenten (CDAP) erreichbar ist, nicht nur über RustDesk |
| **Gastzugriff-Link** | Erstellt einen Link zum Web-Viewer, der für begrenzte Zeit ohne Konto in der Konsole funktioniert | Die Berechtigung, Gastlinks zu erstellen |

Das Gerät kann trotzdem nach dem Passwort fragen, das in RustDesk auf diesem Gerät gesetzt ist; der Web-Viewer fragt dann danach.

Zum Verbinden brauchst du die Berechtigung, dich mit Geräten zu verbinden. Standardmäßig haben sie Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator. Konten mit den Rollen Betrachter und Serveradministrator haben sie nicht.

### Auf dem Handy {#on-a-phone}

Der Web-Viewer braucht einen breiteren Bildschirm, als ein Handy hat. Auf dem Handy fragt **Verbinden**, wie du dich verbinden willst:

- **Web-Viewer** öffnet ihn trotzdem in einem neuen Tab; dreh das Handy quer oder nimm ein Tablet.
- **RustDesk-App** öffnet die RustDesk-App auf dem Handy mit der ID des Geräts. Ist die App nicht installiert, passiert nichts.

RDP/VNC-Ziele bieten nur den Web-Viewer.

### Gastzugriff-Links {#guest-access-links}

**Gastzugriff-Link** erstellt einen Link für jemanden, der kein Konto in der Konsole hat. Der Dialog zeigt die Geräte, für die der Link gilt, und fragt nach:

- **Gültig für (Minuten)**: von 15 bis 1440, standardmäßig 120.
- **Bezeichnung (optional)**.
- **Nur Ansicht**: nur verfügbar, wenn jedes Gerät ein Mesh- oder CDAP-Gerät ist. Ein RustDesk-Gerät lässt sich nicht aufs Zuschauen beschränken, deshalb gibt ein Link, der eines enthält, volle Kontrolle.

**Link erstellen** zeigt die Adresse zum Kopieren. Wer sie öffnet, sieht die Geräte des Links, bis wann er gilt und ob man den Bildschirm steuern oder nur zusehen darf. **Verbinden** öffnet ein Gerät im Web-Viewer. Andere Geräte sind über den Link nicht zu sehen.

Ein hier erstellter Link funktioniert für beliebig viele Sitzungen, bis er abläuft. Die Konsole listet die erstellten Links nicht auf und kann deshalb keinen vorzeitig beenden; halte **Gültig für (Minuten)** so kurz, wie die Aufgabe es zulässt.

Wähle in der Liste mehrere Geräte aus, um einen Link für alle zu erstellen, siehe [Mehrere Geräte auswählen](/docs/console/devices#selecting-several-devices).

Für jemanden, der nur diese Links verteilt, gibt es die Rolle **Gastlink-Aussteller**: Sie darf Geräte sehen und Gastlinks erstellen, sich aber nicht mit Geräten verbinden und nichts ändern. Siehe [Rollen](/docs/people/users-and-roles#roles). Ein Gerät, das sich über einen MeshAgent verbindet, hat außerdem einen eigenen **Gast-Desktop-Link** nur zum Ansehen, siehe [MeshAgent-Geräte](/docs/console/meshagent#using-a-meshagent-device).
