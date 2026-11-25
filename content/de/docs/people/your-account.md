---
title: Dein Konto
description: Dein Passwort, die Zwei-Faktor-Anmeldung, API-Tokens und Vorlieben, die Browser, in denen du angemeldet bist, und die Grenze für Sitzungen pro Konto.
order: 2.5
related: /docs/people/two-factor, /docs/command-line/api-tokens, /docs/people/users-and-roles
---

**Ihr Konto** ist eine Seite mit allem, was dein eigenes Konto betrifft. Jedes Konto hat sie. Öffne das Kontomenü, dein Bild oder deine Initialen am Ende der oberen Leiste, und wähle **Ihr Konto**.

Die Seite hat diese Teile:

- **Profil**: dein Bild, Benutzername und Rolle, dazu **Mein Status**: **Online**, **Abwesend** oder **Beschäftigt**. Kolleginnen und Kollegen sehen deinen Status im Chat und neben deinem Namen. Das Kontomenü ändert ihn auch. Name, E-Mail und Rolle änderst du hier nicht; das macht ein Admin auf der Seite [Benutzer](/docs/people/users-and-roles).
- **Passwort**: Ändere dein eigenes Passwort mit **Aktuelles Passwort**, **Neues Passwort** und **Neues Passwort wiederholen**, dann **Passwort ändern**. Konten aus einem Verzeichnis oder mit Single Sign-on haben kein Passwort in der Konsole und sehen stattdessen einen Hinweis.
- **Zwei-Faktor-Anmeldung**: einschalten, ausschalten und neue Wiederherstellungscodes erzeugen. Siehe [Zwei-Faktor-Anmeldung](/docs/people/two-factor).
- **Angemeldete Geräte**: die Browser und Geräte, auf denen dein Konto angemeldet ist, unten beschrieben.
- **API-Tokens**: deine Tokens für Skripte, die Kommandozeile und KI-Agenten. Diesen Teil haben nur Konten mit der Rolle Super-Admin, Administrator, Globaler Administrator oder Serveradministrator. Siehe [API-Tokens](/docs/command-line/api-tokens).
- **Persönliche Einstellungen**: **Design für diesen Browser** (**Standard der Konsole**, **Hell** oder **Dunkel**), **Sprache**, die für dein Konto auf jedem Gerät gilt, und **Barrierefreiheit einstellen** für Kontrast, Textgröße, Bewegung und Farbfilter in diesem Browser. **Standard der Konsole** folgt dem Design unter **Einstellungen**, **Darstellung**.

Das Kontomenü bietet kurze Wege zu einigen davon: **Angemeldete Geräte** öffnet die Liste in einem Seitenfenster, **API-Tokens** öffnet diesen Teil der Seite, und **Design**, **Sprache** und **Barrierefreiheit** ändern dieselben Einstellungen.

Die Suche in der oberen Leiste (Strg+K) findet auch die Felder dieser Seite, zum Beispiel „Passwort“ oder „angemeldete Geräte“.

## Angemeldete Geräte {#signed-in-devices}

Ein Konto kann auf mehreren Browsern und Geräten gleichzeitig angemeldet sein. **Angemeldete Geräte** listet sie auf. Jeder Eintrag nennt Browser und System, etwa „Firefox unter Windows“, dazu **Adresse**, **Angemeldet** (wann er sich angemeldet hat) und **Zuletzt verwendet**. Der Browser, mit dem du gerade arbeitest, ist mit **Dieser Browser** markiert.

- **Abmelden** neben einem Eintrag meldet diesen Browser ab, nachdem du bestätigt hast. Bei seiner nächsten Anfrage kommt er zur Anmeldeseite, die sagt: „Sie wurden von einem anderen Gerät aus abgemeldet. Bitte melden Sie sich erneut an.“
- **Überall sonst abmelden** meldet jeden Eintrag außer diesem Browser ab. Die Zeile daneben sagt, wie viele Sitzungen abgemeldet wurden.
- Deinen eigenen Browser meldest du mit **Abmelden** im Kontomenü ab.

Unter der Liste steht, wie viele Sitzungen der Server pro Konto erlaubt. Das Audit-Protokoll hält jede Abmeldung als „Sitzung von einem anderen Gerät abgemeldet“ fest.

### Für Admins {#for-administrators}

Ein Konto mit **Benutzer bearbeiten** findet **Angemeldete Geräte…** im Zeilenmenü einer Person auf der Seite **Benutzer**. Es öffnet dieselbe Liste für diese Person, mit **Abmelden** für jeden Eintrag und **Überall abmelden**. Die Anmeldeseite des betroffenen Browsers sagt dann: „Ein Administrator hat Sie abgemeldet. Bitte melden Sie sich erneut an.“ Den Eintrag gibt es nur für Konten, deren Rolle du ändern darfst (siehe [wer welche Rolle vergeben darf](/docs/people/users-and-roles#who-can-give-which-role)). Das Audit-Protokoll hält „Sitzung von einem Administrator beendet“ fest und nennt, wer welche Sitzung beendet hat.

## Wie viele Sitzungen ein Konto haben darf {#how-many-sessions-an-account-may-have}

Standardmäßig kann ein Konto auf bis zu 10 Browsern und Geräten gleichzeitig angemeldet sein. Eine Anmeldung darüber hinaus meldet den am längsten nicht verwendeten ab, und dieser Browser erfährt: „Sie wurden abgemeldet, weil sich Ihr Konto in mehr Browsern angemeldet hat, als dieser Server erlaubt. Bitte melden Sie sich erneut an.“ Das Audit-Protokoll hält „Sitzung durch die Sitzungsgrenze beendet“ fest.

Für eine Sitzung pro Konto öffne **Einstellungen**, **Anmeldung**, setze unter **Für alle** den Haken bei **Eine Sitzung pro Konto** und klicke auf **Speichern**. Eine neue Anmeldung meldet dann den anderen Browser des Kontos ab, und der erfährt: „Sie wurden abgemeldet, weil sich Ihr Konto in einem anderen Browser angemeldet hat. Dieser Server erlaubt eine Sitzung pro Konto.“ Der Schalter gilt ab der nächsten Anmeldung: Sitzungen, die gerade offen sind, bleiben, bis sich ihr Konto wieder anmeldet. Das Audit-Protokoll hält die Änderung als „Sitzungen pro Konto geändert“ fest.

Ist `SESSION_MAX_PER_USER` in der Umgebung des Servers gesetzt, entscheidet es statt des Schalters: die Zahl der Sitzungen pro Konto, von 1 bis 1000, oder `0` für keine Grenze. Der Schalter ist dann gesperrt, und die Seite sagt: „SESSION_MAX_PER_USER ist in der Umgebung des Servers auf … gesetzt und entscheidet statt dieses Schalters. Entfernen Sie es dort, um den Schalter zu verwenden.“ Ältere Env-Dateien der Installer enthielten `SESSION_MAX_PER_USER=1` mit dem Kommentar der Vorlage darüber. Findet der Server beim Start diese Zeilen genau so, wie die Vorlage sie geschrieben hat, leert er den Wert, damit der Schalter entscheidet. Einen Wert oder Kommentar, den du selbst geändert hast, lässt er stehen. Siehe [Konfiguration](/docs/operations/configuration#console-sessions-and-logs).

Eine Sitzung endet weiterhin nach 30 Minuten ohne Aktivität und 24 Stunden nach der Anmeldung; siehe [Sitzungen und fehlgeschlagene Anmeldungen](/docs/people/users-and-roles#sessions-and-failed-sign-ins).

## Was ein Konto überall abmeldet {#what-signs-an-account-out-everywhere}

Diese Dinge beenden die Konsolensitzungen eines Kontos:

- Änderst du dein eigenes Passwort oder schaltest du deine eigene Zwei-Faktor-Anmeldung ein oder aus, enden deine anderen Sitzungen. Der Browser, in dem du die Änderung machst, bleibt angemeldet. Die anderen Browser erfahren: „Sie wurden abgemeldet, weil sich Ihr Passwort, Ihre Zwei-Faktor-Anmeldung oder Ihr Zugriff geändert hat. Bitte melden Sie sich erneut an.“ Auch die Anmeldungen des Kontos im RustDesk-Client enden.
- Gibt ein Admin dem Konto ein neues Passwort, einen neuen Namen oder eine neue Rolle, schaltet seine Zwei-Faktor-Anmeldung aus, deaktiviert oder löscht es, enden alle seine Sitzungen. Ein neues Passwort für dein eigenes Konto lässt deine aktuelle Sitzung bestehen.
- Der Befehl zum Zurücksetzen des Passworts auf dem Server, den [Fehlerbehebung](/docs/operations/troubleshooting#forgot-the-admin-password) beschreibt, beendet die Konsolensitzungen des Kontos.

## Auf der Kommandozeile {#on-the-command-line}

Mit einem [API-Token](/docs/command-line/api-tokens):

```bash
neodesk sessions list                  # die Browser, auf denen dein Konto angemeldet ist
neodesk sessions list-for <user>       # die eines anderen Kontos, mit Benutzer bearbeiten
neodesk sessions end <user> <session>  # einen davon abmelden
neodesk sessions end-all <user>        # ein Konto überall abmelden
neodesk settings console-sessions      # der Schalter und was die Grenze bestimmt
neodesk settings console-sessions-set --single-session=true
```

`<user>` ist die ID des Kontos, die `neodesk users list` zeigt, und `<session>` die ID der Sitzung aus `neodesk sessions list-for`.

Ein Token hat keine eigene Browsersitzung, darum markiert `sessions list` keinen Eintrag als den aktuellen. Ein Token kann die Sitzungen seines eigenen Kontos nicht abmelden: Nutze dafür **Angemeldete Geräte** im Browser. Die [Befehlsreferenz](/docs/command-line/reference) listet die Optionen.
