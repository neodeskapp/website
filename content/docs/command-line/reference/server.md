---
title: neodesk server
description: 15 commands. The server: health, versions, resources, services and logs.
order: 47
quoted: true
---

The server: health, versions, resources, services and logs.

`neodesk server --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk server addresses

Show the addresses the server gives clients.

```text quoted
neodesk server addresses [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/server-info`.

## neodesk server containers

List the Docker containers on the machine.

```text quoted
neodesk server containers [flags]
```

Needs server.config; only reads. Calls `GET /api/docker/containers`.

## neodesk server database

Show the database: size and rows per table.

```text quoted
neodesk server database [flags]
```

Needs server.config; only reads. Calls `GET /api/database/stats`.

## neodesk server exec

Run one of the allowed diagnostic commands on the server, like uptime.

```text quoted
neodesk server exec --command COMMAND [flags]
```

| Flag | What it is |
|---|---|
| `--command COMMAND` | the command: uptime, df, free and the like (required) |

Needs server.config; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/system/exec`.

## neodesk server file

Read a file on the server (read only).

```text quoted
neodesk server file [flags]
```

| Flag | What it is |
|---|---|
| `--path PATH` | the file |

Needs server.config; only reads; the answer holds secrets or private content. Calls `GET /api/server-management/files/read`.

## neodesk server files

List a folder on the server (read only).

```text quoted
neodesk server files [flags]
```

| Flag | What it is |
|---|---|
| `--path PATH` | the folder |

Needs server.config; only reads. Calls `GET /api/server-management/files`.

## neodesk server health

Check that the console answers.

```text quoted
neodesk server health [flags]
```

Needs a signed-in account; only reads. Calls `GET /health`.

## neodesk server info

Show the versions, the server's status and its paths.

```text quoted
neodesk server info [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/settings/info`.

## neodesk server logs

Show the console's recent log lines.

```text quoted
neodesk server logs [flags]
```

| Flag | What it is |
|---|---|
| `--limit N` | how many lines (default 50) |

Needs server.config; only reads. Calls `GET /api/logs/recent`.

## neodesk server machine

Show the machine the server runs on.

```text quoted
neodesk server machine [flags]
```

Needs server.config; only reads. Calls `GET /api/server-management/info`.

## neodesk server resources

Show CPU, memory and disk use.

```text quoted
neodesk server resources [flags]
```

Needs server.config; only reads. Calls `GET /api/server-management/resources`.

## neodesk server service

Start, stop or restart a system service.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk server service <name> <action> [flags]
```

| Argument | What it is |
|---|---|
| `<name>` | The service (see server services) |
| `<action>` | start, stop or restart |

Needs server.config; changes something: needs a token with read and write access; runs something on a device or the server. Calls `POST /api/server-management/services/{name}/{action}`.

## neodesk server services

List the system services NeoDesk uses.

```text quoted
neodesk server services [flags]
```

Needs server.config; only reads. Calls `GET /api/server-management/services`.

## neodesk server speed-test

Download test data to measure the speed to the console.

```text quoted
neodesk server speed-test [flags]
```

| Flag | What it is |
|---|---|
| `--size N` | megabytes (default 1) |

Needs metrics.view; only reads. Calls `GET /api/speed-test`.

## neodesk server system

Show the machine: system, memory, disks, processes.

```text quoted
neodesk server system [flags]
```

Needs metrics.view; only reads. Calls `GET /api/system/info`.
