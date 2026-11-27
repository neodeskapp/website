---
title: neodesk attestation
description: 6 commands. The server's performance test and its badge.
order: 5
quoted: true
icon: speed
---

The server's performance test and its badge.

`neodesk attestation --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk attestation abort

Stop the running performance test.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk attestation abort [flags]
```

Needs server.attestation; changes something: needs a token with read and write access; deletes or ends something for good, so it asks first unless --yes is given. Calls `POST /api/server-attestation/abort`.

## neodesk attestation badge

Show the settings of the performance badge.

```text quoted
neodesk attestation badge [flags]
```

Needs server.attestation; only reads. Calls `GET /api/server-attestation/badge-config`.

## neodesk attestation badge-set

Change the settings of the performance badge.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk attestation badge-set [flags]
```

Needs server.attestation; changes something: needs a token with read and write access. Calls `PUT /api/server-attestation/badge-config`.

## neodesk attestation result

Show the result of the last performance test.

```text quoted
neodesk attestation result [flags]
```

Needs server.attestation; only reads. Calls `GET /api/server-attestation/result`.

## neodesk attestation run

Run the performance test of this server.

Give the request body with -f key=value (text), -F key=json (numbers, true or false, lists) or --data JSON (or --data @file.json). The answer to a wrong body names what is missing.

```text quoted
neodesk attestation run [flags]
```

Needs server.attestation; changes something: needs a token with read and write access. Calls `POST /api/server-attestation/run`.

## neodesk attestation status

Show how far the running performance test got.

```text quoted
neodesk attestation status [flags]
```

Needs server.attestation; only reads. Calls `GET /api/server-attestation/status`.
