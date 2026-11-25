---
title: Remote Desktop im Browser
description: Ein Gerät aus einem Browser-Tab über den Server steuern, was das braucht und worin es sich von der RustDesk-App unterscheidet.
order: 7
---

Die Konsole hat einen eigenen Remote-Desktop-Client, den Web-Viewer. Er läuft in der Konsole in deinem Browser und spricht nur mit dem Server, deshalb muss auf dem Computer, an dem du sitzt, nichts installiert sein. Diese Seite zeigt, wie du eine Sitzung öffnest, was er braucht und was er kann.

## Eine Sitzung öffnen {#opening-a-session alias=opening-the-viewer}

Eine Sitzung öffnet sich in der Konsole, im Hauptbereich der Seite. Die Wege hinein:

- Von einem Gerät aus: Klicke im [Seitenbereich des Geräts](/docs/console/device-details#connecting) auf **Verbinden** oder im Zeilenmenü der Geräteliste auf **Web-Remote**. Hat das Gerät schon eine offene Sitzung, kommst du zu ihr zurück.
- Aus der Seitenleiste: **Geräte**, dann **Fernsitzungen**. Unter **Offene Sitzungen** listet die Seite die Sitzungen, die in dieser Konsole offen sind, jede mit ihrem Zustand, einem Link zurück und einer Schaltfläche zum Schließen. Darunter tippst du die ID eines Geräts in **Geräte-ID** und klickst auf **Verbinden**, oder du suchst das Gerät in der Liste. Die Liste hat Ordner, Gruppen, Tags, eine Suche, die Filter **Alle**, **Online** und **Offline** und eine Ansicht als **Liste** oder **Raster**. Sie aktualisiert sich alle 30 Sekunden.
- Aus einer Schnellhilfe-Sitzung: Sobald die Person auf **Erlauben** geklickt hat, öffnet **Verbinden** ihren Computer im Viewer in einem neuen Browser-Tab, ohne Passwort. Siehe [Schnellhilfe](/docs/console/quick-support).
- Über die Adresse: `/remote/session/` gefolgt von der ID eines Geräts öffnet seine Sitzung in der Konsole, sodass du sie als Lesezeichen speichern kannst. `/remote/` gefolgt von der ID führt auch dorthin.

Manche Sitzungen öffnen sich stattdessen im Viewer in einem eigenen Browser-Tab: RDP- und VNC-Ziele, Gastlinks und ein Gerät, das sich auf einem anderen Weg verbindet als die Sitzungen, die schon in der Konsole offen sind, etwa ein MeshAgent-Gerät neben RustDesk-Sitzungen. In einem eigenen Tab zeigt der Viewer seine eigene Anmeldeseite, wenn deine Sitzung in der Konsole abgelaufen ist, mit Benutzername, Passwort und, bei Konten, die einen nutzen, dem Code aus der Authenticator-App.

Wer kein Konto in der Konsole hat, kann den Viewer über einen [Gastzugriff-Link](/docs/console/device-details#guest-access-links) nutzen.

### Auf anderen Seiten arbeiten {#working-on-other-pages}

Jedes Gerät ist ein Tab in der Leiste des Viewers, und **Neue Verbindung** fügt einen weiteren hinzu. Öffnest du eine andere Seite der Konsole, bleiben die Sitzungen verbunden. Eine Leiste unter der oberen Leiste listet sie unter **Offene Sitzungen**: Klick auf eine, um zu ihr zurückzukehren, oder schließ sie mit ihrer Schaltfläche zum Schließen oder einem Klick mit der mittleren Maustaste. Solange eine Sitzung nicht zu sehen ist, bekommt sie von diesem Computer keine Tasten, keine Maus und keine Zwischenablage.

Die Leiste des Viewers hat außerdem:

- **Seitenleiste ausblenden** und **Seitenleiste einblenden**, die die Seitenleiste der Konsole wegklappen, damit der Bildschirm mehr Platz hat. Dieser Browser merkt sich die Wahl.
- **In neuem Tab öffnen**, das die Sitzung in einen eigenen Browser-Tab verschiebt: Sie verbindet sich dort neu und endet in der Konsole.
- **Vollbild** oder F11, wobei auch die Leisten der Konsole Platz machen.

Schließt du die letzte Sitzung, kehrt der Viewer zur Konsole zurück. Abmelden beendet jede Sitzung; die Frage davor sagt, wie viele offen sind: „Ihre offenen Fernsitzungen enden ebenfalls (2).“ Auch das Schließen des Browser-Tabs beendet sie.

## Was er braucht {#what-it-needs}

### Ein Konto, das sich verbinden darf {#an-account-that-may-connect}

Zum Verbinden braucht ein Konto die Berechtigung, sich mit Geräten zu verbinden, und bei RDP/VNC-Zielen die Berechtigung, sich mit diesen zu verbinden. Standardmäßig haben Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator beide. Andere Konten bekommen „Sie haben keinen Zugriff auf diese Seite“. Siehe [Benutzer und Rollen](/docs/people/users-and-roles).

### Ein ausreichend großer Bildschirm {#a-large-enough-screen}

Der Viewer läuft auf Desktop-Computern und Tablets, und auf einem Handy im Querformat, wenn der Bildschirm mindestens 640 Pixel breit ist. Ein Handy im Hochformat zeigt „Die Web-Ansicht braucht einen größeren Bildschirm“ und dazu „Oder drehen Sie das Telefon quer: Im Querformat öffnet sich die Sitzung hier im Browser.“, wenn das Drehen reicht. Auf einem Handy bietet **Fernsitzungen** außerdem an, Geräte in der RustDesk-App zu öffnen, und **Verbinden** in der Konsole lässt dich wählen. Auf einem Tablet und einem Handy im Querformat bekommt der Viewer zusätzliche Schaltflächen, um zwischen **Touch** und **Touchpad** zu wechseln und die **Tastatur** einzublenden.

### Nur die Adresse der Konsole {#only-the-consoles-address}

Der Browser verbindet sich nur mit der Adresse und dem Port der Konsole. Die Konsole leitet die Sitzung über zwei WebSocket-Pfade, `/ws/rendezvous` und `/ws/relay`, an den Signal- und den Relay-Server weiter, die im selben Programm laufen. Für den Browser öffnest du keine zusätzlichen Ports.

Steht ein Reverse Proxy vor der Konsole, muss er WebSocket-Verbindungen auf diesen Pfaden durchreichen. Siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

Eine Sitzung zu einem RustDesk-Gerät läuft immer über den Relay-Server, nie direkt, deshalb muss das Gerät den Relay-Port erreichen können. Siehe [Ports](/docs/operations/ports).

### HTTPS für jedes Gerät {#https-for-every-device alias=https-for-full-speed}

Über einfaches HTTP von einem anderen Computer aus (nicht `localhost`) spielt der Browser nur H.264-Video ab. Ein RustDesk-Gerät, auch eines mit dem NeoDesk-Client, schickt H.264 nur, wenn sein Computer einen Hardware-Encoder für H.264 hat. Jedes andere Gerät schickt VP9, und das kann der Viewer über einfaches HTTP nicht zeigen. Über HTTPS dekodiert der Browser das Video mit WebCodecs, auch VP9, wo es geht in Hardware, und jedes Gerät erscheint.

Wird die Konsole von einem anderen Computer über einfaches HTTP geöffnet, sagt der Viewer das in einer Leiste: „Über einfaches HTTP spielt dieser Browser nur H.264-Video ab. Geräte ohne H.264-Encoder können nicht angezeigt werden. Öffnen Sie die Konsole über HTTPS, um jedes Gerät zu sehen.“ Eine Sitzung zu einem Gerät ohne H.264-Encoder endet dann mit dem Namen des Geräts und „kann über einfaches HTTP nicht angezeigt werden.“, gefolgt von „Dieses Gerät hat keinen H.264-Encoder, und über HTTP spielt der Browser nur H.264 ab. Öffnen Sie die Konsole über HTTPS, um seinen Bildschirm zu sehen.“ **So richten Sie HTTPS ein** daneben öffnet [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls). Ein Gerät mit H.264-Encoder erscheint. Über einfaches HTTP bietet **Videocodec** nur **Automatisch (empfohlen)** und **H264** an, und der Viewer bittet das Gerät um höchstens 30 Bilder pro Sekunde.

Über HTTP funktioniert die Zwischenablage nur zum Teil, siehe [Kopieren und Einfügen](#copy-and-paste), und um in der Dateiübertragung ganze lokale Ordner zu durchsuchen, brauchst du Chrome oder Edge über HTTPS. Gib der Konsole HTTPS, bevor du den Viewer täglich nutzt; siehe [Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

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

Solange das Passwortformular zu sehen ist, fragt der Viewer das Gerät schon ohne Passwort an. Ein Computer, an dem die Person Sitzungen per Klick annimmt, zeigt ihr seine Frage sofort, und nimmt sie an, öffnet sich die Sitzung ohne Passwort.

Fragt ein Computer, der mehrere Windows-Sitzungen teilt, welche er zeigen soll, nimmt der Viewer die, die auf dem Computer gerade aktiv ist, sodass das Bild ohne Rückfrage kommt. **Windows-Sitzungen** unter **Aktionen** wechselt zu einer anderen.

Bei einem RustDesk-Gerät bricht der Viewer ab, bevor er ein Passwort sendet, wenn sich die Verbindung zum Gerät nicht absichern lässt. **Sitzungsinfo** zeigt, ob eine laufende Sitzung Ende-zu-Ende-verschlüsselt ist.

## Während einer Sitzung {#during-a-session}

**Steuerung** oder F8 blendet die Leiste mit den Sitzungssteuerungen ein, und **Geöffnet lassen** hält sie dort:

| Steuerung | Was sie tut |
|---|---|
| **Aktionen** | **Ctrl+Alt+Del**, **Bildschirm sperren**, **Entferntes Gerät neu starten**, **Bild neu laden**, **Zwischenablage einfügen**, **Tastatur zurücksetzen**, **Windows-Taste**, **Alt+Tab**, **Eingabe sperren** und **Windows-Sitzungen**, wenn das Gerät mehrere hat |
| **Text eintippen** | Tippt Text auf der entfernten Tastatur, zum Beispiel ein Passwort. Strg+Enter sendet ihn |
| **Anzeige** | **Bildqualität** (**Beste**, **Ausgewogen**, **Leistung**), **Bildrate** (30, 60 oder **Automatisch anpassen**), **Skalierung**, **Tastaturmodus**, **Videocodec** und die Optionen **Entfernten Mauszeiger zeigen**, **Nach der Sitzung sperren**, **Privatsphäre-Modus** und **Zwischenablage abschalten** |
| **Bildschirme** | Für ein Gerät, das mehrere Bildschirme zugleich schickt: die Anordnung, der Bildschirm, auf dem du arbeitest, ein eigenes Fenster für einen Bildschirm und virtuelle Bildschirme. Siehe [Mehrere Bildschirme](#several-displays) |
| **Monitore** | Für andere Geräte: wählt den Bildschirm, der angezeigt wird, und fügt virtuelle Bildschirme hinzu oder entfernt sie, wenn das Gerät das unterstützt. Ein Gerät mit zwei bis vier Bildschirmen bekommt stattdessen eine Schaltfläche pro Bildschirm |
| **Chat** | Nachrichten erscheinen auf dem Bildschirm des Geräts; Antworten erscheinen hier. Mit **Support-Chat** landen beide in der Unterhaltung des Computers, siehe [Chat](/docs/console/chat#in-a-remote-session) |
| **Dateiübertragung** | Kopiert Dateien zwischen diesem Computer und dem Gerät |
| **Sitzungsinfo** | Das Gerät, die Verbindung, Verschlüsselung, Round-Trip-Zeit, Bildrate, Bildschirmgröße und Videoformat |
| Ton, **Aufnehmen**, **Nur ansehen** | Schalten den Ton ein oder aus, zeichnen die Sitzung auf oder lassen dich zusehen, ohne Eingaben zu senden |
| **Trennen** | Beendet die Sitzung |

Dateien gehen über **Dateiübertragung** in beide Richtungen, Text und Bilder über die Zwischenablage, siehe [Kopieren und Einfügen](#copy-and-paste).

**Aufnehmen** zeichnet den Bildschirm im Browser auf. Wenn du die Aufnahme stoppst, wird sie als WebM-Datei auf diesen Computer heruntergeladen. In einer MeshAgent-Sitzung schaltet **Aufnehmen** stattdessen die Aufzeichnung auf dem Server ein oder aus, und die Sitzung verbindet sich neu.

Nicht jede Steuerung funktioniert bei jeder Verbindung. **Text eintippen** funktioniert in RustDesk- und CDAP-Sitzungen und meldet in den anderen, dass es nicht verfügbar ist. Was eine RDP- oder VNC-Sitzung kann, steht in [RDP- und VNC-Ziele](/docs/console/remote-targets#in-the-viewer). Ein Gastlink nur zum Ansehen bietet weder **Aktionen** noch **Text eintippen**, **Chat** oder **Dateiübertragung**.

**Bildqualität**, **Bildrate**, **Skalierung**, **Tastaturmodus**, **Videocodec** und auf einem Mac **Cmd bei gängigen Tastenkürzeln als Strg senden** werden für dein Konto in diesem Browser gespeichert und gelten auch für die nächste Sitzung.

## Kopieren und Einfügen {#copy-and-paste}

Kopieren und Einfügen gehen in beide Richtungen, für Text und Bilder, mit den üblichen Tasten und ohne Schaltfläche. Auf einem Mac geht Cmd statt Strg.

- Von diesem Computer zum entfernten: Drück Strg+V im entfernten Bildschirm. Der Viewer schickt zuerst die Zwischenablage dieses Computers, dann fügt der entfernte Computer sie ein. Das geht in jedem Browser, auch über einfaches HTTP.
- Vom entfernten Computer zu diesem: Kopier dort wie gewohnt. Die Kopie landet sofort in der Zwischenablage dieses Computers, wenn der Browser die Seite hineinschreiben lässt: Chrome und Edge, solange der Viewer den Fokus hat, Firefox bis 5 Sekunden nach einem Tastendruck oder Klick im Viewer. Sonst wartet sie und kommt mit deinem nächsten Tastendruck oder Klick im entfernten Bildschirm.

Die Leiste der Sitzung zeigt den Zustand der Zwischenablage, und ein Klick darauf tut, was der Zustand braucht:

| Zustand | Was ein Klick tut |
|---|---|
| **Zwischenablage an** | Schaltet die Zwischenablage aus, wie **Zwischenablage abschalten** unter **Anzeige** |
| **Zwischenablage aus** | Schaltet sie wieder ein. Hat der entfernte Computer oder dieser Server sie für die Sitzung ausgeschaltet, oder ist die Sitzung nur zum Ansehen, sagt die Leiste das nur |
| **Zwischenablage erlauben** | In Chrome und Edge: Bittet den Browser einmal, die Seite die Zwischenablage lesen zu lassen. Danach kommt auch das, was du hier kopierst, auf den entfernten Computer, sobald du zum Viewer zurückkehrst |
| **Hierher kopieren** | Auf dem entfernten Computer wurde etwas kopiert und wartet: Der Klick kopiert es auf diesen Computer |

Text bis 4 MB und Bilder bis 8 MB gehen an den entfernten Computer, und der entfernte Computer kann bis zu 40 MB schicken. Ist eine Kopie größer, sagt der Viewer das und lässt sie weg.

Über einfaches HTTP gibt der Browser der Seite keinen Zugriff auf die Zwischenablage. Strg+V im entfernten Bildschirm schickt trotzdem Text und Bilder. Text, der auf dem entfernten Computer kopiert wurde, kommt mit deinem nächsten Tastendruck oder Klick im entfernten Bildschirm auf diesen Computer; Bilder nicht. Der Viewer sagt das einmal pro Browser.

**Zwischenablage einfügen** unter **Aktionen** schickt die Zwischenablage dieses Computers ebenfalls. Lässt der Browser die Seite sie nicht lesen, sagt der Viewer, dass du stattdessen Strg+V im entfernten Bildschirm drücken sollst.

Eine Kopie aus dem Editor (Notepad) auf einem Windows-Computer mit dem NeoDesk-Client kam in Tests erst mit der nächsten Kopie im Viewer an, eine Kopie zu spät.

## Mehrere Bildschirme {#several-displays}

Ein RustDesk-Gerät ab Version 1.2.4, der NeoDesk-Client eingeschlossen, schickt alle seine Bildschirme in einer Sitzung. Hat so ein Gerät mehr als einen Bildschirm, steht in der Steuerleiste **Bildschirme** statt **Monitore**. Ältere Geräte wechseln ihre Bildschirme einzeln, wie in der Tabelle oben.

**Bildschirme** hat diese Teile:

- **Anordnung**: **Einzeln** zeigt einen Bildschirm. **Wie angeordnet** zeigt jeden Bildschirm dort, wo er auf dem Desktop des Geräts liegt. **Raster** zeigt sie nebeneinander in einem Raster. „Wie angeordnet“ und „Raster“ brauchen ein Fenster ab 900 Pixel Breite und eine Maus, deshalb zeigen schmalere Fenster und Tablets mit Touch einen Bildschirm nach dem anderen.
- **Anzeigen**, in den beiden anderen Anordnungen **Arbeiten auf**: eine kleine Karte der Bildschirme, so wie sie auf dem Desktop des Geräts liegen. Klick auf einen Bildschirm, um ihn anzuzeigen oder um den zu wählen, auf dem du arbeitest.
- Der gewählte Bildschirm, mit seiner Nummer: **Originalgröße (1:1)** zeigt ihn Pixel für Pixel, statt ihn in seinen Platz einzupassen, in „Wie angeordnet“ und „Raster“ oder wenn er ein eigenes Fenster hat. **In eigenem Fenster öffnen** öffnet ihn in einem neuen Browserfenster; ist es offen, heißt der Eintrag **Zu seinem Fenster wechseln**.
- **Fenster**: **Ein Bildschirm auf jedem meiner Monitore** legt auf jeden Monitor dieses Computers einen Bildschirm und behält einen in diesem Fenster. Der Eintrag erscheint, wenn der Browser mehr als einen Monitor kennt, und der Browser fragt eventuell zuerst, ob die Seite Fenster darauf platzieren darf. Sonst heißt der Eintrag **Jeder Bildschirm in eigenem Fenster**, und du schiebst die Fenster selbst. Firefox und Safari können keine Fenster auf andere Monitore legen; dort sagt der Viewer „Dieser Browser kann keine Fenster auf Ihre anderen Bildschirme legen. Ziehen Sie das Fenster jeder Anzeige auf den gewünschten Bildschirm.“ **Bildschirme zurückholen** schließt diese Fenster und zeigt ihre Bildschirme wieder hier.
- **Bildschirme, auf denen Sie gerade nicht arbeiten**: **Live**, **Alle paar Sekunden ein neues Bild** oder **Angehalten**. Die beiden letzten brauchen weniger Bandbreite und weniger Rechenzeit im Browser.
- **Virtuelle Bildschirme**, wenn das Gerät sie unterstützt.

Ein Bildschirm in einem eigenen Fenster nutzt weiter die eine Verbindung des Viewers zum Gerät, deshalb schließt sich das Fenster mit dem Tab des Viewers. Tasten, die du in diesem Fenster drückst, gehen an das Gerät. Blockiert der Browser das neue Fenster, meldet der Viewer „Der Browser hat das neue Fenster blockiert. Erlauben Sie Pop-ups für diese Seite und versuchen Sie es erneut.“

Auf dem entfernten Bildschirm wählt Strg+Alt+Umschalt mit einer Zahl von 1 bis 9 einen Bildschirm, Strg+Alt+Umschalt+L wechselt die Anordnung, Strg+Alt+Umschalt+Z die Größe des Bildschirms, auf dem du arbeitest, und Strg+Alt+Umschalt+P öffnet ihn in einem eigenen Fenster. Das Ende des Menüs **Bildschirme** nennt die Tasten auch.

**Sitzungsinfo** zeigt die Bildrate und Bitrate jedes Bildschirms und das Video aller Bildschirme zusammen. Der Viewer merkt sich die Anordnung, den gezeigten Bildschirm, die Größe jedes Bildschirms und die Einstellung für die anderen Bildschirme pro Gerät und Konto der Konsole in diesem Browser, für die 50 zuletzt genutzten Geräte.

## Tastatur {#keyboard}

Was du tippst, geht an das Gerät. In einer Sitzung mit einem RustDesk-Gerät entscheidet **Tastaturmodus** unter **Anzeige**, wie:

| Modus | Was das Gerät bekommt |
|---|---|
| **Auto (Map, wie RustDesk)** | Der Standard. Bei einem Windows-Gerät gehen Buchstaben, Shift, Strg, Alt, Enter, die Pfeiltasten, die Funktionstasten und jede Taste, die zusammen mit einer Modifikatortaste gedrückt wird, als Tastenpositionen an das Gerät; Ziffern und Symbole, die allein getippt werden, gehen als Zeichen. Bei anderen Geräten verhält er sich wie Legacy |
| **Legacy (Zeichen)** | Das Zeichen, das das Tastaturlayout dieses Computers erzeugt. Enter, die Pfeiltasten und die anderen Sondertasten gehen als benannte Tasten |
| **Map (physischer Scancode)** | Die Position jeder Taste. Das Tastaturlayout des Geräts entscheidet, welches Zeichen daraus wird |

Kommen Zeichen falsch an, zum Beispiel weil dieser Computer und das Gerät unterschiedliche Tastaturlayouts nutzen, probiere einen anderen Modus.

Scheint auf einem RustDesk-Gerät eine Taste zu hängen, etwa weil alles in Großbuchstaben oder als Tastenkürzel ankommt, wähle **Tastatur zurücksetzen** unter **Aktionen**. Das lässt jede Taste los, die der Viewer noch gedrückt hält, und in jedem Fall Shift, Strg, Alt und die Windows-Taste. Der Viewer lässt gehaltene Tasten auch los, wenn du zu einem anderen Fenster oder Browser-Tab wechselst.

Auf einem Mac geht Cmd mit C, V, X, A, Z, S oder F an einen entfernten Computer, der kein Mac ist, als Strg mit derselben Taste, sodass Kopieren, Einfügen, Rückgängig, Speichern und Suchen wie dort funktionieren. **Cmd bei gängigen Tastenkürzeln als Strg senden** unter **Anzeige**, neben **Tastaturmodus**, schaltet das ab. Die Option erscheint nur auf einem Mac und ist standardmäßig an.

Der Browser behält einige Tastenkürzel für sich. Im Vollbild geben Chrome und Edge sie an den entfernten Computer weiter. Firefox und Safari können das nicht, deshalb sagt der Viewer dort im Vollbild „Dieser Browser behält einige Tastenkürzel für sich, auch im Vollbild: Strg+W, Strg+T, Strg+N, die Windows-Taste, und Esc beendet das Vollbild. Aktionen sendet die Windows-Taste, Alt+Tab und Strg+Alt+Entf an den entfernten Computer.“ **Windows-Taste**, **Alt+Tab** und **Ctrl+Alt+Del** unter **Aktionen** funktionieren in jedem Browser.

Ein Touchpad scrollt den entfernten Computer um eine Raste pro Schritt einer Wischbewegung, in Chrome, Edge und Firefox gleich.

## Im Vergleich mit der RustDesk-App {#compared-with-the-rustdesk-app}

Der Viewer deckt die tägliche Fernwartung ab, mit diesen Unterschieden:

- Auf einem Handy läuft er nur im Querformat, ab 640 Pixel Breite. Nutze dort sonst die RustDesk-App.
- Über einfaches HTTP zeigt er nur Geräte mit H.264-Encoder, wie oben beschrieben.
- In **Dateiübertragung** speichert **Ordner herunterladen** einen Ordner vom Gerät als ein ZIP-Archiv mit höchstens 4 GB und 65.535 Dateien und Ordnern. Lokale Ordner zu durchsuchen braucht Chrome oder Edge über HTTPS; andere Browser können trotzdem einzelne Dateien hoch- und herunterladen.
- Sitzungen zu RustDesk-Geräten laufen immer über den Relay-Server und verbrauchen deshalb die Bandbreite des Servers.
- Die Konsole hält höchstens fünf dieser WebSocket-Verbindungen pro Client-Adresse gleichzeitig und schließt eine Verbindung, über die 120 Sekunden lang nichts läuft.
