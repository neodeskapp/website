# NeoDesk website and docs

The website for neode.sk: the landing page on neode.sk and the documentation
on docs.neode.sk. `npm run build` turns this folder into static files in
`dist/`, which any web server can host.

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
src/og.ts            the link preview images
src/layout.ts        the frame around every docs page, and the docs index
src/chrome.ts        the header and footer of every page, home page included
src/chrome.css       their styles; the build puts them in front of site.css and into the home page
src/checks.ts        the checks on the built site
src/types.ts         the shapes the build passes around
src/site.css         fonts, colours and base styles
src/docs.css         the docs layout
src/docs.js          search, copy buttons, "On this page", the sidebar panel on phones
public/              copied to dist/ as is (web fonts, images, favicon)
fonts/               the TrueType fonts the build itself uses, not served
site.config.ts       site address, repository, sections and their order
build.ts             the generator
deploy.sh            builds for beta or production and uploads to the web server
shots.json           the console screenshots: page, steps to reach the state, annotations
shots.ts             takes every screenshot in light and dark from a running console
release-card.ts      draws the card at the top of a release's notes, from git
cli-reference.ts     writes the command reference from the server's clidocs output
public/img/releases/ the images of the release notes, one folder per tag
```

`SITE_URL=https://beta.neode.sk node build.ts` builds for another address.
`npm run serve` builds for `http://localhost:4173` unless `SITE_URL` is set.
`DIST_DIR=<folder>` writes the build there instead of `dist/`.
`ND_VERSION=3.6.0` sets the version by hand; without it the build reads the
newest published release of neodeskapp/neodesk, pre-releases included. `DOCS_DIR=<folder>` builds another content folder.

## Two hosts

The docs are on their own host, docs.neode.sk, without `/docs` in the path:
`https://docs.neode.sk/getting-started/docker/` and
`https://docs.neode.sk/de/getting-started/docker/`. Everything else is on
neode.sk. Both come from one build and one deployment:

- `dist/docs/` is the docs host's root, with German under `dist/docs/de/`. It
  has its own `404.html`, `de/404.html`, `search.json`, `de/search.json`,
  `sitemap.xml` and `robots.txt`.
- The docs host serves `/assets/`, `/fonts/`, `/img/`, `/og/` and the llms
  files from `dist/`, the www host's root, so they exist once.
- `docsUrl` in `site.config.ts` says where the docs are on production. A build
  for any other address keeps them under `/docs` on that host
  (`https://beta.neode.sk/docs/getting-started/docker/`, German under
  `/docs/de/`), so the beta needs no second name or certificate. `DOCS_URL`
  overrides both.

Inside the build a page keeps its logical address, the one from before the
move: `/docs/getting-started/docker/`, `/de/docs/getting-started/docker/`.
`src/urls.ts` turns it into the address on the right host. Links between docs
pages and to the other host are absolute, so a docs page also works when it is
reached at its old address. Every old address on neode.sk redirects to the docs
host with a 301; the web server's rule is the same mapping:
`/docs/<path>` to `https://docs.neode.sk/<path>` and `/de/docs/<path>` to
`https://docs.neode.sk/de/<path>`.

A new section needs a folder under `content/docs` and an entry in
`site.config.ts`. Docs pages get an "Edit on GitHub" link and an "Updated"
date once `content/docs` is in a git repository and `editBase` in
`site.config.ts` points at it.

## Fonts and images

The pages load WOFF2 fonts only, and preload the ones the first screen needs.
IBM Plex Sans and Mono are Latin subsets already. `public/fonts/FunnelDisplay-latin.woff2`
is the Latin subset of `fonts/FunnelDisplay.ttf`, the brand font file as it is,
with every glyph and the weight axis kept. Make it again after a font change:

```sh
python -m fontTools.subset fonts/FunnelDisplay.ttf --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" --layout-features='*' --flavor=woff2 --output-file=public/fonts/FunnelDisplay-latin.woff2
```

The build turns every screenshot and every PNG in `public/img` into a lossless
WebP (with sharp), the same pixels in about a third of the bytes, and the pages
show it with the PNG as fallback. A lossless AVIF came out larger than the PNG,
so there is none. Converted files are kept in `.cache/`, so a build converts
only new or changed images.

## Link previews

Every page gets a 1200 by 630 PNG for link previews, at `/og/` plus the page's
address: `/og/docs/getting-started/docker.png`, `/og/index.png` for the home
page. `src/og.ts` draws them from SVG templates with resvg, with the fonts in
`fonts/` and no system fonts, so every machine draws the same picture. An
image shows the logo and the page's title in large type, and no other text.
The templates:

- `landing`: the home page, the docs index and the section pages, next to
  the large mark.
- `docs`: every docs page, with the mark in the corner.
- `comparison`: "NeoDesk vs" and the product, as text. A page asks for it with
  `og: comparison` and `product: <name>` in its front matter.
- `use-case`: `og: use-case`; it looks like `docs`.
- `release`: the version large, then the title. `og: release`, and
  `release: <version>` for another version than the current one.

A title takes at most three lines (two under the first line in `comparison`
and `release`), as even as they go, at the largest size that fits. A second
line counts as 15 % smaller, a third as 20 % smaller again, and a word broken
after its hyphen as 20 % smaller, so a title stays on fewer lines, and a
word whole, when that costs little size. A word breaks after a hyphen only
when it is wider than the room on its own. When a title needs
more lines, or runs into the logo, the mark or the margins, even at the
template's smallest size, the build stops and names the page; shorten the
title. An image is drawn again only when its title or the template
(`src/og.ts`, the fonts, the logo) changed; the drawn images are kept in
`.cache/og/`.

`/og/` itself is a page that shows every image with its title, plus the
templates no page uses yet with sample text. It is noindex, not in the
sitemap, and linked from nowhere.

resvg ignores the weight axis of a variable font, so `fonts/` holds static
instances, made from the variable fonts without other changes:

```sh
python -m fontTools.varLib.instancer fonts/FunnelDisplay.ttf wght=700 --static --update-name-table -o fonts/FunnelDisplay-Bold.ttf
python -c "from fontTools.ttLib import TTFont; t = TTFont('public/fonts/IBMPlexSans-latin.woff2'); t.flavor = None; t.save('plex.ttf')"
python -m fontTools.varLib.instancer plex.ttf wght=400 --static --update-name-table -o fonts/IBMPlexSans-Regular.ttf
python -m fontTools.varLib.instancer plex.ttf wght=600 --static --update-name-table -o fonts/IBMPlexSans-SemiBold.ttf
```

## Release cards

The first image in a release's notes is a card drawn by `drawReleaseCard` in
`src/og.ts`: the version, a title, the date, and the release's commits, files
changed, lines added and removed and fixes against the release before, counted
from git. `release-card.ts` draws it into `public/img/releases/<tag>/card.png`,
next to the release's screenshots:

```sh
node release-card.ts ../neodesk v3.6.0-rc.2 "The first release as NeoDesk" --note "The numbers include the rename of the project."
node release-card.ts ../neodesk-client desktop-v1.5.0-rc.4 "The desktop client as NeoDesk" --previous desktop-v1.5.0-rc.2 --product "Desktop client" --accent lime
```

It compares with the tag before by default; name the release with
`--previous` when the tag before it was never published. The notes link the
images by commit, as
`https://raw.githubusercontent.com/neodeskapp/website/<commit>/public/img/releases/<tag>/card.png`.

## The command reference

The pages under `/docs/command-line/reference/` come from the server's own
generator, which reads the command table the `neodesk` command line runs on.
Don't edit them by hand; make them again after a release that changes commands:

```sh
cd ../neodesk/neodesk-server && go run ./cmd/clidocs -out /tmp/clidocs -version 3.6.0-rc.4
node cli-reference.ts /tmp/clidocs
```

clidocs writes `index.md`, a page per command group, `excluded.md` and
`commands.json`. `cli-reference.ts` turns them into
`content/docs/command-line/reference.md`, one page per group under
`content/docs/command-line/reference/` and `routes-left-out.md`, and the same in
German, where the title, description and intro are German and the commands stay
English, as the command line prints them. A new group needs its German summary
in `GERMAN` in the script, or the script stops. Each run makes the folders new
and drops these pages' recorded heading ids from `content/anchors.json`, so the
next build records the ids of the commands that exist now. The hand-written pages
of the section are not touched.

## Languages

English is the default and lives at the root; German lives under `/de/`.
`src/i18n.ts` lists the languages with their prefix and holds the words of the
frame around the docs pages, section names included. `src/home.ts` holds the
words of the home page, whose layout, styles and script are in `src/home.html`;
the install notes in `src/install.ts` have one text per language. A language
gets pages only once it has every string in all three; until then the build
stops with the list of missing strings.

A translated docs page goes into `content/<code>/docs/` with the same path as
the English one, for example `content/de/docs/getting-started/docker.md`. Every
heading of a translated page keeps the English page's id with `{#id}`, so a
link to a heading reads the same in every language:

```markdown
## Mit dem Skript installieren {#install-with-the-script}
```

Links inside a translated page name the English address, `/docs/...`; the
build turns them into the German page's address. Every English page needs its German
version: the build stops and names each page that has none.

Every page lists its language versions with `hreflang`, plus `x-default` for
the English one, and its language switch leads to the same page in the other
language. Each language has its own home page, search index
(`docs.neode.sk/de/search.json`), 404 page on each host, Markdown copies and
link preview images (`/og/de/...`). The web server sends `/404.html` for every
address that does not exist; serving `/de/404.html` under `/de/` needs a rule
there, on each host. The llms
files stay in English: they are one set of files at the root for AI tools,
and every German page's Markdown copy is next to it as for English.

The German text says "du" to the reader. The console's own German says "Sie";
where a page quotes a console message, it quotes it as the console words it.

## What the build makes

- The docs index with every section, a page per section with its pages,
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
- `sitemap.xml`, `robots.txt`, `404.html` and `de/404.html` for each host.

## Checks

The build checks the pages as it reads them and the files it wrote to
`dist/`, and stops when one fails:

- Links: every link between docs pages, every heading a link names, and every
  screenshot exist.
- The old name: no BetterDesk, betterdesk, trybetterdesk, betterde.sk or
  UNITRONIX in the built pages, `.md` copies, llms files, search index,
  scripts, styles and SVGs, and no old image path
  (`ghcr.io/<owner>/betterdesk...`). `OLD_NAME_ALLOW` in `src/checks.ts` lists
  the only sentences that may name them, each on its own page, in English and
  German: the notices on the license page and the copyright policy on the
  contributing page. When one of those sentences changes, change it there too.
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
- Buttons: every button has an aria-label or text of its own. Text inside a
  child element does not count, because the styles may hide it: the search
  button shows only its icon on small screens.
- Indexing: on neode.sk, each host's `robots.txt` allows everything and names each AI
  crawler in `aiCrawlers` in `site.config.ts` as allowed, and only the 404 page
  says noindex. A build for any other address, such as beta.neode.sk, puts
  noindex on every page (the beta's web server also sends
  `X-Robots-Tag: noindex`).
- Languages: `<html lang>` matches the page's address, every page links to
  itself and to `x-default` with `hreflang`, and every language version it
  names exists and names it back. A language with pages must have all its
  strings. Every page of the English site has its German version at the same
  address under `/de/` (the `/og/` contact sheet excepted).
- Structured data: the home page has a JSON-LD SoftwareApplication with name,
  license, operating systems, version and download address; every docs page a
  TechArticle with `dateModified` and a BreadcrumbList that ends at the page.
  The two sitemaps together list every page that has a canonical address,
  each on its own host's sitemap, each with
  `lastmod`: a page's date is the last commit of its file, a list's the newest
  of its pages. Without git history (a shallow clone) every date is the same
  commit, so CI needs the full history.
- Heading ids: see [Heading ids](#heading-ids).
- Install commands: every command in `src/install.ts`, which the landing page
  and llms.txt show, is in a code block of the same language on its docs
  page. The landing page's list of client ports comes from the table on the
  ports page: the rows RustDesk clients connect to that say Yes under "Open to
  the internet".
- SEO: every page has a title of at most 60 characters that no other page in
  its language has, a meta description of at most 155, exactly one h1, no
  skipped heading level, a canonical link (the 404 page excepted), alt, width
  and height on every image, a WebP version of every PNG, a preloaded WOFF2
  font and only WOFF2 in `@font-face`. Every link, file and anchor inside the
  site exists, and every page is linked from another one. A section whose
  intro is longer than 155 characters gets a `description` in
  `site.config.ts`.
- Link previews: every page that may be indexed has og:title, og:description,
  og:url (its canonical address), og:type, og:image with width, height and
  alt, og:site_name, og:locale and `twitter:card` summary_large_image. Its
  image exists, is a PNG of 1200 by 630 under 300 KB, and is its own; no two
  pages share a title. The title on the image fits in three lines and stays
  inside its box, measured as resvg draws it.
- "Copy as Markdown": every docs page and section page has it next to the
  h1, a plain link to the page's own `.md` copy, which must exist. With
  scripts a click copies the Markdown; without them the link opens it.
- Files for AI tools: llms.txt starts with "For AI agents", lists every
  `llms-*.txt` with its size in KB, every page is in exactly one section file,
  and no agent tool that is not available is named anywhere.
- Commands (`src/commands.ts`): every block has a language, no block has a
  shell prompt (`$ `, `PS C:\>`), a command the text asks the reader to run is
  in a block of its own, and placeholders follow the rule under [Code](#code).
  The inline code of a page with `quoted: true` is NeoDesk's own and exempt.

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
- `fold: true` on a page with children lists the children in the sidebar only
  on that page and its children; the section page and the docs index leave them
  out. The command reference uses it for its 60 pages.
- `quoted: true` says the page quotes NeoDesk's own help text, so its inline
  code may keep NeoDesk's placeholders (`--file PATH`, `{id}`); see [Code](#code).
  Only the generated command reference needs it.

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
