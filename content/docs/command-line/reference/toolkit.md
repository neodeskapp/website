---
title: neodesk toolkit
description: 8 commands. Small network and text tools.
order: 56
quoted: true
icon: handyman
---

Small network and text tools.

`neodesk toolkit --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk toolkit base64

Encode text as base64, or decode it.

```text quoted
neodesk toolkit base64 --text TEXT [flags]
```

| Flag | What it is |
|---|---|
| `--text TEXT` | the text (required) |
| `--mode encode\|decode` | encode (default) or decode |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/base64`.

## neodesk toolkit dns

Show the A, AAAA, MX, TXT and NS records of a domain.

```text quoted
neodesk toolkit dns --domain DOMAIN [flags]
```

| Flag | What it is |
|---|---|
| `--domain DOMAIN` | the domain (required) |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/whois`.

## neodesk toolkit hash

Make the hash of a text.

```text quoted
neodesk toolkit hash --text TEXT [flags]
```

| Flag | What it is |
|---|---|
| `--text TEXT` | the text (required) |
| `--algorithm md5\|sha1\|sha256\|sha512` | md5, sha1, sha256 or sha512 |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/hash`.

## neodesk toolkit jwt-decode

Show the header and payload of a JSON web token.

```text quoted
neodesk toolkit jwt-decode --jwt JWT [flags]
```

| Flag | What it is |
|---|---|
| `--jwt JWT` | the token (required) |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/jwt-decode`.

## neodesk toolkit password

Make a random password.

```text quoted
neodesk toolkit password [flags]
```

| Flag | What it is |
|---|---|
| `--length N` | how many characters (default 16) |
| `--symbols` | use symbols too |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/password`.

## neodesk toolkit ssl

Show the certificate a server presents.

```text quoted
neodesk toolkit ssl --host HOST [flags]
```

| Flag | What it is |
|---|---|
| `--host HOST` | the host (required) |
| `--port N` | the port (default 443) |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/ssl`.

## neodesk toolkit urlencode

Encode text for an address, or decode it.

```text quoted
neodesk toolkit urlencode --text TEXT [flags]
```

| Flag | What it is |
|---|---|
| `--text TEXT` | the text (required) |
| `--mode encode\|decode` | encode (default) or decode |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/urlencode`.

## neodesk toolkit wake

Send a wake-on-LAN packet.

```text quoted
neodesk toolkit wake --mac MAC [flags]
```

| Flag | What it is |
|---|---|
| `--mac MAC` | the network card, like aa:bb:cc:dd:ee:ff (required) |
| `--broadcast BROADCAST` | the broadcast address, like 192.168.1.255 |

Needs device.connect; changes something: needs a token with read and write access. Calls `POST /api/toolkit/wol`.
