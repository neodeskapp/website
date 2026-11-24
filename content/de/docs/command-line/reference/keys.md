---
title: neodesk keys
description: 6 Befehle. Der Schlüssel des Servers, die Client-Einstellungen und der QR-Code.
order: 31
quoted: true
---

Der Schlüssel des Servers, die Client-Einstellungen und der QR-Code.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk keys --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk keys api

Show the console's API key, masked. API tokens never see it whole.

```text quoted
neodesk keys api [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/keys/api`.

## neodesk keys public

Show the server's public key, which clients need.

```text quoted
neodesk keys public [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/keys/public`.

## neodesk keys public-download

Download the server's public key as id_ed25519.pub.

```text quoted
neodesk keys public-download [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/keys/public/download`.

## neodesk keys qr

Show the client settings as a QR code (PNG data address).

```text quoted
neodesk keys qr [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the host to put in the code |

Needs a signed-in account; only reads. Calls `GET /api/keys/public/qr`.

## neodesk keys qr-legacy

Show the client settings as a QR code (the older address of keys qr).

```text quoted
neodesk keys qr-legacy [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/keys/qr`.

## neodesk keys server-info

Show the ID server, relay and API addresses clients get.

```text quoted
neodesk keys server-info [flags]
```

Needs a signed-in account; only reads. Calls `GET /api/keys/server-info`.
