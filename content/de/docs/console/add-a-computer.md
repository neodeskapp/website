---
title: Computer hinzufügen
description: Einen Einladungslink erstellen, der NeoDesk auf einem Computer installiert und ihn mit deinem Server verbindet, genehmigt und im gewählten Ordner.
order: 3
---

Ein Einladungslink richtet den NeoDesk-Client auf einem Computer ein und
verbindet ihn mit deinem Server. Die Person am Computer öffnet den Link und
installiert den Client. Danach erscheint der Computer unter **Geräte**, schon
genehmigt, mit dem Namen und dem Ordner, die du gewählt hast. Niemand tippt eine
Serveradresse oder einen Schlüssel ein.

Du brauchst die Berechtigung **Registrierungen genehmigen**. Für einen normalen
RustDesk-Client nimmst du stattdessen die Werte aus **Client-Einrichtung**;
siehe [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).

## Eine Einladung erstellen {#make-an-invite}

Öffne **Geräte**, dann **Alle Geräte**, und klicke über der Liste auf
**Computer hinzufügen**.

![Die Geräteliste mit markierter Schaltfläche Computer hinzufügen](shot:add-computer-start)

Jedes Feld ist optional:

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

**Weiteren Computer hinzufügen** erstellt die nächste Einladung; **Fertig**
schließt den Seitenbereich.

## Was die Person sieht {#what-the-person-sees}

Der Link öffnet eine Seite, die deinen Server nennt und den Download für das
System der Person anbietet: ein Installationsprogramm für Windows, ein
Disk-Image für den Mac und einen Befehl zum Einfügen unter Linux. Die Seite
listet die Schritte für dieses System auf und zeigt auch den Code. Auf einem
Handy bittet sie darum, den Link stattdessen auf dem Computer zu öffnen.

Unter Windows sagen die Schritte, was Windows fragt, bevor sich die
Einrichtung installiert. Beim Installationsprogramm (`.exe`) nennt die Abfrage
den Windows-Befehlsprozessor von Microsoft Windows, und die Seite sagt, dass
das die Einrichtung von NeoDesk ist. Beim MSI nennt die Abfrage NeoDesk, und
die Seite bittet die Person, den genannten Herausgeber zu prüfen.

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

## Offene Einladungen {#open-invites}

**Offene Einladungen** unten im Seitenbereich listet die Einladungen, die noch
gültig sind, mit der Zahl der übrigen Nutzungen und dem Ablaufdatum. **Widerrufen**
beendet eine Einladung sofort. Eine Einladung endet von selbst, wenn ihre Zeit
abgelaufen oder ihre letzte Nutzung verbraucht ist.

Ein Computer, der über eine Einladung beitritt, ist in jedem
[Registrierungsmodus](/docs/console/enrollment#enrollment-modes) genehmigt und
bekommt seinen Gerätetoken sofort.

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
von der Einladung. Der Seitenbereich des Geräts zeigt im Tab **Übersicht** einen
Hinweis **Neuer Schlüssel** mit dem Namen des Computers, seiner Adresse, der
Uhrzeit und dem Fingerabdruck des neuen Schlüssels. Dann hast du zwei
Möglichkeiten:

- Klicke auf **Neuen Schlüssel genehmigen** und bestätige. Der neue Schlüssel
  wird zum Schlüssel des Geräts, seine alten Gerätetokens und Sitzungen enden,
  und der Computer kann mit derselben Einladung wieder beitreten. Dafür
  brauchst du die Berechtigung **Registrierungen genehmigen**.
- Oder lösche das Gerät mit **Dauerhaft löschen (ID freigeben)** (siehe
  [Gelöschte Geräte](/docs/console/devices#deleted-devices)). Der Computer tritt
  dann als neues Gerät bei. Ein Löschen ohne diese Option hält die ID
  reserviert, und der Server lehnt den Computer ab.

Ein Computer mit neuem Schlüssel, der ohne Einladung zurückkommt, etwa weil er
von Hand eingerichtet wurde, erscheint als offline, und sein Tab **Übersicht**
sagt, dass der Server seinen neuen Schlüssel nicht annimmt. Schick ihm eine
Einladung und genehmige den neuen Schlüssel, oder lösche das Gerät dauerhaft.
