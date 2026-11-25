---
title: Gespeicherte Anmeldung
description: Namen und Passwort eines Windows-Kontos für ein Gerät speichern und den Browser-Viewer damit am Sperrbildschirm des Computers anmelden lassen.
order: 11
---

Die gespeicherte Anmeldung hält Namen und Passwort eines Windows-Kontos für ein
Gerät bereit. Beginnt eine Sitzung im
[Browser-Viewer](/docs/console/remote-in-browser) am Sperr- oder
Anmeldebildschirm des Computers, meldet sich der Viewer damit an, und du musst
das Passwort nicht kennen. Das geht auf Windows-Computern, auf denen NeoDesk
als Dienst läuft, im Browser-Viewer und über eine Sitzung, die bis zum Computer
verschlüsselt ist.

## Berechtigungen {#permissions}

Zur gespeicherten Anmeldung gehören zwei Berechtigungen:

| Berechtigung | Kurzname | Was sie erlaubt |
|---|---|---|
| **Gespeicherte Anmeldung verwenden** | `device.signin_use` | Sich im Viewer mit den gespeicherten Daten anmelden. Braucht dazu **Mit Geräten verbinden**. |
| **Gespeicherte Anmeldung verwalten** | `device.signin_manage` | Die Daten speichern, ersetzen und löschen und die automatische Anmeldung ein- oder ausschalten. |

Von Haus aus haben sie nur Super-Admins und Administratoren. Auf der Seite
[Berechtigungen](/docs/people/permissions) gibst du sie einer anderen Rolle.
Beide gelten nur für die Geräte, die das Konto sehen darf.

## Die Daten speichern {#save-the-details}

1. Öffne das Gerät und wähle auf seinem Tab **Aktionen** oder in seinem Menü in
   der Geräteliste **Gespeicherte Anmeldung**.
2. Unter **Kontoname** gibst du das Konto so ein, wie du es am
   Anmeldebildschirm eintippst: `name`, `DOMAIN\name` oder `name@domain`.
3. Unter **Passwort** gibst du sein Passwort ein.
4. Unter **Der Anmeldebildschirm fragt nach** wählst du **Nur dem Passwort (das
   Konto wird angezeigt)** oder **Kontoname und Passwort**. Ein gesperrter
   Computer zeigt sein Konto und fragt nur nach dem Passwort. Nach einem
   Neustart zeigt Windows das letzte Konto oder fragt nach beidem, je nach
   seinen Einstellungen.
5. Schalte **Automatisch anmelden, wenn eine Sitzung am Sperrbildschirm
   beginnt** ein, wenn sich der Viewer von selbst anmelden soll. Von Haus aus
   ist es aus.
6. Speichere.

Das Passwort lässt sich nicht mehr anzeigen. Öffnest du **Gespeicherte
Anmeldung** später, siehst du das Konto, wer es wann gespeichert hat, und
kannst das Passwort ersetzen oder den Schalter ändern; lass das Passwort leer,
um das gespeicherte zu behalten. **Gespeicherte Anmeldung löschen** entfernt
Kontoname und Passwort vom Server.

Kontoname und Passwort haben jeweils höchstens 256 Zeichen. Tabulatoren,
Zeilenumbrüche und Zeichen wie Emoji lassen sich an einem Anmeldebildschirm
nicht eingeben, deshalb lehnt das Formular sie ab.

## Im Viewer anmelden {#sign-in-from-the-viewer}

Ist eine Anmeldung gespeichert, zeigt der Viewer „Für diesen Computer ist eine
Anmeldung gespeichert.“ Er meldet sich höchstens einmal pro Sitzung an:

- **Von selbst**, wenn der Schalter an ist und die Sitzung am Sperr- oder
  Anmeldebildschirm beginnt. Ein neues Verbinden im selben Browser-Tab macht
  es nicht noch einmal. Öffnet sich die Sitzung, während du auf einer anderen
  Seite der Konsole bist, wartet sie und meldet sich an, sobald du zu ihr
  zurückkehrst.
- **Mit Anmelden**, in der Leiste oder als **Mit den gespeicherten Daten
  anmelden** unter **Aktionen**, in jedem anderen Fall.

Zum Anmelden drückt der Viewer Strg+Alt+Entf, wartet auf den
Anmeldebildschirm und gibt das Passwort ein, oder den Kontonamen, Tab und das
Passwort, dann Enter. Er gibt jedes Zeichen als Zeichen ein, deshalb spielt
das Tastaturlayout des Computers keine Rolle.

Ob Windows das Passwort angenommen hat, sieht der Viewer nicht. Danach meldet
er „Die gespeicherten Daten wurden eingegeben. Zeigt Windows einen Fehler,
melden Sie sich von Hand an: In dieser Sitzung werden sie nicht noch einmal
versucht.“ Ein falsch gespeichertes Passwort kostet also höchstens eine
fehlgeschlagene Anmeldung pro Sitzung und sperrt das Konto nicht durch
Wiederholen.

## Was mit welchem Client geht {#what-works-with-which-client}

Wie die Daten an den Sperrbildschirm kommen, hängt vom NeoDesk-Client auf dem
Computer ab.

### Client 1.5.0-rc.7 und älter {#the-client-150-rc7-and-older}

Der Browser-Viewer gibt die Daten ein. Das Passwort kommt im Moment der
Verwendung über HTTPS vom Server und bleibt etwa zwei Sekunden im Browser,
während der Viewer es eingibt.

Diese Clients melden nicht, ob der Computer gesperrt ist. Deshalb meldet sich
der Viewer von selbst nur an, solange niemand am Computer angemeldet ist, etwa
nach einem Neustart. Ist jemand angemeldet, sagt die Leiste „An diesem Computer
ist jemand angemeldet. Verwenden Sie Anmelden nur, solange der Sperrbildschirm
zu sehen ist.“, und **Anmelden** fragt vorher nach, weil das Passwort auf einem
offenen Desktop dort landen würde, wo gerade der Fokus liegt.

### Clients nach 1.5.0-rc.7 {#clients-after-150-rc7}

Ein späterer NeoDesk-Client, der noch nicht veröffentlicht ist, öffnet die
Daten selbst. Der Server versiegelt sie für das NeoDesk dieses Computers, der
Viewer reicht das versiegelte Paket nur weiter, und der NeoDesk-Dienst des
Computers gibt sie an seinem eigenen Sperrbildschirm ein. Das Passwort kommt
nie im Browser an.

Dieser Client meldet auch seinen Sperrbildschirm. Die gespeicherte Anmeldung
wirkt dann nur am Sperr- oder Anmeldebildschirm: von selbst mit eingeschaltetem
Schalter oder mit **Anmelden**, ohne vorher zu fragen. Auf einem offenen
Desktop und auf den Bildschirmen einer angemeldeten Sitzung, etwa den
Strg+Alt+Entf-Optionen, wird nichts angeboten.

Hat das NeoDesk eines Computers einmal gemeldet, dass es versiegelte
Anmeldungen öffnet, gibt der Server für ihn keine lesbaren Daten mehr heraus,
auch wenn wieder ein älterer Client darauf installiert wird. Der Viewer sagt
dann, dass NeoDesk auf dem Computer aktualisiert werden muss.

### Wo es nicht geht {#where-it-doesnt-work}

- Linux- und macOS-Computer: Der Viewer meldet „Die gespeicherte Anmeldung
  funktioniert nur auf Windows-Computern.“, und das Fenster **Gespeicherte
  Anmeldung** sagt dasselbe, wenn das Gerät ein anderes System meldet.
- Ein Computer, auf dem NeoDesk ohne seinen Dienst läuft, etwa als portable
  Kopie: „NeoDesk läuft auf diesem Computer ohne seinen Dienst und kann deshalb
  am Sperrbildschirm nichts eingeben.“
- Gastlinks: Einem Gast bietet der Viewer die gespeicherte Anmeldung nie an.
- API-Tokens und damit die Kommandozeile und MCP verwenden die Daten nie.

## Wo die Daten liegen {#where-the-details-are-kept}

Der Server hält Kontonamen und Passwort verschlüsselt (AES-256-GCM), jeweils
für sein Gerät versiegelt, sodass sich ein Wert nicht auf ein anderes Gerät
übertragen lässt. Der Schlüssel ist die Datei `.device_vault_key` neben dem
Schlüsselpaar des Servers:

| Installation | Schlüsseldatei |
|---|---|
| Linux | `/opt/neodesk/.device_vault_key` |
| Windows | `C:\NeoDesk\.device_vault_key` |
| Docker | `/opt/neodesk/data/.device_vault_key` im Daten-Volume |

Der Server legt sie beim ersten Start an. Dieselbe Datei hält den Schlüssel der
Gerätepasswörter, die das Adressbuch einer Organisation speichert, siehe
[Das Passwort mit deinem Team teilen](/docs/console/unattended-access#share-the-password-with-your-team).

- Die vollständige Sicherung der Konsole enthält die gespeicherten Daten, aber
  nicht die Schlüsseldatei, ebenso die Sicherungen der Installer für Linux und
  Windows. Die Sicherung des Docker-Verwalters kopiert das ganze Daten-Volume,
  mit der Schlüsseldatei. Siehe [Sichern und wiederherstellen](/docs/operations/backup).
- Eine Wiederherstellung auf demselben Server öffnet die Daten wieder. Ein
  Server mit einer anderen Schlüsseldatei kann es nicht: Der Viewer meldet „Die
  gespeicherten Daten lassen sich mit dem Schlüssel dieses Servers nicht lesen.
  Speichern Sie sie neu.“
- Ziehst du mit dem Server um, kopier die Schlüsseldatei mit den Daten.
- Pass auf die Datei so gut auf wie auf den Schlüssel des Servers: Datei und
  eine Kopie der Datenbank zusammen öffnen die Daten.

Ändert sich die ID eines Geräts oder wird es endgültig gelöscht, ist auch seine
gespeicherte Anmeldung weg.

## Das Audit-Protokoll {#the-audit-log}

Jeder Schritt steht im [Audit-Protokoll](/docs/console/activity): **Gespeicherte
Anmeldung gesetzt**, **Gespeicherte Anmeldung ersetzt**, **Gespeicherte
Anmeldung geändert**, **Gespeicherte Anmeldung gelöscht**, **Gespeicherte
Anmeldung verwendet** und **Gespeicherte Anmeldung abgelehnt**, mit dem Gerät
und bei einer Ablehnung dem Grund. Ein Eintrag nennt den Kontonamen, nie das
Passwort. Der Server schreibt den Eintrag, bevor er die Daten herausgibt; kann
er es nicht, gibt er nichts heraus.

## Auf der Kommandozeile {#on-the-command-line}

Mit **Gespeicherte Anmeldung verwalten** zeigt, speichert und löscht die
Kommandozeile die Daten. Setz die ID des Geräts für `<device-id>` und das Konto
für `<account-name>` ein, mit dem Passwort in einer Datei:

```bash
neodesk devices signin-set <device-id> --username '<account-name>' --password-stdin < password.txt
```

- `neodesk devices signin <device-id>` zeigt, ob Daten gespeichert sind, für
  welches Konto und wer sie gespeichert hat, nie das Passwort.
- `neodesk devices signin-auto <device-id> --auto` schaltet die automatische
  Anmeldung ein; `--form name_password` sagt, dass der Bildschirm nach beidem
  fragt.
- `neodesk devices signin-clear <device-id>` löscht die Daten.

Kein Befehl verwendet die Daten oder liest das Passwort zurück.
