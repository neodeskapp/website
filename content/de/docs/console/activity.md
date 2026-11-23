---
title: Aktivität und Audit-Protokoll
description: Das Audit-Protokoll, die Ereignisse des Servers, die Sicherheitsprüfungen, Berichte und App-Nutzung, und wer sie sehen darf.
order: 8
---

Die Gruppe **Aktivität** in der Seitenleiste enthält, was die Konsole und der Server aufgezeichnet haben: wer was getan hat, was der Server selbst protokolliert hat, Berichte, die du erstellen und aufbewahren kannst, und welche Apps auf Geräten genutzt werden. **Sicherheit und Protokoll** und **Berichte** stehen oben; **App-Nutzung** und **Abrechenbare Sitzungen** liegen meist unter **Mehr**.

## Wer es sehen darf {#who-can-see-it}

**Sicherheit und Protokoll**, **Berichte** und **App-Nutzung** brauchen die Berechtigung, das Audit-Protokoll anzusehen. Standardmäßig hat jede Rolle der Konsole sie: Super-Admin, Serveradministrator, Globaler Administrator, Remote-Operator und Betrachter. **Abrechenbare Sitzungen** braucht die Berechtigung, die Abrechnung anzusehen, die Konten mit den Rollen Super-Admin, Globaler Administrator und Remote-Operator standardmäßig haben. Ein Administrator kann beides ändern und einem Konto ganze Bereiche ausblenden; siehe [Benutzer und Rollen](/docs/people/users-and-roles).

## Sicherheit und Protokoll {#security-and-audit}

Die Seite hat fünf Tabs: **Audit-Protokoll**, **Server-Ereignisse**, **Sicherheitsprüfungen**, **Härtung** und **Ihre Sitzungen**. Jeder Tab lädt, wenn du ihn zum ersten Mal öffnest, und die Schaltfläche zum Aktualisieren in der oberen Leiste lädt den offenen Tab neu.

![Das Audit-Protokoll mit Anmeldungen und Änderungen an Gerätegruppen](shot:security-audit)

### Audit-Protokoll {#audit-log}

Jede Aktion, die Personen in dieser Konsole ausgeführt haben: Anmeldungen, Sperren, Genehmigungen und Änderungen an Geräten, Personen und Einstellungen.

| Spalte | Zeigt |
|---|---|
| **Wann** | Datum und Uhrzeit, auf die Sekunde genau |
| **Wer** | Das Konto, das die Aktion ausgeführt hat |
| **Aktion** | Was getan wurde, zum Beispiel „Angemeldet“ oder „Gerätegruppen geändert“ |
| **Gerät** | Die ID des Geräts, wenn es bei der Aktion um ein Gerät ging |
| **Details** | Mehr zur Aktion. Lange Details werden nach zwei Zeilen abgeschnitten; **Alles anzeigen** zeigt sie ganz |
| **IP-Adresse** | Die Adresse, von der die Anfrage kam |

Tippe in **Nach Person, Aktion, Gerät oder Details suchen**, um Einträge zu finden, oder grenze die Liste mit **Anzeigen** ein:

- **Alle Aktionen**
- **Sperren und Entsperren**
- **Anmeldungen und Sitzungen**
- **Fehlgeschlagene Anmeldungen**
- **Geräte und Registrierung**
- **Personen und Rollen**
- **Einstellungen und Server**

Der Tab lädt die neuesten 2.000 Einträge und zeigt 50 pro Seite. Suche und Filter landen in der Adressleiste, sodass du eine gefilterte Ansicht teilen oder als Lesezeichen speichern kannst. **Aktualisieren** lädt die Einträge neu.

Die Konsole ersetzt Passwörter, Secrets, Tokens und Schlüssel in den Details durch drei Sternchen, bevor sie die Einträge speichert. Einträge, die älter als 90 Tage sind, löscht sie.

### Server-Ereignisse {#server-events}

Ereignisse, die der Server selbst aufzeichnet, 25 pro Seite. **Anzeigen** grenzt sie auf eine Art ein: **Fehlgeschlagene Anmeldungen**, **Anmeldungen**, **Gerät gesperrt**, **Gerät entsperrt**, **Adresse blockiert**, **Gerät freigegeben**, **Konfiguration geändert** oder **API-Schlüssel erstellt**. Die Spalten sind **Wann**, **Aktion**, **Auslöser**, **Ziel** und **Details**.

**Auslöser** nennt, wer gehandelt hat: bei einer Aktion in der Konsole das Konto, sonst das Konto oder den API-Schlüssel, mit dem der Server aufgerufen wurde, sonst die Adresse, von der die Anfrage kam, etwa bei einer Anmeldung oder einem Gerät.

Der Server speichert diese Ereignisse in seiner Datenbank und löscht sie nach 90 Tagen, sie bleiben also über Neustarts erhalten. Über der Tabelle zeigt ein Diagramm die Ereignisse pro Tag für die letzten 14 Tage, sobald die Ereignisse so weit zurückreichen; bis dahin sagt ein Satz, welchen Zeitraum sie abdecken.

### Sicherheitsprüfungen {#security-checks}

Eine Liste von Prüfungen, jeweils **Bestanden** oder **Nicht bestanden**, und bei einer nicht bestandenen Prüfung, was zu tun ist:

| Prüfung | Bestanden, wenn |
|---|---|
| **Server-API nutzt TLS** | Die API des Servers verschlüsselt ist |
| **Kein API-Schlüssel ist älter als 90 Tage** | Jeder API-Schlüssel jünger als 90 Tage ist |
| **Weniger als 10 fehlgeschlagene Anmeldungen in 24 Stunden** | Der Server weniger als 10 gezählt hat |
| **Sperrliste des Servers ist leer** | Die Sperrliste des Servers keine Einträge hat |
| **Audit-Protokoll des Servers ist lesbar** | Die Konsole die Ereignisse des Servers lesen konnte |
| **Sperrliste des Servers ist lesbar** | Die Konsole die Sperrliste lesen konnte |

Unter den Prüfungen stehen die Zahlen, auf denen sie beruhen, und ob jede Serververbindung verschlüsselt ist. **Unbekannt** heißt, dass der Server es nicht meldet.

### Härtung {#hardening}

Die Härtungseinstellungen, mit denen dieser Server läuft, aus seiner Konfiguration gelesen, jeweils mit **An** oder **Aus**, Schweregrad und Bereich. Es gibt zwei:

- **Panel Idle and Absolute Session Timeout** ist immer an. Der Eintrag sagt, nach wie vielen Minuten ohne Anfrage und wie viele Minuten nach der Anmeldung eine Sitzung in der Konsole endet (`SESSION_IDLE_TIMEOUT`, `SESSION_MAX_AGE`).
- **Concurrent Panel Session Limit per Account** ist an, solange `SESSION_MAX_PER_USER` größer als 0 ist, und nennt das aktuelle Limit. Eine neue Anmeldung beendet dann die Sitzungen eines Kontos, die über das Limit hinausgehen, und zwar die, die am längsten nicht genutzt wurden.

Wie du sie änderst, steht in [Konsole, Sitzungen und Logs](/docs/operations/configuration#console-sessions-and-logs).

### Ihre Sitzungen {#your-sessions}

Deine eigenen Anmeldungen an dieser Konsole: ob jede aktiv ist, die Adresse, wann sie begann, die letzte Aktivität, wann und warum sie endete, und der Browser. Standardmäßig kann jedes Konto eine aktive Sitzung haben, und eine neue Anmeldung beendet die vorherige; `SESSION_MAX_PER_USER` ändert das Limit. Eine Zeile über der Tabelle sagt, nach wie vielen Minuten ohne Aktivität und nach wie vielen Stunden spätestens eine Sitzung endet.

## Berichte {#reports}

**Berichte** erstellt Zusammenfassungen und bewahrt Kopien auf.

Wähle unter **Bericht erstellen** den Zeitraum mit **Von** und **Bis**, oder lass beide leer für den gesamten Zeitraum. Der Zeitraum gilt für App-Nutzung, Sicherheitsereignisse, Tickets, Netzwerkprüfungen und Alarme; die Berichte zu Geräten und Inventar zeigen den aktuellen Stand. Klicke dann neben einem der sieben Berichte auf **Erstellen**:

| Bericht | Inhalt |
|---|---|
| **Geräte** | Wie viele Geräte es gibt, wie viele online oder gesperrt sind und auf welchen Plattformen sie laufen |
| **App-Nutzung** | Aktive Zeit, Leerlaufzeit und die meistgenutzten Apps, von Geräten mit Aktivitätserfassung |
| **Sicherheit** | Gesperrte Geräte, Ereignisse aus dem Schutz vor Datenabfluss und die letzten Einträge im Audit-Protokoll |
| **Tickets** | Tickets nach Status, Kategorie und Priorität |
| **Netzwerkprüfungen** | Welche überwachten Hosts erreichbar sind und welche nicht, mit ihrer letzten Antwortzeit |
| **Inventar** | Betriebssysteme und durchschnittlicher Arbeitsspeicher der Geräte, die ein Inventar senden |
| **Alarme** | Alarmregeln und die Alarme, die sie ausgelöst haben |

Der Bericht erscheint auf der Seite und wird erst aufbewahrt, wenn du ihn speicherst. **Herunterladen** bietet ihn **Als JSON** oder **Als CSV (Haupttabelle)** an. **Bericht speichern** legt eine Kopie unter einem Namen deiner Wahl ab; die Kopie bleibt, wie sie ist, spätere Änderungen fließen nicht in sie ein.

**Gespeicherte Berichte** in der Seitenspalte listet die Kopien mit der Angabe, wer sie wann gespeichert hat. **Öffnen** zeigt eine Kopie wieder an. Kopien speichern und löschen dürfen nur Konten mit den Rollen Super-Admin und Globaler Administrator.

Unter den Berichten folgen dieselben Diagramme unter **Verlauf** wie auf [der Übersicht](/docs/console/overview#trends).

## App-Nutzung {#app-usage}

**App-Nutzung** zeigt, welche Apps auf jedem Gerät genutzt werden und wie lange. Die Daten kommen von Geräten, auf denen der NeoDesk-Agent mit eingeschalteter Aktivitätserfassung läuft; jedes Gerät meldet einmal am Tag.

![App-Nutzung mit Tagesberichten pro Gerät und den meistgenutzten Apps](shot:activity)

Berichte findest du mit **Nach Gerätename oder ID suchen**, mit einem Zeitraum über **Von** und **Bis** oder mit **Letzte 7 Tage**, **Letzte 30 Tage** und **Alle Daten**. Die Tabelle listet eine Zeile pro Tagesbericht, die neuesten zuerst, mit **Gerät**, **Berichtsdatum**, **Aktive Zeit**, **Leerlaufzeit** und **App-Sitzungen**. **Details** öffnet die Zeit pro App für das Gerät und seine letzten App-Sitzungen im gewählten Zeitraum.

Die Seitenspalte zählt die Berichte zusammen: **Aktive und inaktive Zeit** sagt, wie viel der aufgezeichneten Zeit aktiv war, und **Am meisten genutzte Apps** listet die Apps mit der meisten Zeit über alle Geräte.

Die Konsole löscht Daten zur App-Nutzung, die älter als 90 Tage sind.

## Abrechenbare Sitzungen {#billable-sessions}

**Abrechenbare Sitzungen** listet die Remote-Sitzungen, die auf Supportpakete angerechnet werden: die Sitzungen, die noch auf einen Arbeitsbericht warten, wie viel der enthaltenen Zeit jede Paketzuweisung in diesem Monat verbraucht hat, und jede Sitzung mit Filtern für Organisation, Status und Gerät. Die Seite gehört zu den Abrechnungsfunktionen und erscheint nur für Konten, die die Abrechnung ansehen dürfen.

Eine beendete Sitzung wartet nur dann auf einen Arbeitsbericht, wenn der Server mit `BILLING_REQUIRE_WORK_REPORT=Y` läuft; ohne diese Einstellung wird eine Sitzung abgeschlossen, sobald sie endet. Jede Sitzung wird auf ganze Minutenblöcke aufgerundet: `BILLING_ROUNDING_MINUTES` legt die Blockgröße fest, standardmäßig 1, und der Vertrag eines Pakets kann eine eigene festlegen.
