---
title: Unbeaufsichtigter Zugriff und Wake-on-LAN
description: Ein Gerät ohne jemanden davor erreichen, mit einem permanenten Passwort in NeoDesk oder RustDesk, und einen schlafenden Computer vom Server aus wecken.
order: 10
---

Unbeaufsichtigter Zugriff heißt, sich mit einem Gerät zu verbinden, wenn niemand da ist, der die Verbindung annimmt. Das geht über ein permanentes Passwort, das auf dem Gerät selbst gesetzt wird, im NeoDesk-Client oder im normalen RustDesk. Diese Seite zeigt, wo du dieses Passwort setzt, wie die Konsole dir hilft, es zu teilen, und wie du einen schlafenden Computer aufweckst.

## Das permanente Passwort setzen {#set-the-permanent-password}

Die Konsole kann weder das Passwort setzen noch festlegen, wie das Gerät eine Sitzung annimmt. Eine Einladung aus [Computer hinzufügen](/docs/console/add-a-computer) setzt im NeoDesk-Client den Server, den Schlüssel und das Geräte-Token, aber kein Passwort. Strategien, die Einstellungen, die der Server an Desktop-Clients schickt, enthalten nur Berechtigungen für Sitzungen, etwa Dateiübertragung und Zwischenablage. Setze das Passwort deshalb auf dem Gerät, auf einem der Wege unten.

### Im NeoDesk-Client {#in-the-neodesk-client}

Der Client muss installiert sein: Ein nicht installiertes NeoDesk nimmt Verbindungen nur an, solange sein Fenster offen ist. Der Download einer Einladung installiert ihn unter Windows und Linux.

1. Öffne in NeoDesk **Einstellungen**, dann **Sicherheit**. In einem installierten Client ist die Seite zuerst gesperrt: Klicke auf **Entsperren** und bestätige mit Administratorrechten oder, wenn eine gesetzt ist, mit deiner PIN.
2. Wähle im Abschnitt **Passwort**, wie eine Sitzung angenommen wird. **Sitzung mit Klick und Passwort bestätigen**, der Standard, nimmt das Passwort oder einen Klick auf **Erlauben** am Computer. **Sitzung mit Passwort bestätigen** nimmt nur das Passwort. **Sitzung mit einem Klick bestätigen** nimmt gar kein Passwort, dann muss jemand am Computer sein.
3. Wähle, welches Passwort gilt: **Permanentes Passwort verwenden** oder **Beide Passwörter verwenden**, der Standard, bei dem das Einmalpasswort weiter gilt.
4. Klicke auf **Permanentes Passwort festlegen** und gib das Passwort zweimal ein. Es braucht mindestens 8 Zeichen, mit einer Ziffer, einem Groß- und einem Kleinbuchstaben.

Der Client zeigt das permanente Passwort danach nicht mehr an.

Ein Administrator kann das Passwort in einem installierten Client auch auf der Kommandozeile setzen, zum Beispiel aus einem Werkzeug zur Softwareverteilung. Unter Windows, in PowerShell als Administrator, mit dem Client in seinem Standardordner und dem Passwort anstelle von `<permanent-password>`:

```powershell
Start-Process -FilePath "$env:ProgramFiles\NeoDesk Client\neodesk.exe" -ArgumentList @('--password', '<permanent-password>') -Wait -NoNewWindow
```

Unter Linux, wieder mit dem Passwort anstelle von `<permanent-password>`:

```bash
sudo neodesk --password '<permanent-password>'
```

Dasselbe Programm setzt die beiden anderen Wahlen mit `--option`: `--option approve-mode password` ist **Sitzung mit Passwort bestätigen**, und `--option verification-method use-permanent-password` ist **Permanentes Passwort verwenden**.

Das **Windows-Installationsskript (Intune)** der Konsole erreicht den NeoDesk-Client nicht: Es startet `rustdesk.exe` aus dem RustDesk-Ordner, für das normale RustDesk.

### Im normalen RustDesk {#in-stock-rustdesk}

Setze das Passwort in RustDesk auf dem Gerät, oder setze es beim Ausrollen mit dem Windows-Installationsskript. Öffne dazu auf **Übersicht** unter **Client-Einrichtung** das Menü **Mehr** und wähle **Windows-Installationsskript (Intune)**. Das Skript endet mit zwei auskommentierten Zeilen:

```powershell quoted
# Optional unattended password:
# Start-Process -FilePath $RustDesk -ArgumentList @('--password', 'YourPermanentPassword') -Wait -NoNewWindow
```

Entferne das `#` am Anfang der zweiten Zeile und setze für `YourPermanentPassword` das Passwort ein. Jeder Computer, auf dem das Skript läuft, bekommt dann dieses Passwort. Wer das Skript lesen kann, kann auch das Passwort lesen; bewahre es deshalb so auf, dass nur Administratoren es sehen. [Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers) erklärt den Rest des Skripts.

## Das Passwort mit deinem Team teilen {#share-the-password-with-your-team}

Wer sich im RustDesk-Client mit seinem Konto anmeldet, kann das Passwort eines Geräts vom Server bekommen und muss es nicht eintippen. Füge das Gerät als Kontakt zum gemeinsamen Adressbuch einer Organisation hinzu und wähle beim Kontakt **Passwort setzen**. Das Passwort muss mit dem übereinstimmen, das auf dem Gerät gesetzt ist. [Das gemeinsame Adressbuch](/docs/people/organizations#the-shared-address-book) erklärt, wer es bekommt. Ist das Gerät auch dieser Organisation zugewiesen, trägt der Web-Viewer der Konsole das Passwort ebenfalls selbst ein.

Die Konsole hat keinen Zugriffszeitplan und keine Liste erlaubter Operatoren pro Gerät: Ob eine Verbindung das Passwort braucht oder jemanden am Gerät, der sie annimmt, entscheidet der Client auf dem Gerät, NeoDesk oder RustDesk. Eine Zugriffsrichtlinie, die für ein Gerät gespeichert wurde, bleibt gespeichert, aber beim Verbinden prüft sie niemand.

## Wake-on-LAN {#wake-on-lan}

Der Server kann ein Wake-on-LAN-Paket an einen Computer in seinem eigenen Netzwerk senden. Das Paket geht vom Server aus, deshalb erreicht es nur Computer im Netzwerk des Servers.

1. Öffne **Support**, dann **Netzwerk-Tools**. Der Eintrag steht in der Seitenleiste unter **Mehr**.
2. Öffne im Tab **Netzwerk** den Punkt **Wake-on-LAN**.
3. Gib die **MAC-Adresse** des Computers ein, zum Beispiel `AA:BB:CC:DD:EE:FF`.
4. Lass **Broadcast-Adresse** leer, um das Paket an `255.255.255.255` zu senden, oder gib die IPv4-Broadcast-Adresse des Netzwerks ein, in dem der Computer steht, etwa `192.168.1.255`.
5. Klicke auf **Weckpaket senden**.

Der Server sendet das Paket an UDP-Port 9 der Broadcast-Adresse, und die Konsole zeigt, wohin es ging. Das Werkzeug braucht die Berechtigung **Mit Geräten verbinden**, die Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator standardmäßig haben.

Ein Gerät, das sich über einen MeshAgent verbindet, hat **Wake** in seinem Tab **Aktionen**. Solange der Agent offline ist, sendet der Server das Paket selbst, wenn er die MAC-Adresse des Geräts kennt. **Wake** braucht die Berechtigung **Ein-/Ausschalten von MeshCentral-Agenten**.
