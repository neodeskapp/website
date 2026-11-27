---
title: Die erste Anmeldung
description: Melde dich als admin an, sichere das Konto, lege die Adresse für die Clients fest und finde dich in der Konsole zurecht.
order: 5
---

Melde dich nach der Installation als `admin` an der Web-Konsole an. Diese
Seite beschreibt, was du dort zuerst erledigst: das Passwort ändern, die
Zwei-Faktor-Anmeldung einschalten und die Adresse prüfen, die RustDesk-Clients
bekommen.

## Die Konsole öffnen {#open-the-console}

Die Adresse hängt davon ab, wie du NeoDesk installiert hast:

| Installation | Adresse der Konsole |
|--------------|---------------------|
| Docker | `http://<server-address>:3375` |
| Linux-Skript | `https://<server-address>:5443`. `http://<server-address>:3375` leitet dorthin weiter. |
| Windows-Skript | `https://<server-address>:5443`, in der Zeile **Web console**, die das Skript ausgegeben hat. `http://<server-address>:3375` leitet dorthin weiter. |

Installationen unter Linux und Windows, die mit 3.6.0-rc.4 oder älter gemacht
wurden, behalten Port 5000 statt 3375.

Unter Linux und Windows behält der einfache Port die eigenen Adressen des
Servers: Aus deinem eigenen Netzwerk führt `http://<lan-address>:3375` zu
`https://<lan-address>:5443`, und auf dem Server selbst führt
`http://localhost:3375` zu `https://localhost:5443`. Das selbstsignierte
Zertifikat gilt für beide. Jeder andere Name führt auf Port 5443 unter der
Adresse, die der Installer gespeichert hat, meist die öffentliche IP-Adresse
des Servers.

Die Skripte für Linux und Windows nutzen für HTTPS ein selbstsigniertes
Zertifikat, deshalb warnt der Browser beim ersten Mal. Bei einer neuen
Installation ist das zu erwarten. Ein Reverse Proxy mit einem echten
Zertifikat beseitigt die Warnung, siehe
[Reverse Proxy und TLS](/docs/operations/reverse-proxy-tls).

## Anmelden {#sign-in}

![Die Anmeldeseite mit den Feldern Benutzername und Passwort](shot:login)

Gib unter **Benutzername** `admin` ein, unter **Passwort** das Passwort aus der
Installation, und wähle **Anmelden**. Das Passwort findest du dort, wo die
Installation es hinterlegt hat:

- Docker: [der Befehl für die Zugangsdaten](/docs/getting-started/docker#get-the-admin-password)
- Linux: [der Kasten, den das Skript ausgegeben hat](/docs/getting-started/linux#admin-credentials)
- Windows: [die Zusammenfassung, die das Skript ausgegeben hat](/docs/getting-started/windows#admin-credentials)

Die Installation zeigt das Passwort nur einmal. Hast du es verloren, setze ein
neues, wie es [Admin-Passwort vergessen](/docs/operations/troubleshooting#forgot-the-admin-password)
beschreibt.

Die Konsole öffnet sich auf **Übersicht**. Standardmäßig endet eine Sitzung
nach 30 Minuten ohne Aktivität und spätestens 24 Stunden nach der Anmeldung.
Die Konsole warnt dich eine Minute, bevor sie dich wegen Inaktivität abmeldet.
Ein Konto kann in bis zu 10 Browsern gleichzeitig angemeldet sein;
**Angemeldete Geräte** im Kontomenü listet sie auf.
[Dein Konto](/docs/people/your-account) erklärt die Liste und die Einstellung
**Eine Sitzung pro Konto**, und [Konfiguration](/docs/operations/configuration)
erklärt, wie du die Grenzen änderst.

Auf einer neuen Installation beginnt die Übersicht mit
**Diesen Server einrichten**, einer Checkliste der ersten Schritte, die sich
selbst abhakt. Diese Seite beschreibt die ersten drei Schritte genauer;
[Die Einrichtungsanleitung](/docs/getting-started/first-sign-in/setup-guide)
erklärt alle acht.

## Das Admin-Passwort ändern {#change-the-admin-password}

1. Öffne das Kontomenü, deine Initialen ganz rechts in der oberen Leiste, und
   wähle **Dein Konto**.
2. Fülle unter **Passwort** die Felder **Aktuelles Passwort**,
   **Neues Passwort** und **Neues Passwort wiederholen** aus. Das neue Passwort
   braucht mindestens 8 Zeichen.
3. Wähle **Passwort ändern**.

Nutze das neue Passwort bei der nächsten Anmeldung. Unter Docker gibt der
Befehl für die Zugangsdaten danach nicht mehr das erste Passwort aus: Der
Server löscht es, und der Befehl meldet das und sagt, wie du ein neues
Passwort setzt.

## Die Zwei-Faktor-Anmeldung einschalten {#turn-on-two-factor-sign-in}

Mit der Zwei-Faktor-Anmeldung fragt die Konsole nach dem Passwort einen
6-stelligen Code ab. Der Code kommt aus einer Authenticator-App auf deinem
Handy, etwa Google Authenticator, Microsoft Authenticator oder Authy.

1. Wähle auf derselben Seite unter **Zwei-Faktor-Anmeldung** die Schaltfläche
   **Zwei-Faktor-Anmeldung einrichten**.
2. Scanne den QR-Code mit der App. Kannst du ihn nicht scannen, tippe
   stattdessen den Wert unter **Manueller Schlüssel** in die App.
3. Gib den 6-stelligen Code aus der App ein und wähle
   **Prüfen und einschalten**.
4. Die Konsole zeigt einmalig Wiederherstellungscodes. Bewahre sie an einem
   sicheren Ort auf und wähle dann **Ich habe die Codes gespeichert**. Jeder
   Wiederherstellungscode funktioniert einmal und lässt dich ohne die App
   anmelden.

Von jetzt an fragt die Anmeldeseite nach dem Passwort den Code ab. Sie bietet
auch **Stattdessen einen Wiederherstellungscode verwenden** an. Mehr dazu
unter [Zwei-Faktor-Anmeldung](/docs/people/two-factor).

## Die Adresse für die Clients festlegen {#set-the-address-clients-use}

Die Werte, die ein RustDesk-Client braucht, stehen auf **Übersicht** unter
**Client-Einrichtung**. Ohne gespeicherte Adresse ermittelt die Konsole die
Adresse des Servers selbst und nimmt das Erste davon, das einen Wert hat:

1. `PANEL_PUBLIC_HOST` in der Umgebung des Servers.
2. Die erste Adresse in `RELAY_SERVERS`. Der Docker-Installer schreibt die
   Adresse, die er ermittelt hat, dort hinein, unter Docker zeigt die Konsole
   also die Adresse, die der Installer ausgegeben hat.
3. Den Host der eigenen API-Adresse der Konsole.
4. Die Adresse, über die du die Konsole geöffnet hast.

Einen Host, den nur dieser Rechner erreicht, etwa `localhost`, `127.0.0.1` oder
einen Namen ohne Punkt, überspringt sie. Falsch ist das Ergebnis, wenn Clients
den Server unter einem anderen Namen erreichen, zum Beispiel wenn ein Reverse
Proxy, ein CDN oder ein Router dazwischen steht.

So legst du die Adresse für alle Clients fest:

1. Öffne **Einstellungen**, dann **Allgemein**.
2. Trage unter **Öffentliche Client-Endpunkte** bei
   **Öffentlicher ID-Server** den Hostnamen oder die IP-Adresse des Servers
   ein, so wie Clients im Internet ihn erreichen.
3. Lass **Öffentlicher Relay-Server** leer, um dieselbe Adresse für das Relay
   zu nutzen. Lass **Öffentliche API-URL** leer, damit sie aus der Adresse des
   ID-Servers gebaut wird, oder gib die vollständige Adresse mit `http://`
   oder `https://` ein.
4. Wähle **Änderungen speichern**, dann **Adressen speichern**.

Die Seitenspalte **Was Clients jetzt erhalten** zeigt das Ergebnis. Die neuen
Adressen gelten sofort für die Werte der Client-Einrichtung, die QR-Codes und
die Installationsbefehle. Geräte, die schon eingerichtet sind, behalten ihre
alte Adresse, bis du sie neu einrichtest. Solange **Öffentlicher ID-Server**
einen Wert hat, ist das Feld **Client-Serveradresse** auf **Übersicht**
gesperrt. **Öffentlicher Relay-Server** oder **Öffentliche API-URL** allein
sperren es nicht: Das Feld ändert dann weiter ID-Server und Relay für diesen
Tab, und die festen Werte bleiben, wie du sie gesetzt hast.

## Sich in der Konsole zurechtfinden {#find-your-way-around}

### Die Seitenleiste {#the-sidebar}

Die Seitenleiste hat sieben Abschnitte. Jeder zeigt die meistgenutzten Seiten,
der Rest liegt unter **N weitere anzeigen** am Ende des Abschnitts, wobei N
die Zahl der ausgeblendeten Seiten ist; **Weniger anzeigen** klappt sie wieder
ein. Blendet ein Abschnitt nur eine Seite aus, zeigt er sie gleich. Lange
Seitennamen brechen in eine zweite Zeile um. So sieht es ein Super-Admin;
andere Konten sehen die Seiten, die ihre Rolle erlaubt, siehe
[Benutzer und Rollen](/docs/people/users-and-roles).

| Abschnitt | Zuerst gezeigte Seiten | Unter N weitere anzeigen |
|-----------|------------------------|--------------------------|
| Geräte | Übersicht, Alle Geräte, Beitrittsanfragen, Computer hinzufügen, Fernsitzungen | Inventar, Netzwerküberwachung, Flottenaufgaben, IoT-Geräte |
| Support | Hilfeanfragen, Tickets, Chat, Netzwerk-Tools | |
| Personen | Benutzer | Organisationen, Rollen und Berechtigungen |
| Aktivität | Audit-Protokoll, Sicherheitsprüfungen, Berichte | App-Nutzung, Abrechnung |
| Regeln | Richtlinien, Warnungen und Automatisierung | USB- und Laufwerkszugriff, Schutz vor Datenabfluss, Geräteidentität |
| Server | Serverstatus, Relay-Server, Sicherungen, Updates | Konfigurationsdateien, Kapazitätstest |
| Einstellungen | Allgemein, Anmeldung | Verzeichnis (LDAP), Single Sign-on, Beitritt, Darstellung, Branding, E-Mail, Zeit, MeshCentral, Übersetzungen, und unter Entwicklerwerkzeuge der Ablauf-Editor |

**Computer hinzufügen** sammelt alle Wege, auf denen ein Computer auf den
Server kommt, als Tabs: **Einladungen und Installationslinks**,
**Gerätetokens**, **Kopplungscodes**, **Support-Agenten** und
**Manuelle Einrichtung**. Jeder Tab erscheint nur für Konten, die ihn nutzen
dürfen; **Manuelle Einrichtung** mit den Werten, die ein Client braucht,
erscheint für alle. Siehe [Computer hinzufügen](/docs/console/add-a-computer).

**Einstellungen** enthält nur die Einstellungen des Servers und der Konsole.
Dein eigenes Passwort, die Zwei-Faktor-Anmeldung, die angemeldeten Geräte und
die API-Tokens liegen auf [Dein Konto](/docs/people/your-account).

### Die obere Leiste {#the-top-bar}

Von links nach rechts:

- **Der Pfad**: der Abschnitt und die Seite, auf der du bist.
- **Das Suchfeld**, siehe [Suche](#search) unten.
- **Schnellhilfe** erzeugt einen Link für eine einzelne Support-Sitzung, siehe
  [Schnellhilfe](/docs/console/quick-support). Die Schaltfläche erscheint für
  Konten, die sich mit Geräten verbinden dürfen.
- **Chat** öffnet den Chat-Bereich über der Seite, auf der du bist, mit der
  Zahl der ungelesenen Nachrichten, siehe [Chat](/docs/console/chat). Die
  Schaltfläche erscheint für Konten mit der Berechtigung **Support-Chat beantworten** oder
  **Team-Chat nutzen**.
- **Benachrichtigungen** listet neue Hilfeanfragen und Geräte, die beitreten
  möchten.
- **Hilfe**, das Buch-Symbol, öffnet einen Bereich mit
  **Einrichtungsanleitung anzeigen** (für Konten, die die Anleitung sehen
  dürfen), **Tastenkürzel**, **Plattform-Unterstützung** und den Links
  **Dokumentation**, **Community auf Discord** und **GitHub-Repository**. Auf
  dem Handy steht Hilfe am Ende der Seitenleiste.
- **Das Kontomenü**, deine Initialen ganz rechts. Es enthält **Mein Status**
  für den Chat, **Dein Konto**, **Angemeldete Geräte**, **API-Tokens** (für
  Konten, die welche erstellen dürfen), **Design** mit
  **Standard der Konsole**, **Hell** und **Dunkel** für diesen Browser,
  **Sprache**, **Barrierefreiheit** und **Abmelden**.

Eine Schaltfläche, um eine Seite neu zu laden, gibt es nicht. Seiten, die sich
ändern, während du sie ansiehst, laden von selbst neu: das Audit-Protokoll,
die Netzwerküberwachung, die Benutzer, die Organisationen, die Gerätetokens und
die abrechenbaren Sitzungen alle 30 Sekunden, solange sie auf dem Bildschirm
sind.

Ein Rechtsklick auf das NeoDesk-Logo oben in der Seitenleiste öffnet den
[Brand Guide](https://neode.sk/brand) in einem neuen Tab. Ein eigenes Logo
behält das Menü des Browsers.

### Suche {#search}

Drück Strg+K (⌘K auf dem Mac) oder `/`, oder klick in das Suchfeld der oberen
Leiste, und tipp los. Die Suche findet:

- **Seiten**: jede Seite der Seitenleiste, auch unter anderen Wörtern und
  früheren Namen.
- **Aktionen**: **Schnellhilfe**, **Computer hinzufügen**,
  **Neues Gerätetoken**, **Benutzer hinzufügen**, **Neues API-Token**,
  **Chat-Einstellungen für diesen Server**, **Optionen für Barrierefreiheit**,
  **Zum dunklen Design wechseln** (oder zum hellen) und **Abmelden**. Jede
  erscheint nur für Konten, die ihre Schaltfläche in der Konsole sehen.
- **Einstellungen**: jede Einstellung auf den Tabs von Einstellungen, auf den
  Seiten unter Server und auf Dein Konto, mit dem Ort, an dem sie liegt. Wählst
  du eine, öffnet sich ihr Tab, die Seite scrollt zur Einstellung und hebt sie
  kurz hervor. Jedes Konto sieht nur die Einstellungen, die es öffnen darf.
- **Geräte** und **Personen**, nach Name, ID oder Benutzername.

Jedes Wort, das du tippst, muss passen; Groß- und Kleinschreibung und Akzente
spielen keine Rolle. Deutsche und englische Wörter finden dieselbe
Einstellung, egal in welcher Sprache die Konsole läuft. Hat eine Gruppe mehr
Treffer, als sie zeigt, sagt sie es, zum Beispiel „8 von 23“. Mit den
Pfeiltasten bewegst du dich, Enter öffnet, Esc schließt. Ist das Feld leer,
zeigt die Suche deine letzten Suchen in diesem Browser, mit
**Letzte Suchen löschen**.

### Was wohin umgezogen ist {#where-things-moved}

Die Seiten der Konsole sind in die Abschnitte oben einsortiert. Die alten
Adressen führen zu den neuen Seiten, Lesezeichen und Links in Mails
funktionieren also weiter.

| Vorher | Jetzt |
|--------|-------|
| Einstellungen, Sicherung | Server, Sicherungen |
| Einstellungen, Updates | Server, Updates; die Sicherungen vor Updates liegen unter Server, Sicherungen |
| Einstellungen, Erweitert | Server, Konfigurationsdateien |
| Einstellungen, Serverstatus | Server, Serverstatus |
| Einstellungen, Relay-Server | Server, Relay-Server |
| Einstellungen, Anmeldung: dein Passwort und die Zwei-Faktor-Anmeldung | Dein Konto |
| Einstellungen, Anmeldung: LDAP und OIDC | Einstellungen, Verzeichnis (LDAP) und Einstellungen, Single Sign-on |
| Einstellungen, Allgemein: Sichtbarkeit von Geräten und Verfügbarkeitsverlauf | Einstellungen, Beitritt |
| Einstellungen, Allgemein: MeshCentral-Kompatibilität | Einstellungen, MeshCentral |
| Einstellungen, Darstellung: Name, Logo, Anmeldeseite, Downloadseite und Fernzugriff im Browser | Einstellungen, Branding |
| Branding der Client-App | Einstellungen, Branding, Client-App |
| Client-Einrichtung, Gerätetokens, Kopplungscodes, Support-Agenten, NeoDesk-Agenten | Geräte, Computer hinzufügen, je ein Tab |
| Registrierungsanfragen | Geräte, Beitrittsanfragen |
| Sicherheit und Protokoll: Audit-Protokoll und Server-Ereignisse | Aktivität, Audit-Protokoll |
| Sicherheit und Protokoll: Sicherheitsprüfungen und Härtung | Aktivität, Sicherheitsprüfungen |
| Sicherheit und Protokoll: Ihre Sitzungen | Dein Konto, Angemeldete Geräte |
| API-Tokens | Dein Konto, API-Tokens |
| Kommerzialisierung und Abrechenbare Sitzungen | Aktivität, Abrechnung |
| Richtlinien, Warnungen und Automatisierung, USB- und Laufwerkszugriff, Schutz vor Datenabfluss, Geräteidentität | Regeln |
| Plattform-Unterstützung | Hilfe in der oberen Leiste |
| Die Schaltflächen für Design, Sprache und Barrierefreiheit in der oberen Leiste | Das Kontomenü |
| Fernzugriff im Browser, in einem eigenen Tab | Geräte, Fernsitzungen, in der Konsole |

## Nächste Schritte {#next-steps}

- [Computer hinzufügen](/docs/console/add-a-computer) mit dem NeoDesk-Client
  oder [einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client)
- [Die Übersicht](/docs/console/overview) und
  [die Geräteliste](/docs/console/devices)
- [Beitrittsanfragen](/docs/console/enrollment), wenn neue Geräte auf
  eine Genehmigung warten sollen
- [Benutzer und Rollen](/docs/people/users-and-roles), um anderen Leuten
  eigene Konten zu geben
