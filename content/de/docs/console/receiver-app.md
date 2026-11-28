---
title: Die Empfänger-App
description: Bring die NeoDesk-App auf die Computer, die du betreust, damit Leute Hilfe holen, dir schreiben und Tickets eröffnen, und installiere sie still per MSI.
order: 6.5
---

Die Empfänger-App ist die NeoDesk-App auf dem Computer, den du betreust. Sie
ist für die Person gemacht, die daran sitzt, nicht für die Helfer: Sie hat
keine Einstellungen, keine ID und kein Passwort und kann sich nicht mit
anderen Computern verbinden. Ihr Fenster hat drei Bereiche:

- **Hilfe holen**: Die Person gibt den Code oder Link ein, den du ihr gegeben
  hast, und eine Support-Sitzung beginnt.
- **Nachrichten**: der Chat mit deinem Team.
- **Meine Tickets**: Die Person meldet mit **Etwas funktioniert nicht** ein
  Problem und liest deine Antworten.

Firmenname, Logo und Akzentfarbe kommen aus dem Branding deines Servers.
[Die NeoDesk-App benutzen](/docs/console/receiver-app/using-the-app)
beschreibt die App für die Person am Computer; diese Seite kannst du ihr
schicken.

Dieselbe App läuft auf zwei Arten:

- **Ohne Installation**, für die [Schnellhilfe](/docs/console/quick-support):
  eine Sitzung über einen Link, und auf dem Computer bleibt nichts zurück.
- **Installiert**, als Windows-Dienst mit einem Symbol im Infobereich. Sie
  tritt deinem Server von selbst bei, erscheint unter **Geräte** und hält
  Nachrichten und Meine Tickets auch zwischen Sitzungen offen.

Diese Seite beschreibt die installierte App. Es gibt sie nur für Windows;
für macOS und Linux gibt es sie noch nicht.

## Verteilen {#deploy-it}

Öffne **Geräte**, dann **Computer hinzufügen**, Tab **Empfänger-App**. Der Tab
braucht die Berechtigung **Beitritt verwalten**.

![Der Tab Receiver app mit eingetragenem Rollout-Token, den MSI-Eigenschaften rechts und dem Befehl für die stille Installation unten](shot:receiver-app)

### Der Token {#the-token}

Der Token lässt die Computer in jedem
[Beitrittsmodus](/docs/console/enrollment#enrollment-modes) auf deinen
Server, ohne Zwischenstopp unter **Beitrittsanfragen**. Den Befehl und den
Download zeigt der Tab, sobald ein Token eingetragen ist.

Klicke auf **Rollout-Token erstellen** für einen Token, mit dem viele Computer
beitreten:

![Der Dialog Create token mit gewähltem For many computers, einem Namen, Computers allowed und Expires after](shot:receiver-rollout-token)

| Feld | Was es macht |
|---|---|
| Name | Steht in der Liste der Tokens, damit du weißt, wofür der Token war. |
| Erlaubte Computer | Wie viele Computer insgesamt mit diesem Token beitreten können, 1 bis 100.000. Anfangs 100. |
| Läuft ab nach | 24 Stunden, 7 Tage, 30 Tage (Standard), 90 Tage oder 1 Jahr. Danach tritt kein Computer mehr damit bei; die beigetretenen arbeiten weiter. |
| Ordner | Der Ordner, in den jeder Computer kommt, der mit dem Token beitritt. |
| Richtlinien | Die Organisation, deren Richtlinien diese Computer bekommen. |

Klicke auf **Token erstellen**, und der Tab trägt den Token ein. Es wird nur
dieses eine Mal angezeigt. Jeder Computer bekommt beim Beitritt seinen eigenen
Zugang, der Rollout-Token ist also nie die Anmeldung eines Computers. Unter
**Gerätetokens** zeigt die Zeile des Tokens, wie viele Computer beigetreten
und wie viele Plätze übrig sind, zum Beispiel „12 beigetreten, 88 übrig“.
**Widerrufen** stoppt dort neue Beitritte und lässt die beigetretenen Computer
in Ruhe; dort kannst du auch die Grenze erhöhen.

Ein Token aus **Gerätetokens**, der **Für einen Computer** erstellt wurde,
geht auch, für genau diesen einen Computer.

**Ordner** auf dem Tab Empfänger-App gilt nur, wenn der Token keinen eigenen
Ordner hat.

### Der Download {#the-download}

**Installationsprogramm herunterladen** liefert ein Zip mit
`neodesk-support.msi` und `install.cmd`. Das MSI ist das NeoDesk Support
Agent Release, das dein Server auf dem Tab **Support-Agenten** importiert hat;
ohne eines sagt der Tab das und verlinkt dorthin. Unter **Prozessor** wählst
du x64 oder ARM64, wenn das Release beides hat.

Für einen einzelnen Computer führst du `install.cmd` als Administrator aus.
Es startet das MSI mit den Eigenschaften deines Servers und bricht ab, wenn
es keine Administratorrechte hat.

## Still installieren {#install-it-silently}

Das MSI nimmt die Werte deines Servers als Eigenschaften. **MSI-Eigenschaften**
auf dem Tab zeigt jede mit einer Kopieren-Schaltfläche, **Stille
Installation** den ganzen Befehl.

| Eigenschaft | Was hinein gehört | Nötig |
|---|---|---|
| `SERVER` | Der ID-Server, Hostname und optional der Port | Ja, für eine stille Installation |
| `KEY` | Der öffentliche Schlüssel des Servers | Ja, für eine stille Installation |
| `API` | Die API-Adresse. Ohne sie nimmt die App `https://` und den Host von `SERVER`. | Nein |
| `TOKEN` | Ein Rollout-Token oder ein Token für einen Computer | Auf Servern im Modus **Verwaltet** und **Gesperrt** |
| `GROUP` | Ein Ordner, als ID oder Name. Der eigene Ordner des Tokens hat Vorrang. | Nein |

Führe den Befehl dort aus, wo `neodesk-support.msi` liegt, zum Beispiel als
Installationsbefehl einer Win32-App in Intune, in einem Skript deines
RMM-Werkzeugs oder in einem Computer-Startskript per Gruppenrichtlinie:

```powershell
msiexec /i neodesk-support.msi /qn SERVER=<id-server> KEY=<server-key> API=<api-address> TOKEN=<rollout-token> GROUP=<folder-id>
```

Setz die Werte vom Tab ein: `SERVER` für `<id-server>`, `KEY` für
`<server-key>`, `API` für `<api-address>`, deinen Token für
`<rollout-token>` und die ID des Ordners für `<folder-id>`. Oder kopiere den
ganzen Befehl aus **Stille Installation**. Lass `GROUP` weg, wenn der Token
einen Ordner hat. Setze einen Wert nur dann
in doppelte Anführungszeichen, wenn er ein Leerzeichen oder ein
Anführungszeichen enthält, und verdopple ein Anführungszeichen darin.

`TOKEN` ist eine verborgene Eigenschaft: Das MSI hält sie aus seinem Protokoll
heraus. Ein Wert, den eine signierte Konfiguration der App schon festlegt,
hat Vorrang vor einer Eigenschaft; das NeoDesk Support Agent Release hat
keine, für sein MSI sind die Eigenschaften also die einzigen
Servereinstellungen.

## Was auf dem Computer passiert {#what-happens-on-the-computer}

Das MSI installiert die App nach `C:\Program Files\NeoDesk Support Agent\`
und schreibt die Eigenschaften in `neodesk-install.txt` in diesem Ordner. Die
App liest die Datei nur, wenn sie in ihrem eigenen Ordner unter Program Files
liegt und nur Administratoren und das System sie ändern können.

Wenn der Dienst zum ersten Mal startet, tritt die App deinem Server mit dem
Token bei und erscheint unter **Geräte**, im Ordner und in der Organisation
des Tokens. Sobald der Server geantwortet hat, entfernt die App den Token aus
der Datei. Ein Symbol im Infobereich öffnet die App für jede Person, die sich
anmeldet.

Wird das MSI noch einmal ohne Eigenschaften installiert, bleiben die
bisherigen Einstellungen; ein Update braucht sie also nicht.

Eine installierte Empfänger-App zählt als Gerät, auch für die Gerätegrenze
eines Tenants.

## Unbeaufsichtigter Zugriff {#unattended-access}

Die installierte App folgt **Freigabe von Sitzungen** in den Richtlinien der
Organisation des Computers, unter **Regeln**, **Richtlinien**, Gruppe
**Verbindung**. Sie prüft sie alle fünf Minuten.

| Freigabe von Sitzungen | Wer hineinkommt |
|---|---|
| **Unbetreut: ohne Rückfrage verbinden** | Jemand aus deinem Team mit dem dauerhaften Passwort des Computers oder jeder, den die Person zulässt. |
| **Immer fragen** | Nur jemand, den die Person am Computer zulässt. |
| **Betreut: die Person am Gerät muss zustimmen** oder nicht festgelegt | Die eigene Zugriffsrichtlinie des Geräts entscheidet. Ohne eine nur jemand, den die Person am Computer zulässt. |

Die App hat dafür keine eigenen Einstellungen. Eine Support-Sitzung über
**Hilfe holen** beginnt immer damit, dass die Person auf **Erlauben** klickt.

## Die App entfernen {#removing-the-app}

Eine Person mit Administratorrechten entfernt die App in Windows unter
**Einstellungen**, **Apps**, **Installierte Apps**. Das stoppt und löscht den
Dienst und entfernt die Dateien, auch `neodesk-install.txt`. Aus einem
Verteilungswerkzeug führst du als Administrator dort, wo das MSI liegt, aus:

```powershell
msiexec /x neodesk-support.msi /qn
```

Damit Leute die App nicht entfernen, schalte **Personen können die App
entfernen** in den Richtlinien der Organisation der Computer aus, unter
**Regeln**, **Richtlinien**, Gruppe **Sicherheit**. Die App blendet dann
ihren Eintrag in **Installierte Apps** und in Programme und Features aus und
nimmt ihre Verknüpfung zum Deinstallieren aus dem Startmenü. Ist der Schalter
an oder nicht festgelegt, ist das Entfernen erlaubt. Ein Administrator kann
die App mit `msiexec /x` trotzdem entfernen.

## Das Angebot nach der Schnellhilfe {#the-offer-after-quick-support}

Am Ende einer [Schnellhilfe](/docs/console/quick-support)-Sitzung, nach der
Rückmeldung, fragt die App „Den Support von Fernhill IT auf diesem Computer
behalten?“ mit dem Namen deiner Firma, dazu **Installieren** oder
**Nein, danke**.

![Das Schnellhilfe-Fenster mit der Frage Keep Fernhill IT support on this computer?, Install und No thanks](shot:receiver-offer)

**Installieren** fragt Windows nach Administratorrechten, installiert die App
und lässt den Computer deinem Server beitreten. Einen Token braucht es nicht:
Die Sitzung bringt eine einmalige Zulassung mit, die 24 Stunden gilt, für
genau diesen Computer, auch auf einem Server im Modus **Verwaltet** oder
**Gesperrt**. Der Computer kommt in keinen Ordner.

Auf einem Computer, der schon NeoDesk hat, fragt die App nicht, und sie fragt
nur unter Windows. Schalte das Angebot unter **Einstellungen**,
**Schnellhilfe** mit **Nach der Schnellhilfe die Installation anbieten** aus.
Es ist anfangs an und gilt für Sitzungen, die nach der Änderung beginnen.

## Wo du antwortest {#where-you-answer}

- **Nachrichten** in der App ist die Unterhaltung des Computers unter
  **Support**, **Chat**. Siehe [Chat](/docs/console/chat).
- Ein Ticket aus der App erscheint unter **Support**, **Tickets**. Die
  Auswahl neben der Priorität zeigt mit **Von Computern** nur diese Tickets.

![Die Ticketliste gefiltert auf From computers, mit zwei Tickets, die Personen an ihren Computern eröffnet haben](shot:tickets-from-computers)

So ein Ticket sagt, wer es eröffnet hat, zum Beispiel „Von Anna Weber am
Computer 900100001 erstellt“, mit einem Link zum Computer. Der Server hängt an,
was er über den Computer weiß, als `computer-info.json`. Deine öffentlichen
Antworten und Statusänderungen erreichen die App sofort, solange sie online
ist, und zeigen der Person eine Benachrichtigung; interne Notizen bleiben in
der Konsole. Die Glocke in der oberen Leiste meldet dir neue Tickets und
Antworten von Computern.
