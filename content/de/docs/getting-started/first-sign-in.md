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
- Windows: [der Kasten, den das Skript ausgegeben hat](/docs/getting-started/windows#admin-credentials)

Die Konsole öffnet sich auf **Übersicht**. Standardmäßig endet eine Sitzung
nach 30 Minuten ohne Aktivität und spätestens 24 Stunden nach der Anmeldung.
Die Konsole warnt dich eine Minute, bevor sie dich wegen Inaktivität abmeldet.
Ein Konto hat immer nur eine Sitzung: Meldest du dich in einem anderen Browser
an, endet die erste Sitzung. [Konfiguration](/docs/operations/configuration)
erklärt, wie du diese Grenzen änderst.

Auf einer neuen Installation beginnt die Übersicht mit
**Diesen Server einrichten**, einer Checkliste der ersten Schritte, die sich
selbst abhakt. Diese Seite beschreibt die ersten drei Schritte genauer;
[Die Einrichtungsanleitung](/docs/getting-started/first-sign-in/setup-guide)
erklärt alle acht.

## Das Admin-Passwort ändern {#change-the-admin-password}

1. Öffne **Einstellungen**, dann **Anmeldung**. Das Kontomenü unten in der
   Seitenleiste führt mit **Passwort ändern** direkt an dieselbe Stelle.
2. Fülle unter **Passwort** die Felder **Aktuelles Passwort**,
   **Neues Passwort** und **Neues Passwort wiederholen** aus. Das neue Passwort
   braucht mindestens 8 Zeichen.
3. Wähle **Passwort ändern**.

Nutze das neue Passwort bei der nächsten Anmeldung. Unter Docker gibt der
Befehl für die Zugangsdaten danach nicht mehr das erste Passwort aus: Der
Server löscht es, und der Befehl meldet das und sagt, wie du ein neues
Passwort setzt.

![Die Anmeldeeinstellungen mit den Abschnitten Passwort und Zwei-Faktor-Anmeldung](shot:settings-auth)

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
**Client-Einrichtung**. Die Konsole ermittelt die Adresse des Servers selbst,
zum Beispiel aus der Adresse, über die du die Konsole geöffnet hast. Das ist
falsch, wenn Clients den Server unter einem anderen Namen erreichen: wenn du
die Konsole als `localhost` geöffnet hast oder wenn ein Reverse Proxy oder ein
Router dazwischen steht.

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
alte Adresse, bis du sie neu einrichtest. Solange eines dieser Felder einen
Wert hat, ist das Feld **Client-Serveradresse** auf **Übersicht** gesperrt.

## Sich in der Konsole zurechtfinden {#find-your-way-around}

Die Seitenleiste hat fünf Abschnitte. Jeder zeigt die meistgenutzten Seiten,
der Rest liegt unter **Mehr** im jeweiligen Abschnitt. So sieht es der Admin;
andere Konten sehen die Seiten, die ihre Rolle erlaubt, siehe
[Benutzer und Rollen](/docs/people/users-and-roles).

| Abschnitt | Zuerst gezeigte Seiten | Unter Mehr |
|-----------|------------------------|------------|
| Geräte | Übersicht, Alle Geräte, Registrierungsanfragen, Fernzugriff im Browser | Agent koppeln, Inventar, Netzwerküberwachung, Flottenaufgaben, Plattform-Unterstützung, IoT-Geräte (CDAP) |
| Support | Hilfeanfragen, Tickets, Chat, Netzwerk-Tools | |
| Personen | Benutzer | Organisationen, Rollen und Berechtigungen |
| Aktivität | Sicherheit und Protokoll, Berichte | App-Nutzung, Abrechenbare Sitzungen |
| Einstellungen | Allgemein, Client-Einrichtung, Serverstatus | Die übrigen Einstellungen, gruppiert als Konsole, Clients und Registrierung, Regeln, Server, Abrechnung und Entwicklerwerkzeuge |

Um zu einer Seite, einem Gerät oder einer Person zu springen, drück Strg+K oder
`/` und tipp einen Teil des Namens. **Schnellhilfe** in der oberen Leiste
erzeugt einen Link für eine einzelne Support-Sitzung, siehe
[Schnellhilfe](/docs/console/quick-support).

## Nächste Schritte {#next-steps}

- [Computer hinzufügen](/docs/console/add-a-computer) mit dem NeoDesk-Client
  oder [einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client)
- [Die Übersicht](/docs/console/overview) und
  [die Geräteliste](/docs/console/devices)
- [Registrierungsanfragen](/docs/console/enrollment), wenn neue Geräte auf
  eine Genehmigung warten sollen
- [Benutzer und Rollen](/docs/people/users-and-roles), um anderen Leuten
  eigene Konten zu geben
