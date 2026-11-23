---
title: Remote Desktop im Browser
description: Ein Gerät aus einem Browser-Tab über den Server steuern, was das braucht und worin es sich von der RustDesk-App unterscheidet.
order: 7
---

Die Konsole hat einen eigenen Remote-Desktop-Client, den Web-Viewer. Er läuft in einem Browser-Tab und spricht nur mit dem Server, deshalb muss auf dem Computer, an dem du sitzt, nichts installiert sein. Diese Seite zeigt, wie du ihn öffnest, was er braucht und was er kann.

## Den Viewer öffnen {#opening-the-viewer}

Es gibt vier Wege hinein:

- Von einem Gerät aus: Klicke im [Seitenbereich des Geräts](/docs/console/device-details#connecting) auf **Verbinden** oder im Zeilenmenü der Geräteliste auf **Web-Remote**. Der Viewer öffnet sich in einem neuen Browser-Tab. Ist schon ein Viewer-Tab offen, kommt das Gerät dort als weiterer Tab dazu.
- Aus der Seitenleiste: **Geräte**, dann **Fernzugriff im Browser** öffnet die Startseite des Viewers in einem neuen Tab. Tippe die ID eines Geräts in **Geräte-ID** und klicke auf **Verbinden**, oder such das Gerät in der Liste darunter. Die Liste hat Ordner, Gruppen, Tags, eine Suche, die Filter **Alle**, **Online** und **Offline** und eine Ansicht als **Liste** oder **Raster**. Sie aktualisiert sich alle 30 Sekunden. **Konsole öffnen** bringt dich zurück zur Konsole.
- Aus einer Schnellhilfe-Sitzung: Sobald die Person auf **Erlauben** geklickt hat, öffnet **Verbinden** ihren Computer im Viewer, ohne Passwort. Siehe [Schnellhilfe](/docs/console/quick-support).
- Über die Adresse: `/remote/` gefolgt von der ID eines Geräts öffnet den Viewer direkt für dieses Gerät, sodass du ihn als Lesezeichen speichern kannst.

Ist deine Sitzung in der Konsole abgelaufen, zeigt der Viewer zuerst seine eigene Anmeldeseite, mit Benutzername, Passwort und, bei Konten, die einen nutzen, dem Code aus der Authenticator-App.

Wer kein Konto in der Konsole hat, kann den Viewer über einen [Gastzugriff-Link](/docs/console/device-details#guest-access-links) nutzen.

## Was er braucht {#what-it-needs}

### Ein Konto, das sich verbinden darf {#an-account-that-may-connect}

Zum Verbinden braucht ein Konto die Berechtigung, sich mit Geräten zu verbinden, und bei RDP/VNC-Zielen die Berechtigung, sich mit diesen zu verbinden. Standardmäßig haben Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator beide. Andere Konten bekommen „Sie haben keinen Zugriff auf diese Seite“. Siehe [Benutzer und Rollen](/docs/people/users-and-roles).

### Ein ausreichend großer Bildschirm {#a-large-enough-screen}

Der Viewer läuft auf Desktop-Computern und Tablets. Auf einem Handy, also einem schmalen Bildschirm ohne Maus, öffnet die Startseite Geräte stattdessen in der RustDesk-App, und **Verbinden** in der Konsole lässt dich wählen. Auf einem Tablet bekommt der Viewer zusätzliche Schaltflächen, um zwischen **Touch** und **Touchpad** zu wechseln und die **Tastatur** einzublenden.

### Nur die Adresse der Konsole {#only-the-consoles-address}

Der Browser verbindet sich nur mit der Adresse und dem Port der Konsole. Die Konsole leitet die Sitzung über zwei WebSocket-Pfade, `/ws/rendezvous` und `/ws/relay`, an den Signal- und den Relay-Server weiter, die im selben Programm laufen. Für den Browser öffnest du keine zusätzlichen Ports.

Steht ein Reverse Proxy vor der Konsole, muss er WebSocket-Verbindungen auf diesen Pfaden durchreichen. Siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

Eine Sitzung zu einem RustDesk-Gerät läuft immer über den Relay-Server, nie direkt, deshalb muss das Gerät den Relay-Port erreichen können. Siehe [Ports](/docs/operations/ports).

### HTTPS für jedes Gerät {#https-for-every-device alias=https-for-full-speed}

Über einfaches HTTP von einem anderen Computer aus (nicht `localhost`) spielt der Browser nur H.264-Video ab. Ein RustDesk-Gerät, auch eines mit dem NeoDesk-Client, schickt H.264 nur, wenn sein Computer einen Hardware-Encoder für H.264 hat. Jedes andere Gerät schickt VP9, und das kann der Viewer über einfaches HTTP nicht zeigen. Über HTTPS dekodiert der Browser das Video mit WebCodecs, auch VP9, wo es geht in Hardware, und jedes Gerät erscheint.

Wird die Konsole von einem anderen Computer über einfaches HTTP geöffnet, sagt der Viewer das in einer Leiste: „Über einfaches HTTP spielt dieser Browser nur H.264-Video ab. Geräte ohne H.264-Encoder können nicht angezeigt werden. Öffnen Sie die Konsole über HTTPS, um jedes Gerät zu sehen.“ Eine Sitzung zu einem Gerät ohne H.264-Encoder endet dann mit dem Namen des Geräts und „kann über einfaches HTTP nicht angezeigt werden.“, gefolgt von „Dieses Gerät hat keinen H.264-Encoder, und über HTTP spielt der Browser nur H.264 ab. Öffnen Sie die Konsole über HTTPS, um seinen Bildschirm zu sehen.“ **So richten Sie HTTPS ein** daneben öffnet [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls). Ein Gerät mit H.264-Encoder erscheint. Über einfaches HTTP bietet **Videocodec** nur **Automatisch (empfohlen)** und **H264** an, und der Viewer bittet das Gerät um höchstens 30 Bilder pro Sekunde.

Auch das Einfügen aus der Zwischenablage kann über HTTP fehlschlagen, und um in der Dateiübertragung ganze lokale Ordner zu durchsuchen, brauchst du Chrome oder Edge über HTTPS. Gib der Konsole HTTPS, bevor du den Viewer täglich nutzt; siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

## Wie er sich verbindet {#how-it-connects}

Der Server entscheidet, wie er jedes Gerät erreicht:

| Gerät | Wie der Viewer sich verbindet |
|---|---|
| RustDesk-Client | Mit dem RustDesk-Protokoll, über den Relay-Server |
| Gerät mit Agent, der über CDAP verbunden ist | Über den Server, per CDAP, siehe [CDAP-Geräte](/docs/console/cdap) |
| MeshAgent, der online ist | Über den Server und den MeshAgent, siehe [MeshAgent-Geräte](/docs/console/meshagent) |
| RDP/VNC-Ziel | Über den Server und den Guacamole-Daemon, siehe [RDP- und VNC-Ziele](/docs/console/remote-targets) |

Während er sich verbindet, zeigt der Viewer die Schritte in einfachen Worten: das Gerät auf dem Server finden, über den Relay-Server verbinden, auf die Antwort des Geräts warten, sich anmelden, falls das Gerät ein Passwort verlangt, den Bildschirm empfangen. Dauert ein Schritt lange, sagt ein Hinweis, was meistens dahintersteckt. Schlägt die Verbindung fehl, sagt der Viewer, warum und was du versuchen kannst, und **Details** enthält die technischen Angaben, die du für einen Administrator kopieren kannst.

Fragt das Gerät nach einem Passwort, gib das ein, das in RustDesk auf diesem Gerät gesetzt ist. Hake **Passwort in diesem Browser speichern** an, um es verschlüsselt in diesem Browser zu behalten; wenn du dich von der Konsole abmeldest, wird es vergessen. Hat eine Organisation in ihrem [gemeinsamen Adressbuch](/docs/people/organizations#the-shared-address-book) mit **Passwort setzen** ein Passwort für das Gerät gespeichert, setzt der Viewer stattdessen dieses ein und behält es nicht im Browser, außer du hakst das Kästchen an. Das macht er nur für Mitglieder dieser Organisation und für Konten mit den Rollen Super-Admin und Globaler Administrator; alle anderen tippen das Passwort ein. Ein Gerät mit Zwei-Faktor-Anmeldung verlangt außerdem den 6-stelligen Code aus seiner Authenticator-App.

Bei einem RustDesk-Gerät bricht der Viewer ab, bevor er ein Passwort sendet, wenn sich die Verbindung zum Gerät nicht absichern lässt. **Sitzungsinfo** zeigt, ob eine laufende Sitzung Ende-zu-Ende-verschlüsselt ist.

## Während einer Sitzung {#during-a-session}

Jedes Gerät öffnet sich als Tab im Viewer; **Neue Verbindung** fügt einen weiteren hinzu. **Steuerung** oder F8 blendet die Leiste mit den Sitzungssteuerungen ein, und **Geöffnet lassen** hält sie dort:

| Steuerung | Was sie tut |
|---|---|
| **Aktionen** | **Ctrl+Alt+Del**, **Bildschirm sperren**, **Entferntes Gerät neu starten**, **Bild neu laden**, **Zwischenablage einfügen**, **Tastatur zurücksetzen**, **Eingabe sperren** und **Windows-Sitzungen**, wenn das Gerät mehrere hat |
| **Text eintippen** | Tippt Text auf der entfernten Tastatur, zum Beispiel ein Passwort. Strg+Enter sendet ihn |
| **Anzeige** | **Bildqualität** (**Beste**, **Ausgewogen**, **Leistung**), **Bildrate** (30, 60 oder **Automatisch anpassen**), **Skalierung**, **Tastaturmodus**, **Videocodec** und die Optionen **Entfernten Mauszeiger zeigen**, **Nach der Sitzung sperren**, **Privatsphäre-Modus** und **Zwischenablage abschalten** |
| **Monitore** | Wählt den Bildschirm, der angezeigt wird, und fügt virtuelle Bildschirme hinzu oder entfernt sie, wenn das Gerät das unterstützt. Ein Gerät mit zwei bis vier Bildschirmen bekommt stattdessen eine Schaltfläche pro Bildschirm |
| **Chat** | Nachrichten erscheinen auf dem Bildschirm des Geräts; Antworten erscheinen hier |
| **Dateiübertragung** | Kopiert Dateien zwischen diesem Computer und dem Gerät |
| **Sitzungsinfo** | Das Gerät, die Verbindung, Verschlüsselung, Round-Trip-Zeit, Bildrate, Bildschirmgröße und Videoformat |
| Ton, **Aufnehmen**, **Nur ansehen** | Schalten den Ton ein oder aus, zeichnen die Sitzung auf oder lassen dich zusehen, ohne Eingaben zu senden |
| **Trennen** | Beendet die Sitzung |

Text und Bilder, die du auf dem Gerät kopierst, landen in der Zwischenablage dieses Computers, wenn der Browser es erlaubt; **Zwischenablage einfügen** schickt die Zwischenablage dieses Computers an das Gerät. Der Viewer drückt auf dem Gerät nie von selbst Strg+C. Dateien gehen über **Dateiübertragung** in beide Richtungen.

**Aufnehmen** zeichnet den Bildschirm im Browser auf. Wenn du die Aufnahme stoppst, wird sie als WebM-Datei auf diesen Computer heruntergeladen. In einer MeshAgent-Sitzung schaltet **Aufnehmen** stattdessen die Aufzeichnung auf dem Server ein oder aus, und die Sitzung verbindet sich neu.

Nicht jede Steuerung funktioniert bei jeder Verbindung. **Text eintippen** funktioniert in RustDesk- und CDAP-Sitzungen und meldet in den anderen, dass es nicht verfügbar ist. Was eine RDP- oder VNC-Sitzung kann, steht in [RDP- und VNC-Ziele](/docs/console/remote-targets#in-the-viewer). Ein Gastlink nur zum Ansehen bietet weder **Aktionen** noch **Text eintippen**, **Chat** oder **Dateiübertragung**.

**Bildqualität**, **Bildrate**, **Skalierung**, **Tastaturmodus** und **Videocodec** werden für dein Konto in diesem Browser gespeichert und gelten auch für die nächste Sitzung.

## Tastatur {#keyboard}

Was du tippst, geht an das Gerät. In einer Sitzung mit einem RustDesk-Gerät entscheidet **Tastaturmodus** unter **Anzeige**, wie:

| Modus | Was das Gerät bekommt |
|---|---|
| **Auto (Map, wie RustDesk)** | Der Standard. Bei einem Windows-Gerät gehen Buchstaben, Shift, Strg, Alt, Enter, die Pfeiltasten, die Funktionstasten und jede Taste, die zusammen mit einer Modifikatortaste gedrückt wird, als Tastenpositionen an das Gerät; Ziffern und Symbole, die allein getippt werden, gehen als Zeichen. Bei anderen Geräten verhält er sich wie Legacy |
| **Legacy (Zeichen)** | Das Zeichen, das das Tastaturlayout dieses Computers erzeugt. Enter, die Pfeiltasten und die anderen Sondertasten gehen als benannte Tasten |
| **Map (physischer Scancode)** | Die Position jeder Taste. Das Tastaturlayout des Geräts entscheidet, welches Zeichen daraus wird |

Kommen Zeichen falsch an, zum Beispiel weil dieser Computer und das Gerät unterschiedliche Tastaturlayouts nutzen, probiere einen anderen Modus.

Scheint auf einem RustDesk-Gerät eine Taste zu hängen, etwa weil alles in Großbuchstaben oder als Tastenkürzel ankommt, wähle **Tastatur zurücksetzen** unter **Aktionen**. Das lässt jede Taste los, die der Viewer noch gedrückt hält, und in jedem Fall Shift, Strg, Alt und die Windows-Taste. Der Viewer lässt gehaltene Tasten auch los, wenn du zu einem anderen Fenster oder Browser-Tab wechselst.

## Im Vergleich mit der RustDesk-App {#compared-with-the-rustdesk-app}

Der Viewer deckt die tägliche Fernwartung ab, mit diesen Unterschieden:

- Er läuft nicht auf Handys. Nutze dort die RustDesk-App.
- Über einfaches HTTP zeigt er nur Geräte mit H.264-Encoder, wie oben beschrieben.
- In **Dateiübertragung** speichert **Ordner herunterladen** einen Ordner vom Gerät als ein ZIP-Archiv mit höchstens 4 GB und 65.535 Dateien und Ordnern. Lokale Ordner zu durchsuchen braucht Chrome oder Edge über HTTPS; andere Browser können trotzdem einzelne Dateien hoch- und herunterladen.
- Sitzungen zu RustDesk-Geräten laufen immer über den Relay-Server und verbrauchen deshalb die Bandbreite des Servers.
- Die Konsole hält höchstens fünf dieser WebSocket-Verbindungen pro Client-Adresse gleichzeitig und schließt eine Verbindung, über die 120 Sekunden lang nichts läuft.
