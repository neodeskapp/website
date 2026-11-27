---
title: Viele Computer auf einmal einrichten
description: Nimm viele Computer mit einem Einladungslink auf oder gib dem normalen RustDesk-Client seine Servereinstellungen per Installationsskript mit.
order: 1
---

Es gibt zwei Wege, viele Computer einzurichten. Eine Einladung aus
**Computer hinzufügen**, die mehrmals gilt, installiert den NeoDesk-Client und
nimmt jeden Computer genehmigt auf. Für den normalen RustDesk-Client gibt dir
die Konsole die vier Werte als eine Konfigurationszeichenfolge, dazu ein
PowerShell-Skript, das sie unter Windows anwendet. Diese Seite beschreibt
beides und was passiert, wenn viele neue Geräte auf einmal beitreten.

## Mit einer Einladung {#with-one-invite}

1. Öffne **Geräte**, dann **Alle Geräte**, und wähle **Computer hinzufügen**.
2. Wähle einen **Ordner** für die Computer und lass **Name** leer, damit jeder
   Computer seinen eigenen Namen behält.
3. Wähle unter **Kann benutzt werden** eine der Optionen **5-mal**, **25-mal**
   oder **Bis zum Ablauf**, und unter **Gilt für**, wie lange der Link gilt:
   1, 7 oder 30 Tage. Auch **Bis zum Ablauf** endet nach 1000 Computern.
4. Wähle **Einladung erstellen** und schick den Link an die Leute an den
   Computern.

Jeder Computer, der den Link öffnet, bekommt den NeoDesk-Client: unter Windows
und macOS als Download, unter Linux als ein Befehl zum Einfügen. Er wird
genehmigt aufgenommen, in dem Ordner, den du gewählt hast, ohne Zwischenstopp
unter **Beitrittsanfragen**. **Offene Einladungen** im selben Seitenbereich
zeigt, wie viele Verwendungen noch übrig sind, und **Widerrufen** beendet eine
Einladung vorzeitig. [Computer hinzufügen](/docs/console/add-a-computer)
erklärt die Einladung im Detail.

## Mit dem normalen RustDesk-Client {#with-the-stock-rustdesk-client}

### Zuerst die Adresse prüfen {#check-the-address-first}

Die Konfigurationszeichenfolge und das Skript werden aus der Adresse gebaut,
die die Clients nutzen. Lege sie unter **Einstellungen**, **Allgemein**,
**Öffentliche Client-Endpunkte** fest, bevor du etwas kopierst, siehe
[Die Adresse für die Clients festlegen](/docs/getting-started/first-sign-in#set-the-address-clients-use).
Ein Computer, der mit der falschen Adresse eingerichtet wurde, muss neu
eingerichtet werden.

Hast du auf **Übersicht** eine andere Adresse in **Client-Serveradresse**
eingegeben, nutzen Zeichenfolge und Skript diese Adresse, solange der
Browser-Tab offen bleibt.

### Die Konfigurationszeichenfolge {#the-config-string}

Die Konfigurationszeichenfolge enthält ID-Server, Relay-Server, API-Server und
Schlüssel in einer Zeile. Kopiere sie von einer der beiden Stellen:

- **Geräte**, **Übersicht**: Öffne unter **Client-Einrichtung** das Menü
  **Mehr** und wähle **Deploy-String kopieren**.
- **Geräte**, **Computer hinzufügen**, **Manuelle Einrichtung**: das Feld
  **Konfigurationszeichenfolge** mit seiner Schaltfläche **Kopieren**.

Beide liefern dieselbe Zeichenfolge. Auf einem einzelnen Computer importierst
du sie in den Netzwerkeinstellungen von RustDesk mit Serverkonfiguration
importieren. In einem Installationsskript übergibst du sie RustDesk mit der
Option `--config`.

Willst du die Zeichenfolge in deinem eigenen Skript bauen, etwa mit anderen
Werten, beginne mit den vier Werten als JSON mit den Feldnamen `host`,
`relay`, `api` und `key`. Kodiere das in Base64, entferne die `=`-Zeichen am
Ende und kehre das Ergebnis um. Das Windows-Installationsskript unten macht
genau das in PowerShell.

### Windows: das Installationsskript {#windows-the-install-script}

Öffne auf **Übersicht** unter **Client-Einrichtung** das Menü **Mehr** und
wähle **Windows-Installationsskript (Intune)**. Ein Seitenpanel zeigt ein
PowerShell-Skript, `install-rustdesk-config.ps1`, mit den Werten dieses
Servers. Der Codeblock hat eine Schaltfläche zum Kopieren.

1. Verteile das RustDesk-MSI wie gewohnt, etwa als Intune-Win32-App oder mit
   PSADT.
2. Führe das Skript als Administrator aus, nachdem der Installer fertig ist,
   als Schritt nach der Installation.

Das Skript baut die Konfigurationszeichenfolge und ruft damit
`rustdesk.exe --config` im RustDesk-Ordner unter `%ProgramFiles%` auf.

Es setzt denselben Relay-Server wie die Konfigurationszeichenfolge, mit Port:
den Wert aus **Öffentlicher Relay-Server**, wenn einer gesetzt ist, sonst den
ID-Server.

Die letzte Zeile des Skripts ist auskommentiert. Sie setzt ein permanentes
Passwort für unbeaufsichtigten Zugriff, siehe
[Das permanente Passwort setzen](/docs/console/unattended-access#set-the-permanent-password).

### Andere Systeme {#other-systems}

Die Konsole hat nur für Windows ein Installationsskript. Auf anderen Systemen
übergibst du die Konfigurationszeichenfolge in deinem eigenen Skript an die
RustDesk-Option `--config`, oder die Leute importieren sie selbst in den
Netzwerkeinstellungen von RustDesk. Unter Linux braucht die Option
Root-Rechte. Setze die Konfigurationszeichenfolge für `<config-string>` ein:

```bash
sudo rustdesk --config '<config-string>'
```

Für Skripte, die den Schlüssel des Servers aus einer Datei lesen, gibt es unter
**Geräte**, **Computer hinzufügen**, **Manuelle Einrichtung** im Bereich
**Downloads** die
Schaltfläche **Schlüsseldatei herunterladen**. Sie speichert den Schlüssel als
`id_ed25519.pub`.

## Wenn die neuen Geräte beitreten {#when-the-new-devices-join}

Computer, die mit einer Einladung beitreten, sind schon genehmigt. Ein normaler
RustDesk-Client registriert sich beim Server, sobald er mit den neuen
Einstellungen läuft. Was dann passiert, hängt vom Beitrittsmodus ab:

- **Offen**: Jeder Computer wird sofort aufgenommen und erscheint unter
  **Geräte**, dann **Alle Geräte**. Solange der Modus Offen ist, kann jeder
  RustDesk-Client beitreten, der deinen Server erreicht.
- **Verwaltet**: Jeder Computer wartet unter **Geräte**, dann
  **Beitrittsanfragen**, bis jemand ihn genehmigt. Beim Genehmigen werden
  Name, Ordner, Tags und Gruppen festgelegt. Höchstens 1000 RustDesk-Clients
  können gleichzeitig warten; solange die Liste so voll ist, kommen neue erst
  hinein, wenn wieder Platz ist.
- **Gesperrt**: Neue RustDesk-Clients werden abgewiesen. Der normale
  RustDesk-Client kann keinen Gerätetoken senden, deshalb helfen Tokens aus
  **Computer hinzufügen**, **Gerätetokens** hier nicht.

Eine neue Installation startet im Modus **Verwaltet**. Für einen großen
Rollout normaler Clients kannst du auf **Offen** umstellen, solange die
Computer beitreten, und zurück auf **Verwaltet**, wenn alle da sind: Ein Gerät,
das der Server schon kennt, kann sich in jedem Modus neu registrieren. Ein
Computer, der beim Umstellen schon wartete, wird genehmigt, wenn er sich das
nächste Mal registriert. Siehe
[Den Modus ändern](/docs/console/enrollment#changing-the-mode) und
[Ein Gerät genehmigen](/docs/console/enrollment#approving-a-device).

Computer in einem Büro erreichen den Server oft über eine einzige öffentliche
Adresse. Sind mehrere davon online, kann eine Sitzung von einem dieser
Computer zu einem anderen Gerät mit „ID does not exist“ fehlschlagen (im
deutschen Client „Diese ID existiert nicht.“). Unter
[Fehlersuche](/docs/operations/troubleshooting#clients-show-not-ready-or-cannot-connect)
steht die Einstellung, die solche Sitzungen erlaubt.
