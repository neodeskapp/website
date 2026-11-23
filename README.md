# NeoDesk website and docs

The website for neode.sk: the landing page and the documentation under
`/docs`. `npm run build` turns this folder into static files in `dist/`, which
any web server can host.

The build is TypeScript that Node runs directly, without a compile step. It
needs Node 22.18 or newer, which strips the types itself.

```sh
npm install            # once
npm run build          # writes dist/, the same as node build.ts
npm run serve          # builds, then serves dist/ on http://localhost:4173
npm run typecheck      # checks the types with tsc; it writes nothing
```

`node build.mjs` still works and runs `build.ts`.

The build stops with a list of problems when a check fails. See
[Checks](#checks) for what it looks at.

## Layout

```text
content/docs/<section>/<page>.md     the documentation
content/docs/<section>/<page>/<child>.md   a page under another page
content/screenshots/<name>-dark.png, <name>-light.png
src/home.html        the landing page
src/layout.ts        the frame around every docs page, and the docs index
src/checks.ts        the checks on the built site
src/types.ts         the shapes the build passes around
src/site.css         fonts, colours and base styles
src/docs.css         the docs layout
src/docs.js          search, copy buttons, "On this page", the menu on phones
public/              copied to dist/ as is (fonts, images, favicon)
site.config.ts       site address, repository, sections and their order
build.ts             the generator
deploy.sh            builds for beta or production and uploads to the web server
shots.json           the console screenshots: page, steps to reach the state, annotations
shots.ts             takes every screenshot in light and dark from a running console
```

`SITE_URL=https://beta.neode.sk node build.ts` builds for another address.
`DIST_DIR=<folder>` writes the build there instead of `dist/`.
`ND_VERSION=3.6.0` sets the version by hand; without it the build reads the
repository's VERSION file. `DOCS_DIR=<folder>` builds another content folder.

A new section needs a folder under `content/docs` and an entry in
`site.config.ts`. Docs pages get an "Edit on GitHub" link and an "Updated"
date once `content/docs` is in a git repository and `editBase` in
`site.config.ts` points at it.

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

## Checks

The build checks the pages as it reads them and the files it wrote to
`dist/`, and stops when one fails:

- Links: every link between docs pages, every heading a link names, and every
  screenshot exist.
- The old name: no BetterDesk, betterdesk, trybetterdesk or betterde.sk in the
  built pages, `.md` copies and llms files, and no old image path
  (`ghcr.io/<owner>/betterdesk...`). The allow list is `OLD_NAME_ALLOW` in
  `src/checks.ts`: links to the upstream repository UNITRONIX/BetterDesk, the
  "started as a fork of BetterDesk by UNITRONIX" credit, and the license and
  sponsors pages.
- The console port: 21114 is the server's API port on Linux and Windows. A
  sentence that names 21114 with the console, the browser or signing in, but
  not the API, fails.
- The version: every "NeoDesk X.Y.Z", "neodesk-server X.Y.Z" and
  `softwareVersion` must name the version the build was made for, and no
  `{{VERSION}}` may be left.
- Without scripts: `src/html.ts` parses every built page, without a browser.
  The main content and a navigation with links must not be empty, no code
  block may be empty, docs pages need their sidebar, and every tab needs a
  panel of its own with content. Scripts may hide and show what is in the
  HTML, but must not add content.

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
`shots.ts` retakes them from a running console, as `shots.json` describes
each one; `ND_ADMIN_PASSWORD_FILE=<file> node shots.ts [name ...]`. A run of
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

`{{VERSION}}` anywhere in a page becomes the current NeoDesk version.

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
