---
title: neodesk remote
description: 1 command. Remote sessions in progress.
order: 40
quoted: true
icon: desktop_windows
---

Remote sessions in progress.

`neodesk remote --help` lists the same commands in the terminal. The flags every command takes are in the [command reference](/docs/command-line/reference#flags-for-every-command).

## neodesk remote sessions

List remote sessions that run now.

```text quoted
neodesk remote sessions [flags]
```

Needs device.connect; only reads. Calls `GET /api/remote/sessions`.
