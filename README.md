# BetterDesk website and docs

The website for betterde.sk: the landing page and the documentation under
`/docs`. `node build.mjs` turns this folder into static files in `dist/`, which
any web server can host.

```sh
npm install          # once: markdown-it and highlight.js
node build.mjs       # writes dist/
node build.mjs --serve   # builds, then serves dist/ on http://localhost:4173
```

The build stops with a list when a docs page links to a page, heading or
screenshot that does not exist.

## Layout

```text
content/docs/<section>/<page>.md     the documentation
content/docs/<section>/<page>/<child>.md   a page under another page
content/screenshots/<name>-dark.png, <name>-light.png
src/home.html        the landing page
src/layout.mjs       the frame around every docs page, and the docs index
src/site.css         fonts, colours and base styles
src/docs.css         the docs layout
src/docs.js          search, copy buttons, "On this page", the menu on phones
public/              copied to dist/ as is (fonts, images, favicon)
site.config.mjs      site address, repository, sections and their order
build.mjs            the generator
deploy.sh            builds for beta or production and uploads to the web server
shots.json           the console screenshots: page, steps to reach the state, annotations
shots.mjs            takes every screenshot in light and dark from a running console
```

`SITE_URL=https://beta.betterde.sk node build.mjs` builds for another address.
`DIST_DIR=<folder>` writes the build there instead of `dist/`.
`BD_VERSION=3.6.0` sets the version by hand; without it the build reads the
repository's VERSION file. `DOCS_DIR=<folder>` builds another content folder.

A new section needs a folder under `content/docs` and an entry in
`site.config.mjs`. Docs pages get an "Edit on GitHub" link and an "Updated"
date once `content/docs` is in a git repository and `editBase` in
`site.config.mjs` points at it.

## What the build makes

- `/docs/` with every section, `/docs/<section>/` with that section's pages,
  and one page per Markdown file, with the sidebar, the "On this page" list,
  breadcrumb, and previous and next links that follow the sidebar across
  sections.
- Search over every page and every `##` section (`/` or Ctrl+K), from
  `docs/search.json`, with no server behind it.
- A Markdown copy of every page at the page's address plus `.md`, and
  `/llms.txt` and `/llms-full.txt`, for AI tools.
- `sitemap.xml`, `robots.txt` and `404.html`.

## Writing a docs page

A page is a Markdown file with front matter:

```markdown
---
title: Install with Docker
description: Run the server and the web console in one container, built from the repository.
order: 2
---

One or two sentences that say what the page covers and who needs it.

## First heading
```

- `title` becomes the page's `h1`, so the body has no `# ` heading. Start with
  a short introduction, then `## ` sections. Use `### ` inside a section when
  it needs parts. Headings are sentence case.
- `description` is one sentence. It shows under the title on section pages, in
  search results and in link previews.
- `order` sorts the page in its section, starting at 1.

### Links

Link to other docs pages by their address, without `.md` and without a trailing
slash, and to a heading with its id (the heading in lower case, spaces as
hyphens, punctuation dropped):

```markdown
See [Ports](/docs/operations/ports) and
[the enrollment modes](/docs/console/enrollment#enrollment-modes).
```

### Notes

For something the reader must not miss. A note is a block of its own, and
there are two kinds:

```markdown
::: note
The console listens on plain HTTP. Put a reverse proxy with TLS in front of it
before you open it to the internet.
:::

::: warning
This deletes the device's history. It cannot be undone.
:::
```

Use them rarely: most pages need none.

### Screenshots

Screenshots are in `content/screenshots/` in a dark and a light version.
`shots.mjs` retakes them from a running console, as `shots.json` describes
each one; `BD_ADMIN_PASSWORD_FILE=<file> node shots.mjs [name ...]`. A run of
every shot deletes the ones `shots.json` no longer names. It needs
Playwright with Chromium (`npm install --no-save playwright` and
`npx playwright install chromium`, or `PLAYWRIGHT_MODULE` pointing at an
installed copy). Write
the name without the theme, and the page shows the one that fits the reader's
theme:

```markdown
![The device list with folders and groups on the left](shot:devices)
```

The alt text says what the picture shows, in one sentence.

### Code

Fence code with its language (`bash`, `powershell`, `yaml`, `nginx`, `ini`,
`json`, `sql`, `text`). Every block gets a copy button, so put only what the
reader should paste into it, without a `$` prompt. Put output in a separate
`text` block.

`{{VERSION}}` anywhere in a page becomes the current BetterDesk version.

### Tables

Use a table for reference material such as settings and ports, with the name
in the first column. Don't use one for prose.

### Style

- Plain words, short sentences, active voice. Say what the reader does and
  what they see.
- Use the console's own words for pages, buttons and settings, in bold when
  the reader has to find them: open **Devices**, then **Enrollment requests**.
- Backticks only for what the reader copies or types: commands, paths,
  settings names, addresses.
- Write only what is true of the code in this repository today. No "coming
  soon", no history of how a feature came to be.
- No marketing tone, no exclamation marks, no em dashes.
