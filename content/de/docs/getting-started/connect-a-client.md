---
title: Einen RustDesk-Client verbinden
description: Trage deinen Server mit den vier Werten von der Seite Übersicht in einen RustDesk-Client ein.
order: 6
seoTitle: RustDesk-Client mit deinem NeoDesk-Server verbinden
---

Ein RustDesk-Client verbindet sich mit deinem Server, sobald er vier Werte
kennt: den ID-Server, den Relay-Server, den API-Server und den Schlüssel des
Servers. Die Konsole zeigt alle vier auf der Seite **Übersicht**. Diese Seite
erklärt, wo die Werte im Client hingehören und was passiert, wenn der Client
verbunden ist.

Beim NeoDesk-Client musst du nichts davon eintippen: Ein Einladungslink aus
**Computer hinzufügen** installiert ihn und verbindet den Computer mit deinem
Server, siehe [Computer hinzufügen](/docs/console/add-a-computer). Ohne
Einladung nimmst du die Datei für dein System von der
[Download-Seite](/de/download/).

Der NeoDesk-Client hat keinen eingebauten ID-Server. Bis eine Einladung, ein
Kopplungscode oder seine Einstellungen ihm deinen Server nennen, verbindet er
sich mit keinem Server, und er weicht nie auf einen öffentlichen aus. Ein
normaler RustDesk-Client ohne eingetragenen ID-Server nutzt dagegen den
öffentlichen Server von RustDesk.

## Den RustDesk-Client installieren {#install-the-rustdesk-client}

NeoDesk funktioniert mit dem normalen RustDesk-Client. Du bekommst ihn auf der
Release-Seite von RustDesk auf GitHub; **Übersicht** verlinkt sie unter
**RustDesk herunterladen**. Es gibt Versionen für Computer und für Handys.

## Die vier Werte holen {#get-the-four-values}

Öffne in der Konsole **Geräte**, dann **Übersicht**. Die Seitenspalte
**Client-Einrichtung** enthält die Werte:

| Wert | Was es ist |
|------|------------|
| ID-Server | Der Hostname oder die IP-Adresse, bei der sich die Clients registrieren |
| Relay-Server | Die Adresse des Relay-Servers mit Port, meist 21117 |
| API-Server | Die vollständige Adresse der API, mit `http://` oder `https://` und dem Port 21121 |
| Schlüssel | Der öffentliche Schlüssel des Servers. **Anzeigen** blendet ihn ein. |

![Die Seite Übersicht mit der markierten Spalte Client-Einrichtung](shot:client-setup)

Über den Werten zeigt **Client-Serveradresse** die Adresse, für die sie gebaut
sind. Prüfe, ob deine Geräte diese Adresse erreichen. Steht dort `localhost`,
warnt dich die Konsole, denn kein anderer Computer und kein Handy erreicht
diese Adresse.

Um die Werte für eine andere Adresse zu sehen, gib sie in
**Client-Serveradresse** ein und wähle **Werte anzeigen**. Das ändert nur, was
du in diesem Browser-Tab siehst. Die Adresse für alle Clients legst du in den
Einstellungen unter **Öffentliche Client-Endpunkte** fest, siehe
[Die Adresse für die Clients festlegen](/docs/getting-started/first-sign-in#set-the-address-clients-use).

**Geräte**, **Computer hinzufügen**, Tab **Manuelle Einrichtung** zeigt
dieselben Werte auf einer eigenen Seite; **Serverschlüssel und QR-Code** auf
**Übersicht** öffnet sie. Dazu kommen die **Konfigurationszeichenfolge**, die alle vier in
einer Zeile enthält (dieselbe Zeichenfolge, die **Deploy-String kopieren** auf
**Übersicht** kopiert), der QR-Code für Handys unter **Handy einrichten** und der
Schlüssel als Datei `id_ed25519.pub` unter **Downloads**.

## Die Werte im Client eintragen {#enter-the-values-in-the-client}

Öffne im RustDesk-Client **Einstellungen**, dann **Netzwerk**. Zeigt er
**Netzwerkeinstellungen entsperren**, wähle das zuerst. Öffne dann
**ID/Relay-Server**. Kopiere jeden Wert mit seiner Schaltfläche **Kopieren**
und füge ihn in das gleichnamige Feld ein: ID-Server, Relay-Server, API-Server
und Schlüssel.

Trage im normalen RustDesk-Client **API-Server** ein, hier
`http://desk.example.com:21121`. Bleibt das Feld leer, schickt der Client
seine API-Aufrufe an Port 21114 auf dem Host des ID-Servers, wo NeoDesk sie
nicht beantwortet. Das Gerät verbindet sich trotzdem, aber die Konsole bekommt
nie seinen Namen, sein Betriebssystem oder seine Version, und die Anmeldung im
Client und sein Adressbuch funktionieren nicht. Ein NeoDesk-Client, den du von
Hand einrichtest und bei dem **API-Server** leer bleibt, nutzt Port 21121 auf
dem Host des ID-Servers, hier also `http://desk.example.com:21121`. Trage das
Feld auch dort ein, wenn die API unter einer anderen Adresse liegt, etwa der
eines Reverse Proxys.

**Alles kopieren** kopiert die vier Werte auf einmal, einen pro Zeile, damit du
sie jemandem schicken kannst, der den Client einrichtet:

```text
ID-Server: desk.example.com
Relay-Server: desk.example.com:21117
API-Server: http://desk.example.com:21121
Schlüssel: <the server's public key>
```

### Handys und Tablets {#phones-and-tablets}

**QR anzeigen** zeigt die Konfiguration als QR-Code. Scanne ihn mit der
RustDesk-App, dann trägt sie die Servereinstellungen ein.

Auf Handys und Tablets mit RustDesk 1.4.9 oder neuer muss die App zuerst
Servereinstellungen aus Links erlauben, über ihre Einstellung
`allow-deep-link-server-settings`. Ist das nicht der Fall, öffne **Mehr** neben
**QR anzeigen**, wähle **Deploy-String kopieren** und importiere diesen String
in der App unter Netzwerk, Serverkonfiguration importieren.

### Viele Computer {#many-computers}

Für viele Computer kann eine Einladung aus **Computer hinzufügen** mehrmals
gelten. Dem normalen RustDesk-Client kann ein Skript oder ein Werkzeug wie
Intune die Konfigurationszeichenfolge übergeben, die du über **Mehr**, dann
**Deploy-String kopieren** bekommst. Unter Windows kann es stattdessen das
Skript aus **Mehr**, dann **Windows-Installationsskript (Intune)** ausführen.
[Viele Computer auf einmal einrichten](/docs/getting-started/connect-a-client/many-computers)
erklärt beides.

## Mit Code koppeln {#pair-with-code}

**Mit Code koppeln** ist für die eigenen Client-Apps von NeoDesk gedacht. Der
normale RustDesk-Client hat kein Feld für einen Code, nutze für ihn also die
vier Werte von oben.

1. Wähle **Mit Code koppeln**. **Serveradresse** ist mit der Client-Adresse aus
   **Übersicht** ausgefüllt: ein Domainname oder eine IP-Adresse, ohne Port.
2. Gib dem Code bei Bedarf eine **Bezeichnung**, etwa den Namen des Laptops.
3. Wähle **Code erstellen**.

Die Konsole zeigt einen Code aus sechs Zeichen. Er wird nur einmal angezeigt,
funktioniert einmal und gilt 10 Minuten. Gib auf dem Gerät die Serveradresse
und den Code ein. Der Client bekommt dann dieselben Werte wie bei der
Einrichtung von Hand, und für das Gerät gilt der Beitrittsmodus wie für jedes
andere.

**Geräte**, **Computer hinzufügen**, Tab **Kopplungscodes** listet die Codes,
die noch aktiv sind, und lässt dich einen davon
widerrufen. Die Schaltfläche **Mit Code koppeln** erscheint nur bei Konten, die
neue Geräte genehmigen dürfen.

## Aus dem Paket-Repository installieren {#install-from-the-package-repository}

::: note
Im Moment hat nur die Suite `testing` Pakete: die Release Candidates, zurzeit
1.5.0-rc.7. Die Suite `stable` bleibt leer, bis es vom Client ein fertiges
Release gibt. Die Schritte unten nutzen `stable` und finden deshalb auf keinem
der drei Systeme ein Paket `neodesk`. Bis dahin installierst du aus `testing`:
Unter Debian und Ubuntu schreibst du in Schritt 3 `testing` statt `stable`,
unter Fedora und openSUSE nimmst du die Befehle unter
[Release Candidates](#release-candidates). Oder du installierst den Client mit
einer Einladung aus [Computer hinzufügen](/docs/console/add-a-computer).
:::

Den NeoDesk-Client für Linux gibt es auch aus einem signierten
Paket-Repository unter pkg.neode.sk, für amd64 (x86_64) und arm64 (aarch64).
Dein System aktualisiert NeoDesk dann mit seinen normalen Updates. Dieselben
Pakete gibt es als Dateien auf der [Download-Seite](/de/download/). Der
Schlüssel des Repositorys hat den Fingerabdruck
`D9D7 D06A FB85 0424 31C6 08AB 79E8 A31B 2625 AA7B` und gilt bis zum
22. November 2029.

Nach der Installation lässt du den Computer mit dem Code einer Einladung deinem
Server beitreten: in NeoDesk unter **Einstellungen**, **Server**, **Server
beitreten**.

### Debian und Ubuntu {#debian-and-ubuntu}

1. Installiere curl:

   ```bash
   sudo apt install curl
   ```

2. Leg den Ordner für den Schlüssel an und lade den Schlüssel hinein:

   ```bash
   sudo install -d -m 0755 /etc/apt/keyrings
   ```

   ```bash
   sudo curl -fsSLo /etc/apt/keyrings/neodesk.gpg https://pkg.neode.sk/neodesk.gpg
   ```

3. Füg das Repository hinzu:

   ```bash
   echo "deb [signed-by=/etc/apt/keyrings/neodesk.gpg] https://pkg.neode.sk/deb stable main" | sudo tee /etc/apt/sources.list.d/neodesk.list
   ```

4. Lies die Paketlisten neu ein und installiere dann NeoDesk:

   ```bash
   sudo apt update
   ```

   ```bash
   sudo apt install neodesk
   ```

Der Schlüssel gilt nur für dieses Repository (`signed-by`), nicht für deine
anderen Paketquellen.

### Fedora, RHEL, Rocky Linux und AlmaLinux {#fedora-rhel-rocky-linux-and-almalinux}

Füg das Repository hinzu:

```bash
sudo curl -fsSLo /etc/yum.repos.d/neodesk.repo https://pkg.neode.sk/rpm/neodesk.repo
```

Installiere dann NeoDesk:

```bash
sudo dnf install neodesk
```

dnf fragt einmal, ob es den NeoDesk-Schlüssel importieren soll. Vergleiche den
Fingerabdruck oben, bevor du mit Ja antwortest.

### openSUSE und SLES {#opensuse-and-sles}

Füg das Repository hinzu, lies es ein und installiere dann NeoDesk:

```bash
sudo zypper addrepo https://pkg.neode.sk/suse/neodesk.repo
```

```bash
sudo zypper refresh
```

```bash
sudo zypper install neodesk
```

zypper fragt, ob es dem NeoDesk-Schlüssel vertrauen soll. Vergleiche den
Fingerabdruck oben und wähle dann, ihm immer zu vertrauen.

### Release Candidates {#release-candidates}

Die Suite `testing` enthält Release Candidates und Releases. Du bekommst, was
neuer ist.

Unter Debian und Ubuntu schreibst du in der `echo`-Zeile oben `testing` statt
`stable`.

Unter Fedora und Verwandten installierst du einmal daraus:

```bash
sudo dnf --enablerepo=neodesk-testing install neodesk
```

Damit es eingeschaltet bleibt, setz in `/etc/yum.repos.d/neodesk.repo` unter
`[neodesk-testing]` `enabled=1`.

Unter openSUSE schaltest du es ein:

```bash
sudo zypper modifyrepo --enable neodesk-testing
```

### Entfernen {#remove}

Unter Debian und Ubuntu entfernst du NeoDesk, dann das Repository und seinen
Schlüssel:

```bash
sudo apt remove neodesk
```

```bash
sudo rm /etc/apt/sources.list.d/neodesk.list /etc/apt/keyrings/neodesk.gpg
```

Unter Fedora und Verwandten:

```bash
sudo dnf remove neodesk
```

```bash
sudo rm /etc/yum.repos.d/neodesk.repo
```

Unter openSUSE:

```bash
sudo zypper remove neodesk
```

```bash
sudo zypper removerepo neodesk neodesk-testing
```

## Links, die die App öffnen {#links-that-open-the-app}

Ein Link kann auf dem Computer, auf dem jemand ihn anklickt, eine Client-App
starten:

- `neodesk://`-Links öffnen den NeoDesk-Client. Er übernimmt dieses Schema
  unter Windows, macOS und Linux.
- `rustdesk://`-Links gehören dem normalen RustDesk. Unter Windows übernimmt
  der NeoDesk-Client sie nur auf einem Computer ohne normales RustDesk, wenn
  kein anderes Programm sie hat, und gibt sie zurück, wenn er entfernt wird.
  Unter Linux und macOS übernimmt er sie nie.

Die Konsole öffnet ein Gerät im NeoDesk-Client mit einem `neodesk://`-Link:
**In NeoDesk öffnen** in der Geräteliste, die Aktion **NeoDesk-App** auf der
Seite des Geräts und **NeoDesk** unter **In der Desktop-App öffnen** in der
[Schnellhilfe](/docs/console/quick-support). **In RustDesk öffnen** und die
anderen RustDesk-Auswahlen daneben nutzen `rustdesk://` für das normale
RustDesk. Für Handys gibt es keine NeoDesk-App, dort bietet die Konsole die
RustDesk-App an.

Diese Links öffnen die Sitzung auf deiner Seite. Die Schnellhilfe braucht
NeoDesk nur auf dem Computer, dem du hilfst: Dort startet die Person die NeoDesk
Schnellhilfe, und du verbindest dich im Browser oder in deiner Desktop-App.

## Wenn der Client verbunden ist {#after-the-client-connects}

Was dann passiert, hängt vom Beitrittsmodus des Servers ab:

- **Offen**: Das Gerät wird sofort aufgenommen und erscheint unter **Geräte**,
  dann **Alle Geräte**.
- **Verwaltet**: Das Gerät wartet unter **Geräte**, dann
  **Beitrittsanfragen**. Es kann sich nicht verbinden, bis jemand
  **Genehmigen** wählt und ihm einen Namen gibt. Der normale RustDesk-Client
  zeigt währenddessen **Bereit** und schickt vor der Genehmigung keinen Namen.
  Vergleiche also die ID in der Anfrage mit der im RustDesk-Fenster.
- **Gesperrt**: Nur Geräte mit einem Gerätetoken werden aufgenommen, alle
  anderen abgewiesen. Der normale RustDesk-Client kann keinen Gerätetoken
  senden, deshalb kann ein neuer RustDesk-Client in diesem Modus nicht
  beitreten.

Eine neue Installation startet im Modus **Verwaltet**, mit Docker, unter Linux
und unter Windows. Ein Computer, der mit einer Einladung aus
**Computer hinzufügen** beitritt, überspringt das Warten in jedem Modus: Er
wird gleich genehmigt aufgenommen.
[Beitrittsanfragen](/docs/console/enrollment) erklärt die Modi und wie du
sie änderst. Mehr zur Geräteliste steht unter
[Die Geräteliste](/docs/console/devices).

## Im Client anmelden {#sign-in-from-the-client}

Wer ein Konto auf dem Server hat, kann sich im Client anmelden. Der Client holt
dann das zugehörige Adressbuch vom Server. Mitglieder einer Organisation
bekommen auch die Kontakte, die sie teilt, siehe
[Das gemeinsame Adressbuch](/docs/people/organizations#the-shared-address-book).

### Über den Browser anmelden {#sign-in-through-the-browser}

Der Anmeldedialog des NeoDesk-Clients beginnt mit **Mit NeoDesk anmelden**.
Der normale RustDesk-Client zeigt dieselbe Möglichkeit als NeoDesk unter dem
Passwortformular.

1. Klicke auf **Mit NeoDesk anmelden**. Der Client öffnet die Webkonsole im
   Browser des Computers und zeigt „Warte darauf, dass du die Anmeldung im
   Browser erlaubst“.
2. Ist der Browser nicht bei der Konsole angemeldet, meldest du dich dort
   zuerst an, wie sonst auch: mit Passwort, Zwei-Faktor-Code oder
   [Single Sign-on](/docs/people/oidc). Die Konsole kehrt danach zur Anfrage
   zurück.
3. Die Seite **Bei der NeoDesk-App anmelden** zeigt den Computer, der fragt:
   Name, System, NeoDesk-ID, IP-Adresse und wann er gefragt hat. Prüfe, dass es
   der Computer vor dir ist, und klicke auf **Erlauben**.
4. Die Seite sagt „Die App ist angemeldet“, und der Client ist mit deinem Konto
   angemeldet. Den Tab kannst du schließen.

Klicke nur dann auf **Erlauben**, wenn du die Anmeldung gerade selbst
gestartet hast. Wer dir so einen Link schickt, will seinen eigenen Computer an
deinem Konto anmelden; klicke dann auf **Ablehnen**. **Ablehnen** beendet die
Anfrage, und der Client meldet, dass die Anmeldung im Browser abgelehnt wurde.

Eine Anfrage gilt fünf Minuten und lässt sich einmal beantworten. Danach sagt
die Seite „Diese Anmeldung ist beendet“, und der Client bittet dich, neu zu
beginnen. Ist das Konto deaktiviert oder muss es erst die
Zwei-Faktor-Anmeldung einrichten oder ein neues Passwort wählen, sagt die
Seite das, und der Client wird nicht angemeldet.

Der Link im Browser führt zur Adresse der Konsole: **Konsolenadresse** unter
**Einstellungen**, **Single Sign-on**, wenn sie gesetzt ist, sonst
`PANEL_PUBLIC_URL` oder `PUBLIC_URL` (siehe
[Konfiguration](/docs/operations/configuration)). Fehlt all das, nimmt der
Server den Hostnamen, unter dem der Client ihn erreicht hat, mit dem Port der
Konsole. Hinter einem Reverse Proxy setzt du `PANEL_PUBLIC_URL` auf die
öffentliche Adresse; das Installationsskript tut das, wenn es den Proxy
einrichtet. Findet der Server gar keine Adresse, zeigt der Client „The web
console's address is not set.“

Erlaubte und abgelehnte Anfragen stehen im Audit-Log der Konsole, die
Anmeldung des Clients mit der Methode `console_device_login`.

### Mit Passwort anmelden {#sign-in-with-a-password}

Der Anmeldedialog des Clients nimmt auch Benutzername und Passwort des Kontos.
Nutzt das Konto die Zwei-Faktor-Anmeldung, fragt der Client auch nach dem
Code. Konten mit Single Sign-on können sich nicht mit Passwort anmelden; sie
nutzen den Browser oder die Schaltfläche des Anbieters, wenn
[Single Sign-on](/docs/people/oidc#single-sign-on-in-the-client) eingeschaltet
ist.

Wie lange der Client angemeldet bleibt, legst du unter **Einstellungen**,
**Anmeldung**, **RustDesk-Clientsitzungen** fest, siehe
[Sitzungen und fehlgeschlagene Anmeldungen](/docs/people/users-and-roles#sessions-and-failed-sign-ins).

## Der Client verbindet sich nicht {#it-does-not-connect}

Geh diese Punkte der Reihe nach durch:

- **Ports.** Das Netzwerk des Clients muss den Server auf 21116 über TCP und
  UDP, auf 21115 und 21117 über TCP und auf dem Port aus dem Wert für den API-Server
  erreichen. Die Installation öffnet sie auf dem Server, wo sie kann. Ein
  Router oder eine Cloud-Firewall vor dem Server muss sie aber ebenfalls
  durchlassen. Siehe [Ports und Firewall](/docs/operations/ports).
- **Adresse.** ID- und Relay-Server müssen eine Adresse sein, die das Gerät von
  seinem Standort aus erreicht. Eine LAN-Adresse funktioniert nur innerhalb
  dieses Netzwerks. Prüfe bei Docker die Zeile `Relay IP:` im Log des
  Containers, siehe [Die Relay-Adresse](/docs/getting-started/docker#the-relay-address).
- **Schlüssel.** Füge den Schlüssel noch einmal mit **Kopieren** ein. Wurde das
  Schlüsselpaar des Servers gelöscht, hat der Server ein neues erzeugt, und
  jeder Client braucht den neuen Schlüssel.
- **API-Server.** Er beginnt mit `http://` oder `https://` und endet mit dem
  Port, den **Übersicht** zeigt, also 21121. Der eigene Port der Konsole, 3375
  (5000 bei älteren Installationen), ist der falsche, und 21114 auch. Verbindet
  sich das Gerät, zeigt in der Konsole aber keinen Namen und kein
  Betriebssystem, ist das Feld meist leer.
- **Eine öffentliche Adresse.** Erreichen mehrere Computer in einem Büro den
  Server über dieselbe öffentliche Adresse, kann eine Sitzung, die einer von
  ihnen startet, mit „ID does not exist“ fehlschlagen (im deutschen Client
  „Diese ID existiert nicht.“). Siehe
  [Fehlersuche](/docs/operations/troubleshooting#clients-show-not-ready-or-cannot-connect).
- **Genehmigung.** Schau im Modus **Verwaltet** unter
  **Beitrittsanfragen** nach. Das Gerät kann sich nicht verbinden, bis
  jemand es genehmigt, auch wenn der RustDesk-Client **Bereit** zeigt.

[Fehlersuche](/docs/operations/troubleshooting) hilft weiter.
