---
title: neodesk remote
description: 1 Befehl. Laufende Fernsitzungen.
order: 40
quoted: true
---

Laufende Fernsitzungen.

Die Befehle stehen hier auf Englisch, so wie die Kommandozeile sie mit `neodesk remote --help` zeigt. Die Flags, die jeder Befehl kennt, stehen in der [Befehlsreferenz](/docs/command-line/reference#flags-for-every-command).

## neodesk remote sessions

List remote sessions that run now.

```text quoted
neodesk remote sessions [flags]
```

Needs device.connect; only reads. Calls `GET /api/remote/sessions`.
