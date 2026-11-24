---
title: The neodesk command line
description: Where the neodesk command is, signing in with an API token, the first commands to run, tables or JSON, and the exit codes scripts can test for.
order: 1
---

`neodesk` does from a terminal what the web console does: devices, users,
settings, backups and the rest. It signs in with an API token and talks to the
console's address, as your browser does, so it runs on the server or on your
own computer. This page gets you started; the
[command reference](/docs/command-line/reference) lists every command.

## Where to find it

The command line is part of the server binary. It runs when the program is
called `neodesk`, or as `neodesk-server cli` under any name.

In the Docker image the command is `neodesk`. Run it in the container:

```bash
docker compose exec neodesk neodesk --help
```

On a Linux install, `neodesk` is the installer's own manager,
`/usr/local/sbin/neodesk`, so use the server binary with `cli`. Its folder is
open to root and the service only:

```bash
sudo /opt/neodesk/neodesk-server cli --help
```

On a Windows install:

```powershell
& 'C:\NeoDesk\neodesk-server.exe' cli --help
```

On your own computer, download the server binary for its system from the
[releases on GitHub](https://github.com/neodeskapp/neodesk/releases): Linux on
amd64, arm64 and armv7, or Windows on amd64. Save it as `neodesk`, or
`neodesk.exe` on Windows, and on Linux make it executable. There is no build
for macOS.

The examples below write `neodesk`. On a Linux or Windows install, put the
command above in its place.

## Sign in

Make an API token in the console first, see
[API tokens](/docs/command-line/api-tokens). Then sign in:

```bash
neodesk login --url https://<console-address>
```

Put the address you open the console with in place of `<console-address>`.
`neodesk login` asks for the token and doesn't show it as you paste it. It
checks the token with the console, saves the address and the token for the
next commands, and prints the account and the token it signed in with. It
refuses a token given as an argument, since that would stay in your shell's
history; pipe one in from a file instead:

```bash
neodesk login --url https://<console-address> < token.txt
```

The settings go into `neodesk/config.json` in your user's config folder, such
as `~/.config` on Linux and `%AppData%` on Windows. The file is yours alone:
the command line refuses a config file that others may read or that another
account owns. The saved token is used only with the address it was saved for.

- `neodesk config` shows the file and where the address and the token come
  from. It never prints the token.
- `neodesk logout` forgets the token; with `--revoke` it revokes it on the
  console first.

### Certificates and plain HTTP

The command line checks the console's certificate and follows no redirects.

The Linux and Windows scripts give the console a self-signed certificate on
port 5443, which the command line refuses (exit code 9) until you trust it.
Give it the certificate file with `--ca-cert`, and `login` saves it with the
address. With your server's address in place of `<server-address>`, on the
Linux server:

```bash
sudo /opt/neodesk/neodesk-server cli login --url https://<server-address>:5443 \
  --ca-cert /opt/neodesk/ssl/neodesk.crt
```

On Windows the file is `C:\NeoDesk\ssl\neodesk.crt`. On another computer, copy
the file there first. `--insecure` skips the check for one command and is never
saved. Behind a reverse proxy with a certificate browsers trust, sign in with
the proxy's address and leave `--ca-cert` out.

Plain `http://` works only to the same machine, `localhost` or `127.0.0.1`. To
another machine it needs `--allow-http`, and the token then crosses the network
unencrypted. In Docker, on the server itself:

```bash
docker compose exec neodesk neodesk login --url http://127.0.0.1:5000
```

That sign-in is saved inside the container, so it is gone when the container
is made new, as at an update.

### In scripts

A script can name the address and the token on each call instead of signing
in. With the token in a file and your console's address in place of
`<console-address>`:

```bash
neodesk devices list --json \
  --url https://<console-address> --token-file token.txt
```

`NEODESK_URL` and `NEODESK_TOKEN` do the same as `--url` and `--token-file`. A
token from a flag or the environment is sent only to an address from a flag or
the environment, never to the saved one. `--token` also works, but shows the
token in the process list.

## First commands

Every command explains itself with `--help`: its arguments, flags, the
permission it needs and the console route it calls.

```bash
neodesk devices list --help
```

See who the command line acts as, what the token may do and when it expires:

```bash
neodesk whoami
```

Show the server's versions, status and paths:

```bash
neodesk server info
```

List the devices that are online:

```bash
neodesk devices list --status online
```

Show one device with all its details. Put a device ID from the list in place of
`<device-id>`:

```bash
neodesk devices get <device-id>
```

Make an invite that adds a computer, with a link and a code, like
[Add a computer](/docs/console/add-a-computer) in the console. It needs
**Approve enrollment** and a token with read and write access:

```bash
neodesk invites create --name "Reception PC"
```

Read the last 20 entries of the audit log, which needs **View audit logs**:

```bash
neodesk audit list --limit 20
```

On a new install, see which steps of the
[setup guide](/docs/getting-started/first-sign-in/setup-guide) are done:

```bash
neodesk setup-guide status
```

## Output

- A list prints as a table and a single record as `key: value` lines. Tables
  cut long values with "…".
- `--json` prints the server's whole answer as JSON, for scripts and `jq`.
- `--output` with a file name (or `-o`) saves the answer to that file, for
  downloads. The command line doesn't print a file to the terminal.
- Errors go to standard error, as `neodesk:`, the server's message and the HTTP
  status. With `--json` the server's error answer also goes to standard output.
- `-v` prints each request's method, address and status to standard error.

A command that deletes or ends something asks first. On a terminal it waits
for you to type `yes`; in a script it stops with exit code 2 unless you add
`--yes`.

## Exit codes

The exit codes stay the same between releases, so scripts can test for them:

| Code | Meaning |
|---|---|
| 0 | Done |
| 1 | The server said no for another reason, or something unexpected went wrong |
| 2 | Wrong command, argument or flag, or a command that asks first got no yes |
| 3 | No token, or the token was refused (HTTP 401) |
| 4 | The account or the token may not do this (HTTP 403) |
| 5 | Nothing has that ID or address (HTTP 404) |
| 6 | The server refused the input, or it clashes with what is there (HTTP 400, 409, 413, 422) |
| 7 | Too many requests, try again later (HTTP 429) |
| 8 | The server failed (HTTP 5xx) |
| 9 | The console could not be reached, or its certificate was refused |
| 10 | The config file can't be used |

## More commands of the command line itself

- `neodesk describe` prints every command with its arguments, flags, permission
  and route as JSON; `--format markdown` prints the same as Markdown, and a
  group's name after it limits it to that group.
- `neodesk api` sends any request to the console's API, for what no command
  covers, such as `neodesk api GET /api/stats`.
- `neodesk completion` prints a completion script for bash, zsh, fish or
  PowerShell.
- `neodesk local` runs the server binary's own commands on this machine, such
  as `backup`, `check` and `reset-password`. They read the server's files and
  need no token, so they only make sense where the server runs.

The [command reference](/docs/command-line/reference) has every command with
its flags, and the flags every command takes.
