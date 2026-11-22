---
title: Translations
description: Where the web console's texts live, how to improve a translation or add a language, how to add a new text, and the check every language file has to pass.
order: 7
---

The web console's texts are JSON files, one per language, in `betterdesk-server/console/static/files/lang`. There are 26 of them, from `ar.json` to `zh-TW.json`. They are built into the server binary, so a changed text reaches users with the next release.

## How the files work

Each file is one JSON object with nested sections, such as `common`, `devices` or `settings`. The console asks for a text by its path, for example `devices.title`.

- `en.json` and `pl.json` are the reference languages. Their keys together are the baseline that every other file is checked against.
- The server lays a language over the default language, English unless `DEFAULT_LANGUAGE` names another, so a key a language lacks shows the default language's text.
- `{count}`, `{name}` and the like are placeholders that the console fills in. Keep them exactly as they are.
- The `meta` section names the language: `lang` (its code), `name` (in English) and `native_name` (in the language itself). A file can carry a `_meta` section instead, which wins when present and can also hold `flag`, `rtl` and `needs_review`.

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

Right to left: Arabic and Hebrew are marked as right-to-left languages in the server's table of languages (see [Add a language](#add-a-language)). `"rtl": true` in a file's `_meta` section marks any other language.

## Improve a translation

1. Edit `betterdesk-server/console/static/files/lang/<code>.json`.
2. Change only the values, never the keys.
3. Keep the placeholders, and use HTML only where the English text has it.
4. Translate a text or leave it out. Don't copy the English text into another language to fill a gap: the check counts such values as untranslated, and the gap stays hidden.
5. Run the check below and open a pull request, see [Contributing](/docs/development/contributing).

`"needs_review": true` in `_meta` shows the language as **Needs review** on the console's [Translations page](#see-it-in-the-console).

## Add a language

The server loads only the languages in its table, `knownLanguages` in `betterdesk-server/console/i18n/bundle.go`. A file whose code is not in the table is never loaded. So a new language takes a small code change:

1. Add a row to the table: the code, the English name, the native name, the flag and whether it is written right to left. The code is two to eight lower-case letters, with an optional region such as `-TW`.
2. Copy `en.json` to `<code>.json`, set its `meta` section, and translate every value.
3. For a flag in the language menu, add `web-ui/static/img/flags/<code>.svg` and the code to the list in `web-ui/src/lib/ui/LangFlag.svelte`. A language without a flag shows its name only.

Hebrew (`he`) is in the table but has no file yet.

## Add a text to the console

For developers. A text the web app shows comes from a key: `t('devices.title')`, or `tf('devices.title', 'Devices')` with an English fallback. The fallback shows only when the loaded language files lack the key, so keep it the same as the text in `en.json`. Lint rejects text written directly into the markup.

A new key goes into every language file, not only `en.json`: the check fails when any file misses a baseline key. Give each language a real translation. [web-ui/README.md](https://github.com/trybetterdesk/betterdesk/blob/main/web-ui/README.md) has the web app's text rules.

## Check your work

In `betterdesk-server`:

```bash
go run ./cmd/repotool i18n-check --system console
```

The check fails when:

- a file does not parse;
- a file misses a key of the baseline;
- a value is empty;
- `en.json` and `pl.json` don't have the same keys.

It reports, without failing, keys a file has that the baseline doesn't, and values in another language that are still the English text. `--verbose` lists those, and `--json` prints the whole result as JSON. The check never changes a file; there is no option that fills gaps with English.

Go Server CI and the [local gate](/docs/development/tests-and-checks#the-local-gate) run it, and Secret Scan checks the pairing texts separately with `check-pairing-i18n`.

## See it in the console

A server you build yourself carries your files, see [Building from source](/docs/development/building). To try changes without building again, start the server with `CONSOLE_LANG_DIR` set to your `lang` folder: it then reads the language files from disk. It reads them when it starts, so restart it after a change.

The console's **Translations** page (`/languages`, for accounts with the **Server configuration** permission) shows how complete each language is, with its status and the number of missing texts. **Show texts** lists every text of a language next to the English one. The page only reads; texts are changed in the files.
