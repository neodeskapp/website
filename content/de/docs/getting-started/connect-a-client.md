---
title: Einen RustDesk-Client verbinden
description: Trage deinen Server mit den vier Werten von der Seite Übersicht in einen RustDesk-Client ein.
order: 6
---

Ein RustDesk-Client verbindet sich mit deinem Server, sobald er vier Werte
kennt: den ID-Server, den Relay-Server, den API-Server und den Schlüssel des
Servers. Die Konsole zeigt alle vier auf der Seite **Übersicht**. Diese Seite
erklärt, wo die Werte im Client hingehören und was passiert, wenn der Client
verbunden ist.

Beim NeoDesk-Client musst du nichts davon eintippen: Ein Einladungslink aus
**Computer hinzufügen** installiert ihn und verbindet den Computer mit deinem
Server, siehe [Computer hinzufügen](/docs/console/add-a-computer).

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

**Einstellungen**, dann **Client-Einrichtung** zeigt dieselben Werte auf einer
eigenen Seite. Dazu kommen die **Konfigurationszeichenfolge**, die alle vier in
einer Zeile enthält, der QR-Code für Handys unter **Handy einrichten** und der
Schlüssel als Datei `id_ed25519.pub` unter **Downloads**.

## Die Werte im Client eintragen {#enter-the-values-in-the-client}

Öffne im RustDesk-Client die Netzwerkeinstellungen und dort den Abschnitt
**ID/Relay-Server**. Kopiere jeden Wert mit seiner Schaltfläche **Kopieren**
und füge ihn in das gleichnamige Feld ein: ID-Server, Relay-Server, API-Server
und Schlüssel.

Im normalen RustDesk-Client kann **API-Server** leer bleiben oder
`http://desk.example.com:21121` sein; beides funktioniert. Bleibt das Feld
leer, schickt der Client seine API-Aufrufe über den ID-Server, und der
beantwortet sie. Ein NeoDesk-Client, den du von Hand einrichtest und bei dem
**API-Server** leer bleibt, nutzt Port 21121 auf dem Host des ID-Servers, hier
also `http://desk.example.com:21121`. Trage das Feld ein, wenn die API unter
einer anderen Adresse liegt, etwa der eines Reverse Proxys.

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
Einrichtung von Hand, und das Gerät durchläuft trotzdem die Registrierung wie
jedes andere.

**Kopplungscodes** unter **Mehr** im Abschnitt **Einstellungen** der
Seitenleiste listet die Codes, die noch aktiv sind, und lässt dich einen davon
widerrufen. Die Schaltfläche **Mit Code koppeln** erscheint nur bei Konten, die
neue Geräte genehmigen dürfen.

## Aus dem Paket-Repository installieren {#install-from-the-package-repository}

::: note
Das Repository enthält noch keine Pakete. Die Suite `testing` bekommt den
nächsten Release Candidate des Clients, `stable` das erste Release, das die
neue Paketversion trägt. Bis dahin richten die Schritte unten das Repository
ein, aber der letzte Schritt findet kein Paket `neodesk`. Installiere den Client
bis dahin mit einer Einladung aus
[Computer hinzufügen](/docs/console/add-a-computer).
:::

Den NeoDesk-Client für Linux gibt es auch aus einem signierten
Paket-Repository unter pkg.neode.sk, für amd64 (x86_64) und arm64 (aarch64).
Dein System aktualisiert NeoDesk dann mit seinen normalen Updates. Der
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

Die Links der Konsole, die ein Gerät in einer App öffnen, nutzen `rustdesk://`:
**Über Desktop-Client verbinden** in der Geräteliste, **In der RustDesk-App
öffnen** auf Handys und **In der Desktop-App öffnen** in der
[Schnellhilfe](/docs/console/quick-support). Sie starten das normale RustDesk.
Auf einem Computer, der nur den NeoDesk-Client hat, starten sie ihn unter
Windows und unter Linux und macOS nichts.

Diese Links öffnen die Sitzung auf deiner Seite. Die Schnellhilfe braucht
NeoDesk nur auf dem Computer, dem du hilfst: Dort startet die Person die NeoDesk
Schnellhilfe, und du verbindest dich im Browser oder in deiner Desktop-App.

## Wenn der Client verbunden ist {#after-the-client-connects}

Was dann passiert, hängt vom Registrierungsmodus des Servers ab:

- **Offen**: Das Gerät wird sofort aufgenommen und erscheint unter **Geräte**,
  dann **Alle Geräte**.
- **Verwaltet**: Das Gerät wartet unter **Geräte**, dann
  **Registrierungsanfragen**. Es kann sich nicht verbinden, bis jemand
  **Genehmigen** wählt und ihm einen Namen gibt.
- **Gesperrt**: Nur Geräte mit einem Gerätetoken werden aufgenommen, alle
  anderen abgewiesen. Der normale RustDesk-Client kann keinen Gerätetoken
  senden, deshalb kann ein neuer RustDesk-Client in diesem Modus nicht
  beitreten.

Eine neue Installation startet im Modus **Verwaltet**, mit Docker, unter Linux
und unter Windows. Ein Computer, der mit einer Einladung aus
**Computer hinzufügen** beitritt, überspringt das Warten in jedem Modus: Er
wird gleich genehmigt aufgenommen.
[Registrierungsanfragen](/docs/console/enrollment) erklärt die Modi und wie du
sie änderst. Mehr zur Geräteliste steht unter
[Die Geräteliste](/docs/console/devices).

## Im Client anmelden {#sign-in-from-the-client}

Wer ein Konto auf dem Server hat, kann sich im RustDesk-Client mit Benutzername
und Passwort dieses Kontos anmelden. Der Client holt dann das zugehörige
Adressbuch vom Server. Mitglieder einer Organisation bekommen auch die Kontakte, die sie
teilt, siehe
[Das gemeinsame Adressbuch](/docs/people/organizations#the-shared-address-book).
Nutzt das Konto die Zwei-Faktor-Anmeldung, fragt der Client auch nach dem Code.

Wie lange der Client angemeldet bleibt, legst du unter **Einstellungen**,
**Anmeldung**, **RustDesk-Clientsitzungen** fest, siehe
[Sitzungen und fehlgeschlagene Anmeldungen](/docs/people/users-and-roles#sessions-and-failed-sign-ins).
Konten mit Single Sign-on melden sich im Client über ihren Anbieter an, siehe
[Single Sign-on mit OIDC](/docs/people/oidc).

## Der Client verbindet sich nicht {#it-does-not-connect}

Geh diese Punkte der Reihe nach durch:

- **Ports.** Das Netzwerk des Clients muss den Server auf 21116 über TCP und
  UDP, auf 21117 über TCP und auf dem Port aus dem Wert für den API-Server
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
- **API-Server.** Leer, oder er beginnt mit `http://` oder `https://` und
  endet mit dem Port, den **Übersicht** zeigt, also 21121. Der eigene Port der
  Konsole, 5000, ist der falsche.
- **Eine öffentliche Adresse.** Erreichen mehrere Computer in einem Büro den
  Server über dieselbe öffentliche Adresse, kann eine Sitzung, die einer von
  ihnen startet, mit „ID does not exist“ fehlschlagen (im deutschen Client
  „Diese ID existiert nicht.“). Siehe
  [Fehlersuche](/docs/operations/troubleshooting#clients-show-not-ready-or-cannot-connect).
- **Genehmigung.** Schau im Modus **Verwaltet** unter
  **Registrierungsanfragen** nach. Das Gerät kann sich nicht verbinden, bis
  jemand es genehmigt.

[Fehlersuche](/docs/operations/troubleshooting) hilft weiter.
