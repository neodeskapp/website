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
src/home.html        the landing page; its install tabs come from src/install.ts
src/install.ts       the install commands of the landing page and llms.txt
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

## Languages

English is the default and lives at the root. `src/i18n.ts` lists the other
languages with their prefix (German at `/de/`) and holds the words of the frame
around the pages for each language. A translated docs page goes into
`content/<code>/docs/` with the same path as the English one, for example
`content/de/docs/getting-started/docker.md`. The build writes `/de/` pages only
for the files there, and only once that language has every string in
`src/i18n.ts`, section names included; until then it stops with the list of
missing strings. A link to a page that has no translation yet leads to the
English page.

Every page lists its language versions with `hreflang`, plus `x-default` for
the English one, and shows a language switch when it has more than one. The
landing page, the search index and the llms files are English only.

There is no German text yet.

## What the build makes

- `/docs/` with every section, `/docs/<section>/` with that section's pages,
  and one page per Markdown file, with the sidebar, the "On this page" list,
  breadcrumb, and previous and next links that follow the sidebar across
  sections.
- Search over every page and every `##` section (`/` or Ctrl+K), from
  `docs/search.json`, with no server behind it.
- A Markdown copy of every page at the page's address plus `.md`, and files
  for AI tools: `/llms-full.txt` with every page, one file per section
  (`/llms-getting-started.txt` and so on), and `/llms.txt`, which lists all of
  them with their sizes and every page. `/llms.txt` starts with a section for
  AI agents: the one-line installs from `src/install.ts` and the agent tools
  from `src/agents.ts`. A tool there stays out of every published file while its
  `available` is false; set it to true, with a `docs` page, once it ships.
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
- Indexing: on neode.sk, `robots.txt` allows everything and names each AI
  crawler in `aiCrawlers` in `site.config.ts` as allowed, and only the 404 page
  says noindex. A build for any other address, such as beta.neode.sk, puts
  noindex on every page (the beta's web server also sends
  `X-Robots-Tag: noindex`).
- Languages: `<html lang>` matches the page's address, every page links to
  itself and to `x-default` with `hreflang`, and every language version it
  names exists and names it back. A language with pages must have all its
  strings.
- Structured data: the home page has a JSON-LD SoftwareApplication with name,
  license, operating systems, version and download address; every docs page a
  TechArticle with `dateModified` and a BreadcrumbList that ends at the page.
  `sitemap.xml` lists every page that has a canonical address, each with
  `lastmod`: a page's date is the last commit of its file, a list's the newest
  of its pages. Without git history (a shallow clone) every date is the same
  commit, so CI needs the full history.
- Heading ids: see [Heading ids](#heading-ids).
- Install commands: every command in `src/install.ts`, which the landing page
  and llms.txt show, is in a code block of the same language on its docs
  page. The landing page's list of client ports comes from the table on the
  ports page: the rows RustDesk clients connect to that say Yes under "Open to
  the internet".
- "Copy as Markdown": every docs page and section page has it next to the
  h1, a plain link to the page's own `.md` copy, which must exist. With
  scripts a click copies the Markdown; without them the link opens it.
- Files for AI tools: llms.txt starts with "For AI agents", lists every
  `llms-*.txt` with its size in KB, every page is in exactly one section file,
  and no agent tool that is not available is named anywhere.
- Commands (`src/commands.ts`): every block has a language, no block has a
  shell prompt (`$ `, `PS C:\>`), a command the text asks the reader to run is
  in a block of its own, and placeholders follow the rule under [Code](#code).

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

### Heading ids

A heading's id comes from its text, as above. Ids stay: `content/anchors.json`
records every id a build has seen, and the build stops when one of them no
longer leads to its page. When you rename a heading that others may link to,
keep the old id as an alias, and the page answers to both:

```markdown
## Change a port {alias=changing-a-port}
```

`{#id}` at the end of a heading sets its id by hand, and the two combine:
`{#change-a-port alias=changing-a-port,ports}`. Links inside the docs use the
current id; the build stops on a link to an alias. The build adds new ids to
`content/anchors.json` itself (not in CI); commit the file with the pages. To
retire an id for good, delete it from the file.

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
`json`, `sql`, `caddy`, `fstab`, `text`). Every block but `text` gets a copy
button, so put only what the reader should paste into it, without a `$` prompt.
Put output in a separate `text` block.

Every command the reader runs goes into a fenced block of its own, not into a
sentence: "Recreate the container:" and the command in a block, not "run
`docker compose up -d`". A command may stay inline where the text names it
rather than asks for it to be run: "`docker compose ps` shows the container as
healthy".

Write placeholders as `<lower-case-with-hyphens>`, for example
`<server-address>`, and say right before or after the block what goes in:
"Put your server's address in place of `<server-address>`." No `YOUR_TOKEN`,
`PASSWORD`, `{id}`, `/path/to/`, `--flag FILE`, `change-this-password`, and no
`example.com` hosts or example IP addresses in blocks the reader pastes. A
block that shows exactly what NeoDesk prints, with NeoDesk's own placeholder,
is marked `quoted` after the language (```` ```powershell quoted ````).

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
