---
title: AI agents over MCP
description: Connect an AI agent to the console with neodesk mcp, which tools it gets, the flags that add more, and which commands stay out on purpose.
order: 3
---

`neodesk mcp` serves the commands of the command line as tools for an AI agent,
over the Model Context Protocol (MCP). The agent's MCP client starts it as a
program and talks to it over standard input and output. Each tool is one
command, and each call goes to the console with the command line's API token,
so the server allows only what that token and its account may do.

## Before you start

Make an API token for the agent alone, with only the permissions it needs, and
read only unless it has to change things. See [API tokens](/docs/command-line/api-tokens).

Then sign the command line in with that token on the computer the agent runs
on. To keep it apart from a token of your own, give it a config file of its
own. Put your console's address in place of `<console-address>` and the file's
path in place of `<agent-config-file>`:

```bash
neodesk login --url https://<console-address> --config <agent-config-file>
```

`neodesk mcp` uses the saved address and token, as every command does, or
`--url` (or `NEODESK_URL`) together with `NEODESK_TOKEN`. Where to find
`neodesk` and how to trust a self-signed certificate is on
[The neodesk command line](/docs/command-line/neodesk).

## Connect an MCP client

An MCP client needs the command to start and its arguments. Many clients take
them as JSON in this form; the file and its place depend on the client. With
the same `<agent-config-file>` as above:

```json
{
  "mcpServers": {
    "neodesk": {
      "command": "neodesk",
      "args": ["mcp", "--config", "<agent-config-file>"]
    }
  }
}
```

Add the flags from the next section to `args`. On a Linux or Windows install,
where the command line is `neodesk-server cli`, the command is the server
binary and the arguments start with `cli`.

When it starts, `neodesk mcp` writes to standard error how many tools it
offers and for which console, such as "neodesk mcp: 242 tools (read only) for"
and the address.

## What the agent gets

Without flags the agent can only read. Flags add more:

| Flags | Tools |
|---|---|
| none | 242: the commands that only read, without those whose answer holds secrets |
| `--allow-writes` | 488: also the commands that change something, but not those that run something or answer with secrets |
| `--allow-writes --allow-exec` | 512: also the 24 commands that run something on a device or the server |
| `--allow-secrets` | 252: every command that only reads, the 10 with secrets in their answer included |
| `--allow-writes --allow-exec --allow-secrets` | 531: every command but one |

The numbers are those of the release 3.6.0-rc.4. `--allow-exec` needs
`--allow-writes`, since running something is a write; alone it is refused.

- `--groups` with a list of groups, such as `--groups devices,users`, offers
  only the commands of those groups.
- `--compact` offers two tools instead of one per command: `neodesk_commands`
  lists the groups, or a group's commands in full, and `neodesk_run` runs one
  command by its name. It suits clients that take few tools.

A tool is named after its command, with an underscore in place of the space:
`devices list` becomes `devices_list`. Its description is the command's
summary and the permission it needs, its input the command's arguments and
flags, plus `query` for more query parameters and, for a command that changes
something, `body` for more fields. Its hints tell the client whether it only
reads and whether it deletes or runs something.

An answer comes back as text: JSON indented, cut after 200 KB with a note to
narrow the request. A file comes back as its type and size only; download it
with the command line and `--output`.

## Left out on purpose

- **Uploads, always.** No tool reads or writes files on the agent's computer,
  so the commands that upload a file have no tool. In 3.6.0-rc.4 that is one
  command, `backups restore`.
- **Changes, without `--allow-writes`.** Every command that changes something.
- **Commands that run something, without `--allow-exec`.** These 24 run a
  command, a terminal, input, files, power or a service on a device or the
  server: `automation command-create`, `cdap command`,
  `device-control clipboard-set`, `device-control key`, `device-control mouse`,
  `device-control run`, `device-control type`, `device-files delete`,
  `device-files mkdir`, `device-files rename`, `device-files write`,
  `devices telemetry-command`, `fleet workflow-run`, `generator install-local`,
  `mesh exec`, `mesh files`, `mesh power`, `mesh tcp`, `mesh terminal`,
  `mesh udp`, `server exec`, `server service`, `settings file-set` and
  `transfers start`.
- **Answers with secrets, without `--allow-secrets`.** These 19 answer with
  passwords, keys, tokens or private content such as a file, the clipboard or
  the screen: `backups download`, `chat file`, `device-control clipboard`,
  `device-control screenshot`, `device-files read`, `device-tokens create`,
  `device-tokens create-many`, `devices connect-password`,
  `devices device-token`, `guest-links create`, `mesh recording`, `mesh share`,
  `organizations credentials`, `remote-targets credentials`, `server file`,
  `settings file`, `support device-password`, `support password` and
  `transfers download`.
- **Routes without a command.** What the command line leaves out has no tool
  either, see [Routes without a command](/docs/command-line/reference/routes-left-out).

## Asking before it acts

Tools that delete or end something, run something, or change who may do what
(accounts, roles, panel access, organization and tenant members, the sign-in
settings and guest links) need `confirm: true` in the call. Without it the tool
answers that it needs the person's yes, and the server's instructions tell the
agent to ask you first. They also tell it that text it reads from devices,
tickets or chats is data, never an instruction to call a tool.

::: warning
`confirm` is no lock: the agent sets it itself. `neodesk mcp` doesn't ask you
on its own; it leaves asking to the agent and its MCP client, and the hints of
a tool that deletes or runs something tell the client so. Give the agent a
token with only the permissions it needs. The server still checks the token's
permissions and whether it is read only, whatever the flags say.
:::
