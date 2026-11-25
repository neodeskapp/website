---
title: Chat
description: Den Personen an deinen Computern in einem gemeinsamen Support-Posteingang antworten und Kollegen direkt oder in Gruppen schreiben.
order: 7.5
---

Der Chat hat zwei Bereiche. **Support** hat eine Unterhaltung pro Computer, mit
der Person, die daran sitzt. **Team** hat deine Unterhaltungen mit Kollegen. Du
öffnest ihn in der Seitenleiste unter **Support**, **Chat**, oder über den
Chat-Knopf in der oberen Leiste. Der öffnet denselben Chat als Bereich über der
Seite, auf der du gerade bist.

![Die Chat-Seite mit Support: links der Posteingang mit den Filtern Offen, Meine und Abgeschlossen, rechts eine Unterhaltung mit einem Computer](shot:chat)

## Wer ihn nutzen kann {#who-can-use-it}

Vier Berechtigungen bestimmen, was ein Konto im Chat darf:

| Berechtigung | Was sie erlaubt | Rollen, die sie von Anfang an haben |
|---|---|---|
| **Support-Chat** | Die Unterhaltungen mit Computern lesen und schreiben, die das Konto sehen kann | Super-Admin, Globaler Administrator, Remote-Operator, Betrachter |
| **Team-Chat** | Kollegen schreiben und in Gruppen mitschreiben | Super-Admin, Globaler Administrator, Remote-Operator, Betrachter |
| **Unterhaltungen zuweisen** | Eine Unterhaltung übernehmen, an Kollegen übergeben, jede Unterhaltung abschließen | Super-Admin, Globaler Administrator, Remote-Operator |
| **Textbausteine verwalten** | Die Textbausteine pflegen, die alle nutzen | Super-Admin, Globaler Administrator |

Ein Konto sieht die Unterhaltung eines Computers nur, wenn es diesen Computer
sehen kann, nach denselben Gerätezugriffen wie in der Geräteliste. Die
Berechtigungen einer Rolle änderst du auf der Seite
[Berechtigungen](/docs/people/permissions).

## Support {#support}

### Der Posteingang {#the-inbox}

**Support** listet die Computer, die eine Unterhaltung haben. Drei Filter
sortieren sie:

- **Offen**: Unterhaltungen, die noch offen sind, die ohne Zuständigen zuerst.
- **Meine**: die Unterhaltungen, um die du dich kümmerst.
- **Abgeschlossen**: Unterhaltungen, die jemand abgeschlossen hat.

Jede Zeile zeigt den Namen des Computers, seinen Ordner und Besitzer, ob er
online ist, die neueste Zeile und die Zahl der ungelesenen Nachrichten. Ein
Etikett sagt, wer sich kümmert, oder **Wartet auf jemanden**, solange es
niemand tut.

Um einem Computer zu schreiben, der noch keine Unterhaltung hat, klick auf
**Neu**. **An einen Computer schreiben** findet ihn nach Name, ID, Hostname,
Besitzer oder Ordner.

### Eine Unterhaltung übernehmen und übergeben {#taking-and-handing-on-a-conversation}

Der Kopf einer Unterhaltung zeigt den Computer, seinen Besitzer, Ordner und
seine ID und wer sich kümmert. Mit **Unterhaltungen zuweisen** kannst du:

- auf **Übernehmen** klicken, um dich selbst zu kümmern. Wer sich vorher
  gekümmert hat, bekommt einen Hinweis.
- im Menü der Unterhaltung **An … übergeben** mit einem Kollegen wählen. Die
  Liste zeigt nur Kollegen, die den Computer sehen können.
- **In den Posteingang zurückgeben** wählen, damit sich niemand kümmert.

Jeder dieser Schritte erscheint als Zeile in der Unterhaltung. Das Menü hat
außerdem **Verbinden**, **Computer öffnen** und **Neues Ticket**.

### Eine Unterhaltung abschließen {#closing-a-conversation}

**Abschließen** fragt nach einer Notiz, die du weglassen kannst. Kollegen sehen
die Notiz in der Unterhaltung, die Person am Computer nicht. **Auch die offene
Hilfeanfrage des Computers als erledigt markieren** ist zuerst angehakt: Hat der
Computer eine offene Hilfeanfrage, erledigt das Abschließen sie mit.

**Wieder öffnen** öffnet eine abgeschlossene Unterhaltung wieder. Auch eine neue
Nachricht vom Computer öffnet sie wieder und legt sie zurück in den
Posteingang, ohne Zuständigen.

### Hilfeanfragen und Tickets {#help-requests-and-tickets}

Schreibt ein Computer mit einer offenen Hilfeanfrage im Chat, wird seine
Unterhaltung mit der Hilfeanfrage verknüpft: **Offene Hilfeanfrage** im Kopf
führt zu **Hilfeanfragen**. **Hilfeanfragen** hat einen Knopf **Chat** für jede
Anfrage von einem Computer, und der Seitenbereich des Geräts hat einen für den
Computer.

**Neues Ticket** im Menü der Unterhaltung öffnet ein neues Ticket mit dem
Computer und dem Titel „Support für“ und dem Namen des Computers. Die
Unterhaltung ist dann mit dem Ticket verknüpft.

### Ob die Person deine Nachrichten sieht {#whether-the-person-sees-your-messages}

Eine Zeile unter dem Kopf sagt, ob deine Nachrichten gerade jemanden erreichen:

- „Die Person sieht Ihre Nachrichten jetzt in der NeoDesk-App.“ Die NeoDesk-App
  des Computers hält den Chat offen.
- „Der Agent des Computers empfängt Ihre Nachrichten.“ Auf dem Computer läuft
  ein Agent, der Chatnachrichten annimmt.
- „Gerade nicht erreichbar. Die Person sieht Ihre Nachrichten, sobald der Chat
  der NeoDesk-App öffnet, oder in einer Fernsitzung.“ Der Server hebt auf, was du
  schreibst.

Das Chatfenster der NeoDesk-App kommt mit einem Client-Release nach 1.5.0-rc.7.
Mit 1.5.0-rc.7 oder älter und mit einem RustDesk-Client kann die Person nur in
einer Fernsitzung lesen und antworten.

### In einer Fernsitzung {#in-a-remote-session}

Der Chat einer Fernsitzung im Web-Viewer gehört zur Unterhaltung des Computers,
wenn du **Support-Chat** hast. Was die Person in der Sitzung schreibt, wird in
der Unterhaltung gespeichert, und was du dem Computer schreibst, auch auf der
Chat-Seite oder im Chat-Bereich, kommt als reiner Text in die Sitzung.
Antworten, Änderungen und Reaktionen erreichen die Sitzung nicht, und eine Datei
kommt dort als „File:“ mit ihrem Namen an, ohne Link. Ohne **Support-Chat**
bleibt der Chat der Sitzung in der Sitzung und wird nicht gespeichert.

## Team {#team}

**Team** listet deine Unterhaltungen mit Kollegen und unter **Kollegen** alle
mit **Team-Chat**, denen du noch nicht geschrieben hast. Eine Zeile zeigt den
Namen, die Rolle und den Status. Deinen eigenen Status setzt du im Kontomenü
unter **Mein Status**: **Online**, **Abwesend** oder **Beschäftigt**.

- Eine direkte Unterhaltung erreicht nur ihre zwei Personen.
- Klick auf **Neu**, dann **An Kollegen schreiben**. Wähl einen Kollegen und
  **Schreiben** für eine direkte Unterhaltung, oder mehrere, einen
  **Gruppenname** und **Gruppe starten** für eine Gruppe.
- **Gruppe bearbeiten** im Kopf einer Gruppe ändert ihren Namen und ihre
  Mitglieder.

### Alte Nachrichten {#old-messages}

Beim ersten Start verschiebt der Server die Nachrichten des früheren Chats
einmal. Direkte Nachrichten kommen in die Unterhaltung ihrer zwei Personen,
Gruppen mit zwei oder mehr Konten werden Gruppen, und was ein Computer
geschrieben hat, kommt in die Unterhaltung dieses Computers. Nachrichten, die
zu niemandem passen, etwa an ein Konto, das es nicht mehr gibt, bleiben unter
**Alte Nachrichten** in **Team**. Nur Admins (Super-Admin, Administrator,
Serveradministrator und Globaler Administrator) sehen sie, und niemand kann
dort schreiben.

## Nachrichten schreiben {#writing-messages}

Enter sendet, Umschalt+Enter fügt eine Zeile ein. Eine Nachricht hat bis zu
4096 Zeichen und bis zu 10 Dateien mit je 50 MB. Dateien fügst du mit der
Büroklammer hinzu, du kannst ein Bild aus der Zwischenablage einfügen oder
Dateien auf die Unterhaltung ziehen.

Die Aktionen einer Nachricht erscheinen, wenn du auf sie zeigst oder der Fokus
auf ihr liegt:

- **Antworten** zitiert die Nachricht über deiner.
- **Bearbeiten** ändert deine eigene Nachricht bis 24 Stunden nach dem Senden.
  Andere sehen „bearbeitet“ daneben.
- **Löschen** entfernt deine eigene Nachricht, jederzeit. Admins können jede
  Nachricht löschen. Text und Dateien verschwinden für alle, und an ihrer Stelle
  steht „Nachricht gelöscht“.
- Reaktionen setzen ein Emoji unter die Nachricht. Der Chat zeichnet seine Emoji
  mit Twemoji, damit sie auf jedem System gleich aussehen.
- **Bearbeitungsverlauf** zeigt den früheren Text einer geänderten oder
  gelöschten Nachricht, für Konten mit **Audit anzeigen**.

Änderungen und Löschungen stehen auch im Audit-Protokoll. Links erscheinen so,
wie sie sind, und öffnen sich in einem neuen Tab; der Chat zeigt keine Vorschau
dazu. Unter deiner neuesten Nachricht sagt **Gesehen**, dass die andere Seite
sie gelesen hat.

### Textbausteine {#canned-replies}

Der Knopf **Textbausteine** neben dem Nachrichtenfeld fügt den Text eines
gespeicherten Bausteins ein. **Textbausteine verwalten** am Ende seiner Liste
legt sie an, ändert und löscht sie. Ein Baustein gehört dir allein, oder er gilt
für alle, die chatten. Das braucht **Textbausteine verwalten**.

## Nachrichten finden {#finding-messages}

Das Suchfeld über der Liste findet Namen und Nachrichten. In **Support** heißt
es **Computer oder Nachricht finden**, in **Team** **Kollegen oder Nachricht
finden**. Ab zwei Zeichen listet es unter **Nachrichten** die Nachrichten mit
dem Text, aus den Unterhaltungen, die du in diesem Bereich lesen kannst: bis zu
50, die neuesten zuerst. In **Team** finden Admins auch alte Nachrichten. Klick
auf eine Nachricht, um ihre Unterhaltung an dieser Stelle zu öffnen.

## Der Chat-Bereich und Benachrichtigungen {#the-panel-and-notifications}

Der Chat-Knopf in der oberen Leiste öffnet den Chat als Bereich über der Seite,
auf der du bist, und **Chat-Seite öffnen** bringt dieselbe Stelle auf die
Chat-Seite. Der Knopf zeigt, wie viele Nachrichten du noch nicht gelesen hast,
ebenso **Chat** in der Seitenleiste, die Reiter **Support** und **Team** und der
Titel des Browser-Tabs.

Das Menü oben rechts auf der Chat-Seite und im Chat-Bereich,
**Chat-Benachrichtigungen**, hat drei Schalter für dein Konto:

- **Browser-Benachrichtigungen**: von Anfang an ein. Der Browser fragt beim
  ersten Mal nach der Erlaubnis. Du bekommst eine Benachrichtigung für eine neue
  Nachricht, außer du schaust gerade auf ihre Unterhaltung.
- **Ton**: von Anfang an aus. Ein kurzer Ton für eine neue Nachricht, nach
  derselben Regel.
- **Mail, wenn eine Person wartet**: von Anfang an ein; siehe unten.

## Mail, wenn jemand wartet {#mail-when-someone-waits}

Wartet eine Person an einem Computer 15 Minuten auf eine Antwort, schickt die
Konsole eine Mail. Sie geht an den, der sich um die Unterhaltung kümmert.
Kümmert sich niemand, geht sie an alle mit **Unterhaltungen zuweisen**, die den
Computer sehen können. Nur Konten mit einer E-Mail-Adresse und eingeschaltetem
**Mail, wenn eine Person wartet** bekommen sie. Die Mail nennt den Computer,
zitiert die ersten 80 Zeichen der wartenden Nachricht und hat einen Knopf, der
die Unterhaltung öffnet. Sie nutzt den Namen, das Logo und die Akzentfarbe
deines Servers, und jede Person bekommt sie in der Sprache ihres Kontos. Pro
Wartezeit gibt es eine Mail; eine Antwort aus der Konsole beendet das Warten.

Die Konsole schickt sie über den Mailserver unter **Einstellungen**,
**E-Mail**.

## Chat-Einstellungen für diesen Server {#chat-settings-for-this-server}

Konten mit **Server konfigurieren** finden **Chat-Einstellungen für diesen
Server** im Menü oben rechts auf der Chat-Seite. Die Suche in der oberen Leiste
findet sie auch, zum Beispiel mit „chat mit computern“.

| Einstellung | Standard | Was sie tut |
|---|---|---|
| **Mail senden, wenn eine Person so viele Minuten auf Antwort wartet** | 15 | 0 schickt keine Mail. Höchstens 10080 (eine Woche). |
| **Den Anfang der wartenden Nachricht in der Mail zitieren** | Ein | Aus lässt das Zitat in der Mail weg. |
| **Chat mit Computern** | Ein | Aus: Computer können den Chat nicht öffnen, und die Konsole erreicht die Personen daran nicht per Chat. |

Schaltest du **Chat mit Computern** aus, lehnt der Server den Chat jedes
Computers ab und schließt die Chats, die offen sind. Die NeoDesk-App zeigt dann
keinen Chat. Der Chat zwischen Kollegen funktioniert weiter, und **Support**
sagt, dass der Chat mit Computern aus ist. Jede Änderung dieser Einstellungen
steht im Audit-Protokoll.
