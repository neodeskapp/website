---
title: Eine kostenlose Web-Konsole für deine RustDesk-Clients
description: NeoDesk gibt normalen RustDesk-Clients eine kostenlose Web-Konsole auf deinem Server: Geräteliste, Konten, Adressbuch, LDAP oder OIDC und Audit-Protokoll.
order: 4
og: use-case
seoTitle: Kostenlose RustDesk-Web-Konsole auf deinem Server - NeoDesk
---

Du nutzt RustDesk und willst eine Web-Konsole dafür: eine Liste deiner Geräte,
Konten für die Leute, die helfen, und einen Nachweis, wer sich wohin verbunden
hat. Der kostenlose Server von RustDesk, hbbs und hbbr, hat keine Konsole, und
die Konsole von RustDesk gehört zu Server Pro, das kostet. NeoDesk ist ein
Server für den normalen RustDesk-Client, in den die Konsole eingebaut ist, und
er ist kostenlos und Open Source unter der AGPL-3.0. Es gibt keinen bezahlten
Tarif und keine Grenze für Benutzer oder Geräte.

## Was die Konsole für RustDesk-Clients tut {#what-the-console-does-for-rustdesk-clients}

Das funktioniert mit dem normalen RustDesk-Client, ohne dass sonst etwas
installiert sein muss:

- **Die Geräteliste.** Jeder Client, der sich registriert, erscheint mit ID,
  Hostname, Plattform, zuletzt gesehen und Status. Durchsuche sie und sortiere
  Geräte in Ordner, Gruppen und Tags. Mehr unter [Die Geräteliste](/docs/console/devices).
- **Verbinden im Browser.** Öffne ein Gerät und starte eine Remote-Sitzung in
  der Konsole, ohne App auf deiner Seite. Mehr unter
  [Remote Desktop im Browser](/docs/console/remote-in-browser).
- **Konten im Client.** Die Leute melden sich im RustDesk-Client mit ihrem
  Konto der Konsole an und bekommen ihr Adressbuch, persönlich oder geteilt pro
  Organisation. Mehr unter [Organisationen](/docs/people/organizations).
- **Die Anmeldung, die deine Firma schon hat.** [LDAP und Active Directory](/docs/people/ldap),
  [OIDC](/docs/people/oidc) und [Zwei-Faktor-Anmeldung](/docs/people/two-factor),
  mit [Rollen und Berechtigungen](/docs/people/users-and-roles) für jede Person.
- **Freigabe vor dem Zugriff.** Im Modus „Verwaltet“ wartet ein neuer Client
  unter [Beitrittsanfragen](/docs/console/enrollment), bis ihn jemand genehmigt.
- **Ein Audit-Protokoll.** Was Leute in der Konsole tun, und die Verbindungs-
  und Dateiübertragungsprotokolle, die die Clients schicken. Mehr unter
  [Aktivität und Audit-Protokoll](/docs/console/activity).

Telemetrie, Hardware-Inventar, Branding des Clients, „Computer hinzufügen“,
„Schnellhilfe“ und „Mit Code koppeln“ brauchen den NeoDesk-Client. Die Seite
[Kompatibilität mit RustDesk](/docs/development/rustdesk-compatibility#what-needs-neodesks-client)
nennt, was ihn braucht und warum.

## Einrichten {#set-it-up}

1. Installiere NeoDesk. Auf einem Linux-Server mit Docker ist das ein Befehl:

   ```sh
   curl -fsSL https://neode.sk/install.sh | sudo bash
   ```

   Am Ende zeigt er die Adresse der Konsole und das Admin-Passwort. Mehr unter
   [Installation mit Docker](/docs/getting-started/docker), oder ohne Docker
   [unter Linux](/docs/getting-started/linux) und [unter Windows](/docs/getting-started/windows).
2. Öffne die Konsole und melde dich an. Mehr unter [Die erste Anmeldung](/docs/getting-started/first-sign-in).
3. Kopiere ID-Server, Relay-Server, API-Server und Schlüssel aus
   **Client-Einrichtung** auf der [Übersicht](/docs/console/overview) der
   Konsole in die Netzwerkeinstellungen jedes RustDesk-Clients, oder scanne
   **QR anzeigen** mit einem Handy. Mehr unter
   [Einen RustDesk-Client verbinden](/docs/getting-started/connect-a-client).

## Wenn hbbs und hbbr schon laufen {#already-running-hbbs-and-hbbr}

NeoDesk ersetzt den kostenlosen Server von RustDesk. Gib ihm das Schlüsselpaar
und die Adresse des alten Servers, dann verbinden sich die Clients wie vorher,
jetzt mit der Konsole. Mehr unter [Umzug von einem RustDesk-Server](/docs/getting-started/migrate-from-rustdesk).

## Neben RustDesk Server Pro {#next-to-rustdesk-server-pro}

Server Pro ist der bezahlte Server von RustDesk mit eigener Konsole. NeoDesk
hat keine Lizenzgebühr und keine Lizenzprüfung, und Pro kann Dinge, die NeoDesk
nicht kann, etwa mehrere Relay-Server und einen Generator für eigene Clients.
[NeoDesk und RustDesk Server Pro im Vergleich](/docs/compare/rustdesk-server-pro)
stellt die Fakten mit Quellen nebeneinander.

NeoDesk ist nicht mit RustDesk oder Purslane Tech verbunden und wird nicht von
ihnen unterstützt; mehr unter [Lizenz](/docs/project/license#trademark).
