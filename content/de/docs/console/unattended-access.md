---
title: Unbeaufsichtigter Zugriff und Wake-on-LAN
description: Ein RustDesk-Gerät erreichen, wenn niemand davor sitzt, und einen schlafenden Computer vom Server aus aufwecken.
order: 10
---

Unbeaufsichtigter Zugriff heißt, sich mit einem Gerät zu verbinden, wenn niemand da ist, der die Verbindung annimmt. Mit dem RustDesk-Client geht das über ein permanentes Passwort, das auf dem Gerät selbst gesetzt wird. Diese Seite zeigt, wie die Konsole dir hilft, dieses Passwort zu setzen und zu teilen, und wie du einen schlafenden Computer aufweckst.

## Das permanente Passwort setzen {#set-the-permanent-password}

Setze das Passwort in RustDesk auf dem Gerät, oder setze es beim Ausrollen mit dem Windows-Installationsskript. Öffne dazu auf **Übersicht** unter **Client-Einrichtung** das Menü **Mehr** und wähle **Windows-Installationsskript (Intune)**. Das Skript endet mit zwei auskommentierten Zeilen:

```powershell quoted
# Optional unattended password:
# Start-Process -FilePath $RustDesk -ArgumentList @('--password', 'YourPermanentPassword') -Wait -NoNewWindow
```

Entferne das `#` am Anfang der zweiten Zeile und setze für `YourPermanentPassword` das Passwort ein. Jeder Computer, auf dem das Skript läuft, bekommt dann dieses Passwort. Wer das Skript lesen kann, kann auch das Passwort lesen; bewahre es deshalb so auf, dass nur Administratoren es sehen. [Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers) erklärt den Rest des Skripts.

## Das Passwort mit deinem Team teilen {#share-the-password-with-your-team}

Wer sich im RustDesk-Client mit seinem Konto anmeldet, kann das Passwort eines Geräts vom Server bekommen und muss es nicht eintippen. Füge das Gerät als Kontakt zum gemeinsamen Adressbuch einer Organisation hinzu und wähle beim Kontakt **Passwort setzen**. Das Passwort muss mit dem übereinstimmen, das auf dem Gerät gesetzt ist. [Das gemeinsame Adressbuch](/docs/people/organizations#the-shared-address-book) erklärt, wer es bekommt.

Die Konsole hat keinen Zugriffszeitplan und keine Liste erlaubter Operatoren pro Gerät: Ob eine Verbindung das Passwort braucht oder jemanden am Gerät, der sie annimmt, entscheidet RustDesk auf dem Gerät. Eine Zugriffsrichtlinie, die für ein Gerät gespeichert wurde, bleibt gespeichert, aber beim Verbinden prüft sie niemand.

## Wake-on-LAN {#wake-on-lan}

Der Server kann ein Wake-on-LAN-Paket an einen Computer in seinem eigenen Netzwerk senden. Das Paket geht vom Server aus, deshalb erreicht es nur Computer im Netzwerk des Servers.

1. Öffne **Support**, dann **Netzwerk-Tools**. Der Eintrag steht in der Seitenleiste unter **Mehr**.
2. Öffne im Tab **Netzwerk** den Punkt **Wake-on-LAN**.
3. Gib die **MAC-Adresse** des Computers ein, zum Beispiel `AA:BB:CC:DD:EE:FF`.
4. Lass **Broadcast-Adresse** leer, um das Paket an `255.255.255.255` zu senden, oder gib die IPv4-Broadcast-Adresse des Netzwerks ein, in dem der Computer steht, etwa `192.168.1.255`.
5. Klicke auf **Weckpaket senden**.

Der Server sendet das Paket an UDP-Port 9 der Broadcast-Adresse, und die Konsole zeigt, wohin es ging. Das Werkzeug braucht die Berechtigung **Mit Geräten verbinden**, die Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator standardmäßig haben.

Ein Gerät, das sich über einen MeshAgent verbindet, hat **Wake** in seinem Tab **Aktionen**. Solange der Agent offline ist, sendet der Server das Paket selbst, wenn er die MAC-Adresse des Geräts kennt. **Wake** braucht die Berechtigung **Ein-/Ausschalten von MeshCentral-Agenten**.
