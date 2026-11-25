---
title: Fernwartung für IT-Dienstleister
description: Dein eigener Server für die Fernwartung deiner Kunden: eine Organisation pro Kunde, Schnellhilfe-Links, Zugriff ohne Anwender und abrechenbare Sitzungen.
order: 1
og: use-case
---

Du betreust die Computer mehrerer Kunden, etwa einer Praxis, eines Büros und
eines Ladens. Mit NeoDesk gehört der Server für die Fernwartung dir: Er läuft
auf einer Maschine deiner Wahl, die Computer deiner Kunden verbinden sich mit
ihm, und du und deine Techniker arbeiten in seiner Web-Konsole. Diese Seite
geht die Arbeit durch, von der Einrichtung des Servers bis zur Abrechnung
einer Sitzung, mit einem Link in die Doku für jeden Schritt.

## Den Server einmal einrichten {#set-up-the-server-once}

Installiere NeoDesk mit [Docker](/docs/getting-started/docker), unter
[Linux](/docs/getting-started/linux) oder unter [Windows](/docs/getting-started/windows),
auf einer Maschine, die die Computer deiner Kunden über das Internet
erreichen. Sie verbinden sich über 21115 bis 21117 und 21121 per TCP und über
21116 per UDP; siehe [Ports](/docs/operations/ports). Stell die Konsole hinter
[einen Reverse Proxy mit TLS](/docs/operations/reverse-proxy-tls), denn die
Links, die du Kunden schickst, nutzen ihre Adresse.

Dann [meldest du dich zum ersten Mal an](/docs/getting-started/first-sign-in),
änderst das Admin-Passwort und trägst die Adresse ein, die die Clients nutzen.

## Eine Organisation pro Kunde {#one-organization-per-customer}

Lege unter **Personen**, **Organisationen** für jeden Kunden eine Organisation
an. Im Tab **Geräte** ordnest du die Computer des Kunden zu, und im Tab
**Benutzer** fügst du die Leute hinzu, die mit ihnen arbeiten: die Konten
deiner Techniker oder eine Client-Anmeldung für jemanden beim Kunden, der den
NeoDesk-Client nutzt.

![Die Seite Organisationen mit drei Organisationen und der Zahl ihrer Benutzer und Geräte](shot:organizations)

Über das gemeinsame Adressbuch der Organisation bekommen ihre Mitglieder die
Computer des Kunden in den RustDesk-Client. Mit **Passwort setzen** an einem
Kontakt verbinden sie sich, ohne das Passwort des Computers einzutippen. Siehe
[Organisationen](/docs/people/organizations).

Eine Organisation fasst einen Kunden zusammen. Was deine Techniker in der
Konsole sehen, schränkt sie nicht ein; dafür gibt es
[Techniker nur für bestimmte Kunden](#give-technicians-only-some-customers).

## Die Computer eines Kunden aufnehmen {#bring-a-customers-computers-in}

Öffne **Geräte**, wähle **Computer hinzufügen**, wähle den Ordner des Kunden
und schick den Einladungslink. Die Person am Computer installiert über den Link
den NeoDesk-Client, und der Computer erscheint in diesem Ordner, schon
genehmigt. Für ein ganzes Büro stellst du **Kann benutzt werden** auf
**25-mal** und lässt den Namen leer.

![Die Einladung mit Link, Code und QR-Code](shot:add-computer)

Computer, die beim normalen RustDesk-Client bleiben, bekommen die vier Werte
aus **Client-Einrichtung** auf der Seite **Übersicht**, als eine
Konfigurationszeichenkette oder über das Windows-Installationsskript für
Intune. Siehe
[Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers).

## Sofort helfen {#help-someone-right-now}

Ein Kunde ruft von einem Laptop an, der nicht eingerichtet ist. Klicke in der
oberen Leiste auf **Schnellhilfe**. Die Konsole erstellt einen Link, der
einmal für eine Stunde gilt. Kopiere ihn, zeig den QR-Code oder schick ihn per
E-Mail, wenn E-Mail eingerichtet ist.

![Der Dialog Schnellhilfe mit Sitzungslink und QR-Code, der auf die Person wartet](shot:quick-support)

Der Kunde öffnet den Link, lädt NeoDesk Schnellhilfe herunter, prüft, dass
dort dein Name steht, und klickt auf **Erlauben**. **Verbinden** öffnet seinen
Bildschirm in deinem Browser, ohne ID und ohne Passwort. Schließt er die App,
endet die Sitzung. Installiert wird nichts. Siehe
[Schnellhilfe](/docs/console/quick-support).

## Einen Computer erreichen, wenn niemand davor sitzt {#reach-a-computer-when-nobody-is-there}

Für einen Server oder den Empfangs-PC, den du nachts erreichen willst, setzt
du in RustDesk auf diesem Computer ein permanentes Passwort, von Hand oder mit
dem Windows-Installationsskript. Hinterlege dasselbe Passwort am Kontakt des
Computers im gemeinsamen Adressbuch des Kunden, dann verbinden sich deine
Techniker, ohne es einzutippen. Ob eine Verbindung das Passwort braucht oder
jemand sie annehmen muss, entscheidet der Computer; einen Zeitplan für den
Zugriff pro Gerät hat die Konsole nicht. Siehe
[Unbeaufsichtigter Zugriff](/docs/console/unattended-access).

Wake-on-LAN geht vom Server aus und erreicht deshalb nur Computer im Netz des
Servers, nicht die beim Kunden vor Ort.

## Techniker nur für bestimmte Kunden {#give-technicians-only-some-customers}

Gib jedem Techniker die Rolle **Remote-Operator**: Er verbindet sich,
bearbeitet Gerätedetails und erstellt Gastlinks, ändert aber keine Benutzer
und keine Servereinstellungen. Dann legst du fest, welche Geräte er sieht:

1. Leg die Computer jedes Kunden in einen eigenen Ordner.
2. Gib dem Techniker diesen Ordner unter **Gerätezugriff**, oder nimm mehrere
   Techniker in eine Benutzergruppe und lass die Gruppe im Ordner zu.
3. Setze unter **Einstellungen**, **Allgemein** die
   **Standard-Sichtbarkeit von Geräten** auf **Eingeschränkt**, damit jeder nur
   die Geräte sieht, die ihm zugewiesen sind.

[Benutzer und Rollen](/docs/people/users-and-roles#example-an-operator-for-some-devices)
zeigt das vollständige Beispiel.

## Jemand anderen kurz hereinlassen {#let-someone-else-in-for-a-while}

Muss der Softwarehersteller eines Kunden auf einen Rechner schauen, erstellst
du am Gerät einen **Gastzugriff-Link**. Er funktioniert ohne Konto in der
Konsole, für 15 Minuten bis 24 Stunden und nur für die Geräte auf dem Link.
Halte die Zeit kurz: Die Konsole kann einen Gastlink nicht vorzeitig beenden,
und an einem RustDesk-Gerät hat der Gast volle Kontrolle. Siehe
[Gastzugriff-Links](/docs/console/device-details#guest-access-links).

## Den Überblick behalten und abrechnen {#keep-track-and-bill-the-work}

Das **Audit-Protokoll** unter **Aktivität**, **Sicherheit und Protokoll**
hält fest, wer sich angemeldet, etwas genehmigt, gesperrt oder geändert hat,
mit Zeit und Adresse. **Abrechenbare Sitzungen** listet die Remote-Sitzungen,
die auf das Supportpaket eines Kunden zählen, mit einem Filter pro
Organisation, und, wenn du Arbeitsberichte verlangst, die Sitzungen, die noch
auf einen warten. Siehe [Aktivität und Audit-Protokoll](/docs/console/activity).

## Bevor du anfängst {#before-you-start}

- Schnellhilfe und **Computer hinzufügen** geben den NeoDesk-Client aus. Dein
  Server holt die signierten Client-Releases von GitHub und braucht dafür
  Zugriff; siehe [Datenschutz](/docs/project/privacy).
- Sitzungen im Browser laufen immer über das Relay und damit über die
  Bandbreite deines Servers.
- Eine NeoDesk-App fürs Handy gibt es nicht. Auf Handys nimmst du die
  RustDesk-App.
- NeoDesk ist kostenlos und Open Source unter der AGPL-3.0, auch für die
  gewerbliche Nutzung. Hilfe gibt es kostenlos auf dem
  [NeoDesk-Discord](https://discord.gg/nwERSawufr); bezahlten Support und Hilfe
  bei der Einrichtung gibt es auf Anfrage über
  [support@neode.sk](mailto:support@neode.sk). Siehe
  [Preis und Support](/docs/project/license#price-and-support).
