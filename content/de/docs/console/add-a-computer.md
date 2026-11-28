---
title: Computer hinzufügen
description: Ein Einladungslink installiert NeoDesk auf einem Computer und verbindet ihn mit deinem Server, im gewählten Ordner. Beim Beitritt richtest du ihn ein.
order: 3
---

Ein Einladungslink richtet den NeoDesk-Client auf einem Computer ein und
verbindet ihn mit deinem Server. Die Person am Computer öffnet den Link und
installiert den Client. Danach erscheint der Computer unter **Geräte**, schon
genehmigt, mit dem Namen und dem Ordner, die du gewählt hast. Niemand tippt eine
Serveradresse oder einen Schlüssel ein. Während du wartest, bleibt die Einladung
in der Konsole offen und führt dich durch die ersten Schritte des Computers,
sobald er beitritt.

Du brauchst die Berechtigung **Beitrittsanfragen genehmigen**. Für einen normalen
RustDesk-Client nimmst du stattdessen die Werte unter **Geräte**,
**Computer hinzufügen**, **Manuelle Einrichtung**; siehe
[Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).

## Eine Einladung erstellen {#make-an-invite}

Öffne **Computer hinzufügen** an einer dieser Stellen:

- **Geräte**, dann **Alle Geräte**: die Schaltfläche **Computer hinzufügen**
  über der Liste.
- **Geräte**, dann **Computer hinzufügen**, Tab
  **Einladungen und Installationslinks**: die Schaltfläche
  **Computer hinzufügen**.
- Die Suche in der oberen Leiste (Strg+K): Tippe „Computer hinzufügen“ und wähle
  die Aktion **Computer hinzufügen**.
- Der Einrichtungsleitfaden auf der Übersicht einer neuen Installation: der
  Schritt **Ersten Computer hinzufügen**.

![Die Geräteliste mit markierter Schaltfläche Computer hinzufügen](shot:add-computer-start)

**Computer hinzufügen** sammelt alle Wege, auf denen ein Computer auf den Server
kommt, jeden als Tab für die Konten, die ihn nutzen dürfen:
**Einladungen und Installationslinks**, **Gerätetokens**, **Kopplungscodes**,
**Support-Agenten**, **Empfänger-App** und **Manuelle Einrichtung**.
**Empfänger-App** installiert die App für die Person am Computer still auf
vielen Windows-Computern; siehe [Die Empfänger-App](/docs/console/receiver-app).

Jedes Feld der Einladung ist optional:

| Feld | Was es bewirkt |
|---|---|
| Name | Der Name, den der Computer unter Geräte bekommt. Bleibt das Feld leer, gilt der eigene Name des Computers. |
| Ordner | Der Ordner, in den er kommt. **Nicht zugeordnet** legt ihn in keinen. |
| Senden an | Eine E-Mail-Adresse, die den Link bekommt. Erscheint nur, wenn E-Mail unter **Einstellungen**, **E-Mail** eingerichtet ist. |
| Gilt für | 1 Tag, 7 Tage (Standard) oder 30 Tage. |
| Kann benutzt werden | **Einmal** (Standard), **5-mal**, **25-mal** oder **Bis zum Ablauf**. Mit mehreren Nutzungen richtest du mehrere Computer mit einem Link ein; lass **Name** dann leer. |

Klicke auf **Einladung erstellen**.

## Den Link senden {#send-the-link}

![Die Einladung mit Link, Code und QR-Code](shot:add-computer)

Die Einladung zeigt:

- **Einladungslink**, mit **Kopieren**. Schicke ihn an die Person am Computer.
- **Code**, etwa `BWC8-AY6F`, für einen Computer, auf dem NeoDesk schon
  läuft: im Client unter **Einstellungen**, **Server**, **Server beitreten**.
- Einen QR-Code des Links, um ihn auf einem Handy zu öffnen und von dort
  weiterzuschicken.
- **Per E-Mail senden**, wenn E-Mail eingerichtet ist.

Der Link nutzt die öffentliche Adresse der Konsole (`PANEL_PUBLIC_URL` oder
`PANEL_PUBLIC_HOST`, siehe [Konfiguration](/docs/operations/configuration))
oder die Adresse, unter der du die Konsole geöffnet hast. Ist diese Adresse
reines HTTP, warnt die Einladung, dass der Computer nicht prüfen kann, ob er
mit deinem Server spricht. Nutze einen solchen Link nur in einem Netzwerk, dem
du vertraust, oder setze die Konsole hinter
[einen Reverse Proxy mit TLS](/docs/operations/reverse-proxy-tls).

Unter dem Link sagt der Seitenbereich, dass er wartet, etwa „Wartet noch auf
Annas Laptop. Der Link funktioniert bis …“. Lass den Seitenbereich offen, um den
Computer beim Beitritt einzurichten, oder schließe ihn mit **Fertig**.
**Weiteren Computer hinzufügen** erstellt die nächste Einladung.

## Die Willkommensmail {#the-welcome-mail}

Mit **Senden an** oder **Per E-Mail senden** verschickt der Server den Link per
Mail. Die Mail sagt, wer die Person zu welchem Server eingeladen hat, etwa „Sam
hat dich zu Acme IT eingeladen“, und enthält:

- Oben das Logo des Servers, in der Akzentfarbe des Servers. Das Logo erscheint,
  wenn unter **Einstellungen**, **Branding** ein Bild-Logo als PNG, JPEG oder
  GIF eingestellt ist und die Mail es über HTTPS laden kann. Sonst zeigt die
  Mail den Namen des Servers.
- Eine Schaltfläche, **NeoDesk einrichten**, in der Akzentfarbe.
- Drei Schritte: NeoDesk herunterladen und öffnen, auf Installieren klicken,
  fertig.
- Den ausgeschriebenen Link für den Fall, dass die Schaltfläche nicht geht, bis
  wann er gilt, und den Code für ein NeoDesk, das schon installiert ist.

Die Mail hat einen reinen Textteil mit demselben Inhalt, und der Link ist das
Einzige darin, das etwas öffnet. Sie ist in der Sprache geschrieben, in der die
Konsole der Person erscheint, die sie verschickt.

## Was die Person sieht {#what-the-person-sees}

Der Link öffnet eine Seite, die sagt, wer die Person eingeladen hat, und den
Download für ihr System anbietet: ein Installationsprogramm für Windows, ein
Disk-Image für den Mac und einen Befehl zum Einfügen unter Linux. Unter Windows
und auf dem Mac zeigt die Seite die drei Schritte der Mail über dem Download.
**Andere Systeme** listet die Downloads für die anderen Systeme. Die Seite zeigt
auch den Code mit der Serveradresse. Auf einem Handy bittet sie darum, den Link
stattdessen auf dem Computer zu öffnen. Die Seite funktioniert auch ohne
JavaScript: Der Browser bekommt dann die Schritte, den Download für sein
System, die anderen Systeme und den Code.

Unter Windows sagt die Seite, was Windows fragt, bevor sich die Einrichtung
installiert. Beim Installationsprogramm (`.exe`) nennt die Abfrage den
Windows-Befehlsprozessor von Microsoft Windows, und die Seite sagt, dass das die
Einrichtung von NeoDesk ist. Beim MSI nennt die Abfrage NeoDesk, und die Seite
bittet die Person, den genannten Herausgeber zu prüfen. Auf dem Mac ergänzt die
Seite die Schritte für den Mac: NeoDesk in Programme ziehen, öffnen,
zurückkommen und **NeoDesk öffnen** klicken, und Bildschirmaufnahme und
Bedienungshilfen erlauben.

Die Downloads sind die offiziellen Releases des NeoDesk-Clients. Dein Server
holt sie von GitHub, prüft ihre Signatur und liefert sie selbst aus. Hat er
noch kein Release, sagt die Seite, dass es gerade keinen Download gibt.

Unter Linux installiert der Befehl das Paket des Clients mit der Paketverwaltung
des Systems (apt-get, dnf, zypper oder yum) und lässt den Computer dann deinem
Server beitreten. Der NeoDesk-Client installiert sich neben einem normalen
RustDesk und lässt es, wo es ist: Er läuft als eigener Dienst,
`neodesk.service`, und sein Programm ist `/usr/bin/neodesk`. Der Befehl
installiert den Build, den dein Server anbietet, auch dann, wenn die
Paketverwaltung das als Downgrade sieht, etwa nach einem Release Candidate, und
installiert ihn erneut, wenn dieselbe Version schon da ist.

Ist der Computer nach der Installation nicht aufgetaucht, lass die Person in
NeoDesk **Einstellungen**, **Server**, **Server beitreten** öffnen und den Code
eingeben.

## Den Computer beim Beitritt einrichten {#set-up-the-computer-as-it-joins}

Solange der Seitenbereich der Einladung offen ist, prüft er alle paar Sekunden,
ob ein Computer beigetreten ist. Tritt einer bei, wird daraus „Annas Laptop ist
beigetreten“ mit vier kurzen Schritten:

1. **Name**: der Name, den er unter Geräte und im Viewer zeigt.
2. **Ordner**: Wer den Computer sehen und erreichen kann, richtet sich nach
   seinem Ordner.
3. **So erreichst du ihn**: die zwei Wege, sich zu verbinden. Ohne Passwort
   sieht die Person am Computer, wer sich verbinden möchte, und klickt auf
   Annehmen. Mit seinem Passwort legt jemand am Computer in NeoDesk unter
   Einstellungen, Sicherheit ein dauerhaftes Passwort fest, und du gibst es
   beim Verbinden ein.
4. **Testsitzung**: **Testsitzung starten** öffnet eine Sitzung zum Computer,
   und NeoDesk dort bittet die Person, sie anzunehmen. Solange der Computer
   offline ist, sagt der Schritt das und bietet keine Schaltfläche.

**Weiter** speichert den Schritt, **Zurück** geht einen Schritt zurück, und
**Überspringen** lässt den Computer, wie er beigetreten ist. Name und Ordner zu
ändern braucht die Berechtigung **Geräte bearbeiten**; ohne sie zeigt der
Seitenbereich beides an und sagt, dass deine Rolle es nicht ändern kann. Eine
Einladung für mehrere Computer behält ihren Link nach dem ersten im
Seitenbereich und führt durch jeden Computer, der beitritt.

## Offene Einladungen {#open-invites}

**Offene Einladungen** unten im Seitenbereich listet die Einladungen, die noch
gültig sind, mit der Zahl der übrigen Nutzungen und dem Ablaufdatum. **Widerrufen**
beendet eine Einladung sofort. Eine Einladung endet von selbst, wenn ihre Zeit
abgelaufen oder ihre letzte Nutzung verbraucht ist.

Ein Computer, der über eine Einladung beitritt, ist in jedem
[Beitrittsmodus](/docs/console/enrollment#enrollment-modes) genehmigt und
bekommt seinen Gerätetoken sofort.

Auf der Kommandozeile listet `neodesk invites list` die offenen Einladungen, und
`neodesk invites show <id>` zeigt eine Einladung mit den Computern, die mit ihr
beigetreten sind, mit Name, Ordner und Zeitpunkt des Beitritts, auch wenn die
Einladung schon verbraucht ist. Siehe
[invites](/docs/command-line/reference/invites).

## Ein Computer tritt erneut bei {#a-computer-that-joins-again}

Die ID eines Computers ist kein Geheimnis, deshalb prüft der Server, wer unter
einer ID beitritt, die er schon kennt. Ein NeoDesk-Client ab 1.5.0 weist mit
dem Schlüssel des Computers nach, dass er dieser Computer ist, und tritt wie
gewohnt erneut bei. Ein neuer Computer, den der Server noch nicht kennt, tritt
mit jeder Client-Version bei.

Ein älterer Client kann das nicht nachweisen. Öffnet er eine Einladung unter
einer ID, die der Server kennt, lehnt der Server den Beitritt ab, und der
Client zeigt:

```text
This computer's ID is already enrolled on this server. Update NeoDesk on this computer and open the invite again, or ask your administrator to delete the device in the console.
```

Aktualisiere NeoDesk auf dem Computer und öffne die Einladung erneut, oder
lösche das Gerät dauerhaft (siehe unten). Der abgelehnte Beitritt verbraucht
nichts von der Einladung. Er erscheint unter **Aktivität**,
**Audit-Protokoll** als „Beitritt abgelehnt: ohne Nachweis des
Computerschlüssels“, mit dem Gerät und der Adresse. Ein Computer, der es immer
wieder versucht, bekommt einen Eintrag pro Minute, der die Ablehnungen seit dem
letzten mitzählt.

## Ein neu installierter oder zurückgesetzter Computer {#a-reinstalled-or-reset-computer}

Nach einer Neuinstallation von NeoDesk oder einem Zurücksetzen des Computers
kann der Computer mit derselben ID und einem neuen Schlüssel zurückkommen. Der
Server kennt das Gerät mit seinem alten Schlüssel und lehnt den Beitritt ab. Der
Client zeigt die Antwort des Servers:

```text
This computer's ID is already enrolled with another key. Ask your administrator to approve the new key or to delete the device in the console.
```

Bis sein neuer Schlüssel freigegeben ist, zeigt das Gerät offline, auch nach
einem Neustart des Servers, und der Server speichert keine der
Systeminformationen, die es schickt.

Eine neue Einladung hilft nicht, und der abgelehnte Versuch verbraucht nichts
von der Einladung. Ist der Seitenbereich der Einladung noch offen, sagt er
„Dieser Computer war schon einmal hier, mit einem anderen Schlüssel.“ und bietet
**Neuen Schlüssel genehmigen** an. Der Seitenbereich des Geräts zeigt im Tab
**Übersicht** einen Hinweis **Neuer Schlüssel** mit dem Namen des Computers,
seiner Adresse, der Uhrzeit und dem Fingerabdruck des neuen Schlüssels. Dann
hast du zwei Möglichkeiten:

- Klicke auf **Neuen Schlüssel genehmigen**, im Seitenbereich der Einladung oder
  in dem des Geräts. Die Konsole fragt vorher nach: Der neue Schlüssel wird zum
  Schlüssel des Geräts, und seine alten Gerätetokens und Sitzungen enden. Klicke
  in der Frage auf **Neuen Schlüssel genehmigen**, um fortzufahren. Öffne dann
  die Einladung auf dem Computer erneut; er tritt mit derselben Einladung bei.
  Dafür brauchst du die Berechtigung **Beitrittsanfragen genehmigen**.
- Oder lösche das Gerät mit **Dauerhaft löschen (ID freigeben)** (siehe
  [Gelöschte Geräte](/docs/console/devices#deleted-devices)). Der Computer tritt
  dann als neues Gerät bei. Ein Löschen ohne diese Option hält die ID
  reserviert, und der Server lehnt den Computer ab.

Ein Computer mit neuem Schlüssel, der ohne Einladung zurückkommt, etwa weil er
von Hand eingerichtet wurde, erscheint als offline, und sein Tab **Übersicht**
sagt, dass der Server seinen neuen Schlüssel nicht annimmt. Schick ihm eine
Einladung und genehmige den neuen Schlüssel, oder lösche das Gerät dauerhaft.

Auf der Kommandozeile nennt `neodesk invites show <id>` den letzten Computer,
den die Einladung abgewiesen hat, und `neodesk invites approve-key <device-id>`
genehmigt seinen neuen Schlüssel.
