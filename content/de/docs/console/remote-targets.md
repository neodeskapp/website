---
title: RDP- und VNC-Ziele
description: Computer ohne RustDesk-Client hinzufügen, das Gateway einrichten, über das der Server sie erreicht, und was eine Sitzung kann.
order: 9
---

Ein RDP- oder VNC-Ziel ist ein Computer ohne RustDesk- oder NeoDesk-Client, etwa ein Windows-PC mit eingeschaltetem Remotedesktop oder ein Linux-Rechner mit VNC-Server. Der Server verbindet sich mit ihm, und Benutzer arbeiten darauf in einem Browser-Tab über den [Web-Viewer](/docs/console/remote-in-browser). Der Browser spricht nur mit der Konsole. Der Server baut die Verbindung zum Computer auf und setzt ein gespeichertes Passwort selbst ein, sodass dieses Passwort nie beim Browser ankommt.

## Was der Server braucht {#what-the-server-needs}

Der Server erreicht RDP- und VNC-Computer über guacd, den Daemon von Apache Guacamole. guacd ist weder Teil des Server-Binarys noch seines Docker-Images. Der Server spricht mit guacd nur über eine Loopback-Adresse, `127.0.0.1:4822`, sofern `GUACD_ADDRESS` nichts anderes angibt, und lehnt eine Adresse ab, die keine Loopback-Adresse ist.

- **Docker**: `docker-compose.quick.single.yml`, das `neodesk-docker.sh` als `docker-compose.yml` installiert, enthält guacd als optionalen Dienst. Füge `guacd` zu `COMPOSE_PROFILES` in der `.env`-Datei daneben hinzu, zum Beispiel `COMPOSE_PROFILES=guacd`, oder `COMPOSE_PROFILES=postgres,guacd` zusammen mit PostgreSQL, und erstelle die Container in diesem Ordner neu:

  ```bash
  docker compose up -d
  ```

- **Linux und Windows**: Die Installer setzen `GUACD_ADDRESS=127.0.0.1:4822`, installieren guacd aber nicht. Installiere es selbst und lass es nur auf `127.0.0.1`, Port 4822 lauschen. Der Ordner `remote-gateway` im Repository enthält eine systemd-Unit als Beispiel, die genau das tut.

Der Server verschlüsselt die Passwörter, die er speichert, mit dem Schlüssel in `REMOTE_TARGET_VAULT_KEY`. Die Installer für Linux und Windows schreiben einen Schlüssel in die env-Datei. Das Docker-Image erzeugt beim ersten Start einen und legt ihn im Daten-Volume als `/opt/rustdesk/.remote_target_vault_key` ab. Ohne den Schlüssel kann der Server die gespeicherten Passwörter nicht lesen, nimm ihn deshalb in deine [Backups](/docs/operations/backup) auf.

Das Formular für Ziele sagt, was fehlt. Solange guacd nicht antwortet, zeigt es „Verbindungen können noch nicht starten: guacd, das RDP- und VNC-Gateway dieses Servers, antwortet nicht.“ Solange der Schlüssel fehlt und **Auf diesem Server speichern** gewählt ist, sagt es, dass der Server noch keine Passwörter speichern kann.

Der Server verbindet sich nicht mit einem Ziel unter `localhost`, unter einer Loopback-, Link-Local-, Multicast- oder unspezifizierten Adresse oder unter der Cloud-Metadaten-Adresse 169.254.169.254.

## Ein Ziel hinzufügen {#add-a-target}

Klicke in [der Geräteliste](/docs/console/devices) auf **RDP/VNC-Ziel hinzufügen**. Das Formular fragt nach:

| Feld | Was du einträgst |
|---|---|
| **Anzeigename** | Wie das Ziel in der Geräteliste erscheint |
| **Technik** | **RDP** für Windows-Computer, **VNC** für die meisten Linux- und macOS-Bildschirme |
| **Host oder IP** und **Port** | Die Adresse, über die dieser Server den Computer erreicht. RDP nutzt meist 3389, VNC 5900 |
| **Betriebssystem** | Erscheint in der Geräteliste, zum Beispiel Windows 11 |
| **Benutzername** und **Passwort** | **Bei jeder Verbindung fragen**, **Auf diesem Server speichern** oder **Kein Passwort** |
| **TLS-Verschlüsselung** | **Erforderlich**, **Wenn der Computer es unterstützt** oder **Aus** |
| **Fingerabdruck des vertrauenswürdigen Zertifikats** | Ein SHA-256-Fingerabdruck. Lass das Feld leer, um das Zertifikat bei der ersten Verbindung zu bestätigen |
| **Aktiviert** | Ist es aus, bleibt das Ziel in der Liste, aber niemand kann sich damit verbinden |

**Verbindung testen** prüft, ob der Server innerhalb von fünf Sekunden eine Verbindung zu Host und Port aufbauen kann. Angemeldet wird dabei nicht. Die Antwort lautet „... ist auf Port ... erreichbar.“, „... ist auf Port ... nicht erreichbar.“ oder, bei einer der Adressen, mit denen sich der Server nicht verbindet, „Dieser Server darf sich nicht mit dieser Adresse verbinden.“

Nach **Speichern** erscheint das Ziel wie ein Gerät in der Geräteliste, und **Verbinden** öffnet es im Web-Viewer. **Bearbeiten** öffnet dasselbe Formular; lass **Gespeichertes Passwort** leer, um das gespeicherte Passwort zu behalten. **Löschen** im Zeilenmenü entfernt das Ziel nach einer Bestätigung, und danach kann sich niemand mehr damit verbinden.

## Passwörter und Zertifikate {#passwords-and-certificates}

Mit **Bei jeder Verbindung fragen** speichert der Server den Benutzernamen, und der Viewer fragt bei jeder Verbindung nach dem Passwort. Mit **Auf diesem Server speichern** wird das Passwort verschlüsselt gespeichert und bei jeder Verbindung eingesetzt, sodass der Viewer ohne Nachfrage verbindet. **Kein Passwort** sendet keines.

Steht ein Fingerabdruck in **Fingerabdruck des vertrauenswürdigen Zertifikats**, prüft der Server vor jeder Sitzung das Zertifikat des Computers und lehnt eines mit anderem Fingerabdruck ab. Lässt du das Feld leer, kann stattdessen der Viewer fragen: Scheitert die Verbindung an einem Zertifikat, dessen Fingerabdruck er erhält, zeigt er **Nicht vertrauenswürdiges Zertifikat** mit diesem Fingerabdruck. **Zertifikat vertrauen** speichert den Fingerabdruck am Ziel und verbindet erneut. Um einem Zertifikat zu vertrauen, braucht ein Konto die Berechtigung, sich mit RDP- und VNC-Zielen zu verbinden.

## Im Viewer {#in-the-viewer}

Eine RDP- oder VNC-Sitzung zeigt den Bildschirm und gibt Maus und Tastatur weiter. Text, den du auf dem Bildschirm einfügst, geht in die Zwischenablage des Computers, und Text, der auf dem Computer kopiert wird, kommt in die Zwischenablage dieses Computers, wenn der Browser es erlaubt. Es gibt keinen Ton, keine Dateiübertragung und keine Auswahl des Bildschirms, und **Text eintippen** ist nicht verfügbar. Von den Einstellungen unter **Anzeige** wirkt nur **Zwischenablage abschalten**; **Nur ansehen** funktioniert wie in anderen Sitzungen.

Die **Client-Funktionen** einer Person im [Konsolenzugriff](/docs/people/permissions#panel-access) schränken die Sitzung ein. Ohne **Fernsteuerung** kann die Person nur zusehen, und ohne **Zwischenablage** wird in keine Richtung etwas kopiert.

Welche Ziele jemand öffnen darf, folgt denselben Zugriffsregeln wie bei Geräten, siehe [Welche Geräte ein Benutzer sieht](/docs/people/users-and-roles#which-devices-a-user-sees).

## Wer was darf {#who-can-do-what}

Ziele sehen, sich mit ihnen verbinden, sie testen, sie hinzufügen und bearbeiten und sie löschen sind jeweils eigene Berechtigungen. Standardmäßig haben Konten mit den Rollen Super-Admin und Globaler Administrator alle davon. Konten mit der Rolle Remote-Operator dürfen Ziele sehen, testen und sich mit ihnen verbinden, Konten mit den Rollen Serveradministrator und Betrachter sehen Ziele nur. Siehe [Was jede Rolle darf](/docs/people/users-and-roles#what-each-role-can-do).
