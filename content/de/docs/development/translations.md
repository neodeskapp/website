---
title: Übersetzungen
description: Wo die Texte der Web-Konsole liegen, wie du Übersetzungen verbesserst, Sprachen oder Texte hinzufügst und welche Prüfung jede Sprachdatei bestehen muss.
order: 7
---

Die Texte der Web-Konsole sind JSON-Dateien, eine pro Sprache, in `neodesk-server/console/static/files/lang`. Es sind 26, von `ar.json` bis `zh-TW.json`. Sie sind ins Server-Binary eingebaut, deshalb erreicht ein geänderter Text die Benutzer mit dem nächsten Release.

## Wie die Dateien funktionieren {#how-the-files-work}

Jede Datei ist ein JSON-Objekt mit verschachtelten Abschnitten wie `common`, `devices` oder `settings`. Die Konsole fragt einen Text über seinen Pfad ab, zum Beispiel `devices.title`.

- `en.json` und `pl.json` sind die Referenzsprachen. Ihre Schlüssel zusammen bilden die Basis, gegen die jede andere Datei geprüft wird.
- Der Server legt eine Sprache über die Standardsprache, Englisch, wenn `DEFAULT_LANGUAGE` keine andere nennt. Fehlt einer Sprache ein Schlüssel, erscheint deshalb der Text der Standardsprache.
- `{count}`, `{name}` und ähnliche sind Platzhalter, die die Konsole ausfüllt. Lass sie genau so, wie sie sind.
- Der Abschnitt `meta` benennt die Sprache: `lang` (ihr Code), `name` (auf Englisch) und `native_name` (in der Sprache selbst). Eine Datei kann stattdessen einen Abschnitt `_meta` haben. Ist er vorhanden, hat er Vorrang, und er kann außerdem `flag`, `rtl` und `needs_review` enthalten.

```json
{
  "meta": {
    "lang": "de",
    "name": "German",
    "native_name": "Deutsch"
  },
  "common": {
    "loading": "Laden...",
    "save": "Speichern"
  }
}
```

Von rechts nach links: Arabisch und Hebräisch sind in der Sprachtabelle des Servers als Sprachen markiert, die von rechts nach links geschrieben werden (siehe [Eine Sprache hinzufügen](#add-a-language)). `"rtl": true` im Abschnitt `_meta` einer Datei markiert jede andere Sprache so.

## Eine Übersetzung verbessern {#improve-a-translation}

1. Bearbeite `neodesk-server/console/static/files/lang/<code>.json`.
2. Ändere nur die Werte, nie die Schlüssel.
3. Behalte die Platzhalter bei, und nutze HTML nur dort, wo der englische Text welches hat.
4. Übersetze einen Text oder lass ihn weg. Kopiere den englischen Text nicht in eine andere Sprache, um eine Lücke zu füllen: Die Prüfung zählt solche Werte als unübersetzt, und die Lücke bleibt verborgen.
5. Führe die Prüfung unten aus und öffne einen Pull Request, siehe [Mitmachen](/docs/development/contributing).

`"needs_review": true` in `_meta` zeigt die Sprache auf der [Seite Übersetzungen](#see-it-in-the-console) der Konsole als **Zu prüfen** an.

## Eine Sprache hinzufügen {#add-a-language}

Der Server lädt nur die Sprachen aus seiner Tabelle, `knownLanguages` in `neodesk-server/console/i18n/bundle.go`. Eine Datei, deren Code nicht in der Tabelle steht, wird nie geladen. Eine neue Sprache braucht deshalb eine kleine Codeänderung:

1. Füge der Tabelle eine Zeile hinzu: den Code, den englischen Namen, den Namen in der Sprache selbst, die Flagge und ob die Sprache von rechts nach links geschrieben wird. Der Code besteht aus zwei bis acht Kleinbuchstaben, optional mit einer Region wie `-TW`.
2. Kopiere `en.json` nach `<code>.json`, setze den Abschnitt `meta` und übersetze jeden Wert.
3. Für eine Flagge im Sprachmenü füge `web-ui/static/img/flags/<code>.svg` hinzu und trage den Code in die Liste in `web-ui/src/lib/ui/LangFlag.svelte` ein. Eine Sprache ohne Flagge zeigt nur ihren Namen.

Hebräisch (`he`) steht in der Tabelle, hat aber noch keine Datei.

## Einen Text zur Konsole hinzufügen {#add-a-text-to-the-console}

Für Entwickler. Ein Text, den die Web-App zeigt, kommt aus einem Schlüssel: `t('devices.title')`, oder `tf('devices.title', 'Devices')` mit einem englischen Fallback. Der Fallback erscheint nur, wenn den geladenen Sprachdateien der Schlüssel fehlt; halte ihn deshalb gleich mit dem Text in `en.json`. Lint lehnt Text ab, der direkt ins Markup geschrieben ist.

Ein neuer Schlüssel gehört in jede Sprachdatei, nicht nur in `en.json`: Die Prüfung schlägt fehl, wenn einer Datei ein Schlüssel der Basis fehlt. Gib jeder Sprache eine echte Übersetzung. [web-ui/README.md](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md) enthält die Regeln der Web-App für Texte.

## Deine Arbeit prüfen {#check-your-work}

In `neodesk-server`:

```bash
go run ./cmd/repotool i18n-check --system console
```

Die Prüfung schlägt fehl, wenn:

- eine Datei sich nicht parsen lässt;
- einer Datei ein Schlüssel der Basis fehlt;
- ein Wert leer ist;
- `en.json` und `pl.json` nicht dieselben Schlüssel haben.

Ohne fehlzuschlagen meldet sie Schlüssel, die eine Datei hat, die Basis aber nicht, und Werte in einer anderen Sprache, die noch den englischen Text enthalten. `--verbose` listet diese auf, und `--json` gibt das ganze Ergebnis als JSON aus. Die Prüfung ändert nie eine Datei; es gibt keine Option, die Lücken mit Englisch füllt.

Go Server CI und das [lokale Gate](/docs/development/tests-and-checks#the-local-gate) führen sie aus, und Secret Scan prüft die Kopplungstexte separat mit `check-pairing-i18n`.

## In der Konsole ansehen {#see-it-in-the-console}

Ein Server, den du selbst baust, enthält deine Dateien, siehe [Aus dem Quellcode bauen](/docs/development/building). Um Änderungen ohne neuen Build auszuprobieren, starte den Server mit `CONSOLE_LANG_DIR`, gesetzt auf deinen Ordner `lang`: Dann liest er die Sprachdateien von der Festplatte. Er liest sie beim Start, starte ihn also nach einer Änderung neu.

Die Seite **Übersetzungen** der Konsole (`/languages`, für Konten mit der Berechtigung **Server konfigurieren**) zeigt, wie vollständig jede Sprache ist, mit ihrem Status und der Zahl der fehlenden Texte. **Texte anzeigen** listet jeden Text einer Sprache neben dem englischen auf. Die Seite liest nur; Texte werden in den Dateien geändert.
