---
title: Befehlsreferenz
description: Alle Befehle der Kommandozeile neodesk nach Gruppen, die Flags, die jeder Befehl kennt, ihre Umgebungsvariablen und ihre Exit-Codes.
order: 9
fold: true
quoted: true
---

Die Referenz aller Befehle der Kommandozeile neodesk, erzeugt aus der Befehlstabelle des Releases 3.6.0-rc.4: 532 Befehle in 59 Gruppen. Jede Gruppe hat eine Seite mit ihren Befehlen, deren Argumenten und Flags, der Berechtigung, die jeder braucht, und der Route der Konsole, die er aufruft.

Der Text unten und auf den Seiten der Gruppen steht auf Englisch, so wie die Kommandozeile selbst ihn mit `--help` zeigt.

The command line of NeoDesk: every action of the web console, on top of API tokens.

```bash quoted
neodesk <group> <action> [arguments] [flags]
neodesk <group> --help
neodesk login --url https://desk.example.com
```

The command line is the server binary: called `neodesk` (the Docker images have that name), or `neodesk-server cli`. Sign in once with an API token. Make one in the console: account menu, API tokens. A token can do only what its permissions and its account allow, and a read-only token only reads.

## API tokens

Make a token in the console: account menu, API tokens. The console shows it once. A token:

- holds at most the permissions of the account that made it, now and later: when the account loses a permission or is disabled, the token loses it too
- can be read only, expires after at most a year, and can be limited to some addresses or networks
- never signs in, changes its own account or shows the console's API key
- passes checks by role, changes accounts and access, and keeps server.config only when it carries every permission of its account
- reaches the server's secrets (the full backup and restore, the server's files, the advanced settings files, where scheduled backups go) only when it carries every permission of its account and may write

The address list checks the address the console sees. Behind a reverse proxy, set TRUST_PROXY to the proxy's address rather than true, and keep the console's port closed to everyone else. Otherwise a client can name any address in X-Forwarded-For.

For an AI agent, `neodesk mcp` serves the commands as MCP tools: read only, without the commands that show secrets or run something, unless you allow them. Give the agent a token of its own with only the permissions it needs.

## Groups

| Group | What it is for | Commands |
|---|---|---|
| [account](/docs/command-line/reference/account) | You: the account and permissions the token acts with | 3 |
| [activity](/docs/command-line/reference/activity) | What people did on devices: the activity agents report | 3 |
| [agents](/docs/command-line/reference/agents) | NeoDesk agent releases, templates and installer files | 7 |
| [api-tokens](/docs/command-line/reference/api-tokens) | API tokens for scripts, this command line and AI agents | 4 |
| [attestation](/docs/command-line/reference/attestation) | The server's performance test and its badge | 6 |
| [audit](/docs/command-line/reference/audit) | The audit log and the security overview | 4 |
| [automation](/docs/command-line/reference/automation) | Alert rules, alerts, queued device commands and alert mail | 13 |
| [backups](/docs/command-line/reference/backups) | Full backups, the backup schedule and restores | 10 |
| [billing](/docs/command-line/reference/billing) | Billing: packages, contracts, sessions, reports and the clock | 27 |
| [branding](/docs/command-line/reference/branding) | The console's look: logo, colors, profiles and fonts | 17 |
| [cdap](/docs/command-line/reference/cdap) | CDAP devices, their widgets and commands | 10 |
| [cdap-studio](/docs/command-line/reference/cdap-studio) | CDAP Studio flows | 10 |
| [chat](/docs/command-line/reference/chat) | Chat search and files | 2 |
| [client-branding](/docs/command-line/reference/client-branding) | Name, logo and links the desktop clients show | 2 |
| [cross-platform](/docs/command-line/reference/cross-platform) | What each device platform supports | 3 |
| [dashboard](/docs/command-line/reference/dashboard) | The numbers on the dashboard and the server status | 6 |
| [dataguard](/docs/command-line/reference/dataguard) | Data guard policies and the events devices report | 7 |
| [device-control](/docs/command-line/reference/device-control) | Screen, keyboard, mouse, clipboard and terminal of a NeoDesk agent | 7 |
| [device-files](/docs/command-line/reference/device-files) | Files on a device with a NeoDesk agent | 6 |
| [device-groups](/docs/command-line/reference/device-groups) | Device groups (manual and by tag) | 3 |
| [device-tokens](/docs/command-line/reference/device-tokens) | Tokens that let a new device join without approval | 6 |
| [devices](/docs/command-line/reference/devices) | Devices: list, details, notes, tags, bans, connection settings | 27 |
| [enrollment](/docs/command-line/reference/enrollment) | Who may join, and devices waiting for approval | 7 |
| [fleet](/docs/command-line/reference/fleet) | Fleet tasks, workflows, compliance and resources | 23 |
| [folders](/docs/command-line/reference/folders) | Folders that sort devices | 6 |
| [generator](/docs/command-line/reference/generator) | The support client generator: bundles and builds | 18 |
| [guest-links](/docs/command-line/reference/guest-links) | Guest links that let someone without an account connect | 3 |
| [help-requests](/docs/command-line/reference/help-requests) | Help requests sent from devices | 3 |
| [inventory](/docs/command-line/reference/inventory) | Hardware and software inventory of devices | 2 |
| [invites](/docs/command-line/reference/invites) | Invites that add a computer to this server | 6 |
| [keys](/docs/command-line/reference/keys) | The server's key, the client settings and the QR code | 6 |
| [languages](/docs/command-line/reference/languages) | The console's languages and translations | 9 |
| [mesh](/docs/command-line/reference/mesh) | MeshCentral devices, groups and recordings | 16 |
| [network](/docs/command-line/reference/network) | Network checks: targets, monitoring, ping and port tests | 15 |
| [organizations](/docs/command-line/reference/organizations) | Organizations with their users, devices and settings | 26 |
| [pairing](/docs/command-line/reference/pairing) | Pairing codes for agents | 5 |
| [panel-access](/docs/command-line/reference/panel-access) | Which console sections and client features each account may use | 5 |
| [policies](/docs/command-line/reference/policies) | Organization policies and device attestation | 10 |
| [registrations](/docs/command-line/reference/registrations) | Devices that asked to register | 7 |
| [remote](/docs/command-line/reference/remote) | Remote sessions in progress | 1 |
| [remote-targets](/docs/command-line/reference/remote-targets) | RDP, VNC and SSH targets | 11 |
| [reports](/docs/command-line/reference/reports) | Reports and trends | 8 |
| [resource-control](/docs/command-line/reference/resource-control) | USB, disks, monitors and quotas on devices | 10 |
| [restart](/docs/command-line/reference/restart) | Pending server restarts after a change | 6 |
| [roles](/docs/command-line/reference/roles) | Roles and their permissions | 5 |
| [scaling](/docs/command-line/reference/scaling) | Relay servers and scaling rules | 12 |
| [server](/docs/command-line/reference/server) | The server: health, versions, resources, services and logs | 15 |
| [settings](/docs/command-line/reference/settings) | Server settings: mail, sign-in, addresses, enrollment, sessions | 28 |
| [setup-guide](/docs/command-line/reference/setup-guide) | The setup guide a new install shows its first admin on the overview | 3 |
| [strategies](/docs/command-line/reference/strategies) | Strategies: settings pushed to desktop clients | 7 |
| [support](/docs/command-line/reference/support) | Quick support sessions | 7 |
| [tags](/docs/command-line/reference/tags) | Device tags | 3 |
| [tenants](/docs/command-line/reference/tenants) | Tenants with their devices and users | 12 |
| [tickets](/docs/command-line/reference/tickets) | Tickets with comments and attachments | 11 |
| [toolkit](/docs/command-line/reference/toolkit) | Small network and text tools | 8 |
| [transfers](/docs/command-line/reference/transfers) | File transfers between the console and devices | 5 |
| [updates](/docs/command-line/reference/updates) | Server updates and the backups taken before them | 16 |
| [user-groups](/docs/command-line/reference/user-groups) | User groups | 4 |
| [users](/docs/command-line/reference/users) | Console accounts: create, change, disable, delete | 10 |

## Commands of the command line itself

| Command | What it does |
|---|---|
| `neodesk api` | Send any request to the console's API: neodesk api GET /api/stats |
| `neodesk completion` | Print a shell completion script: bash, zsh, fish or powershell |
| `neodesk config` | Show where the settings come from (never the token) |
| `neodesk describe` | Print every command with its arguments and permissions, as JSON or Markdown |
| `neodesk help` | Show help for a group or command: neodesk help devices list |
| `neodesk local` | Run a command of the server binary on this machine (backup, migrate, ...) |
| `neodesk login` | Save the console's address and an API token for the next commands |
| `neodesk logout` | Forget the saved token (--revoke also revokes it on the console) |
| `neodesk mcp` | Serve the commands as tools to an AI agent over MCP (stdio); read only unless --allow-writes |
| `neodesk version` | Print this command line's version (the server's: neodesk server info) |
| `neodesk whoami` | Show the account and the token the commands use |

## Flags for every command

| Flag | What it does |
|---|---|
| `--url URL` | the console's address (or NEODESK_URL) |
| `--token-file FILE` | read the API token from a file (or NEODESK_TOKEN) |
| `--token TOKEN` | the API token; it shows in the process list, so prefer NEODESK_TOKEN or the config file |
| `--config FILE` | the config file (or NEODESK_CONFIG); default neodesk/config.json in the user's config folder |
| `--json` | print the server's answer as JSON |
| `-o, --output FILE` | save the answer to a file (downloads) |
| `-q key=value` | add a query parameter; repeat for more |
| `-f key=value` | add a text field to the request body |
| `-F key=json` | add a JSON value to the request body: a number, true or false, a list |
| `--data JSON` | the whole request body, or @file.json |
| `--file PATH` | the file to upload, for commands that take one |
| `-y, --yes` | do not ask before deleting or ending something |
| `--insecure` | do not check the console's certificate |
| `--ca-cert FILE` | trust this CA certificate for the console (or NEODESK_CA_CERT) |
| `--allow-http` | allow plain HTTP to another machine (or NEODESK_ALLOW_HTTP=1); the token is not encrypted then |
| `--timeout 60s` | how long to wait for an answer |
| `-v, --verbose` | print each request's method, address and status to standard error |
| `-h, --help` | help for the command |

## Environment

| Variable | What it is |
|---|---|
| `NEODESK_URL` | the console's address |
| `NEODESK_TOKEN` | the API token |
| `NEODESK_CONFIG` | the config file |
| `NEODESK_CA_CERT` | a CA certificate to trust for the console |
| `NEODESK_ALLOW_HTTP` | 1 allows plain HTTP to another machine |

## Exit codes

| Code | Meaning |
|---|---|
| 0 | done |
| 1 | the server said no for another reason, or something unexpected went wrong |
| 2 | wrong command, argument or flag |
| 3 | no token, or the token was refused (HTTP 401) |
| 4 | the account or the token may not do this (HTTP 403) |
| 5 | nothing has that ID or address (HTTP 404) |
| 6 | the server refused the input or it clashes with what is there (HTTP 400, 409, 413, 422) |
| 7 | too many requests, try again later (HTTP 429) |
| 8 | the server failed (HTTP 5xx) |
| 9 | the console could not be reached, or its certificate was refused |
| 10 | the config file cannot be used |

The routes the command line leaves out are in [Routes without a command](/docs/command-line/reference/routes-left-out).
