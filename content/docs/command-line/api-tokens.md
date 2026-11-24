---
title: API tokens
description: Make a token for a script, the neodesk command line or an AI agent, pick its permissions, use it with neodesk or curl, and revoke it.
order: 2
---

An API token lets a script, the `neodesk` command line or an AI agent use the
console as your account, without a browser. It can do only what you picked for
it, and never more than your account can.

## Who can make tokens

Accounts with the role Super admin, Administrator, Global admin or Server admin
find **API tokens** in the account menu at the bottom of the sidebar. Other
accounts don't have the page.

Tokens are made in the console only, in a browser session. A token can't make
another token. An account can have at most 50 active tokens.

## Make a token

1. Open the account menu at the bottom of the sidebar and choose
   **API tokens**.
2. Choose **New token**.
3. Under **Name**, say what the token is for, like "Backup script". The name
   can be 80 characters long.
4. Under **Access**, choose **Read only** or **Read and write**. A read-only
   token can look at things but not change them.
5. Under **Permissions**, tick what the token may do. The list holds only the
   permissions your account has. **Select all** ticks them all, **Clear**
   none. Pick at least one.
6. Under **Expires**, choose **In 7 days**, **In 30 days**, **In 90 days**,
   **In 365 days** or **On a date**. A token lasts at most a year; a date means
   the end of that day in UTC.
7. Under **Allowed addresses**, list the addresses or networks the token may be
   used from, one per line, like `192.0.2.10` or `198.51.100.0/24`. Leave it
   empty to allow any address. The list takes 32 entries.
8. Choose **Make token**.

**Token made** shows the token once, with the warning "Copy the token now. It
is not shown again." Copy it there. Below it, the console shows the command
that signs the command line in with the token, with this console's address
filled in.

A token starts with `ndt_`, then 12 letters and digits that are its ID, an
underscore, and 40 more characters. The console keeps only a hash of it, so a
lost token can't be shown again: revoke it and make a new one.

## The permissions

These are the permissions the form offers, under the console's names and in
its order. The command reference names them by their short name, for example "Needs
device.ban".

| Permission | Short name |
|---|---|
| View devices | `device.view` |
| Connect to devices | `device.connect` |
| Create guest access links | `guest.create` |
| Edit devices | `device.edit` |
| Delete devices | `device.delete` |
| Ban and unban devices | `device.ban` |
| Change device ID | `device.change_id` |
| Change device connection mode | `device.connection_mode` |
| View RDP and VNC targets | `remote_target.view` |
| Connect to RDP and VNC targets | `remote_target.connect` |
| Add and edit RDP and VNC targets | `remote_target.edit` |
| Delete RDP and VNC targets | `remote_target.delete` |
| Test RDP and VNC targets | `remote_target.test` |
| View users | `user.view` |
| Create users | `user.create` |
| Edit users | `user.edit` |
| Delete users | `user.delete` |
| Create organizations | `org.create` |
| Edit organizations | `org.edit` |
| Delete organizations | `org.delete` |
| Manage organization users | `org.manage_users` |
| Manage organization devices | `org.manage_devices` |
| Manage enrollment | `enrollment.manage` |
| Approve enrollment | `enrollment.approve` |
| Chat access | `chat.access` |
| View audit logs | `audit.view` |
| View metrics | `metrics.view` |
| Edit blocklist | `blocklist.edit` |
| Server configuration | `server.config` |
| Manage API keys | `server.keys` |
| Run capacity tests | `server.attestation` |
| Edit appearance | `branding.edit` |
| View billing | `billing.view` |
| Manage billing packages and contracts | `billing.manage` |
| Write work reports | `billing.reports` |
| Export billing data | `billing.export` |
| View CDAP devices | `cdap.view` |
| Send CDAP commands | `cdap.command` |
| CDAP terminal access | `cdap.terminal` |
| CDAP file access | `cdap.files` |
| Terminal on MeshCentral agents | `mesh.terminal` |
| Files on MeshCentral agents | `mesh.files` |
| Power actions on MeshCentral agents | `mesh.power` |
| Terminal on NeoDesk agents | `agent.terminal` |
| Files on NeoDesk agents | `agent.files` |

**Server configuration** reaches the server's files and secrets, so a token
gets it only together with every other permission your account has. The form
refuses it alone: "A token gets server.config only together with all of your
permissions".

## What a token can do

A token acts as the account that made it, with less:

- It holds only the permissions picked for it, and each one only while the
  account still has it. When the account loses a permission, is disabled or is
  deleted, its tokens lose it at once.
- A read-only token only reads. Any request that would change something gets
  "This API token is read-only: it can only read".
- No token signs in or out, changes a password, a second factor or a session,
  changes its own account or profile, shows the console's API key in full, or
  makes another token.
- Some things need a full token, one that carries every permission its account
  has right now: checks that go by the account's role, changes to accounts,
  roles, user groups, panel access, organization and tenant members, and the
  sign-in settings (LDAP, OIDC, two-factor sign-in, enrollment). A token that is
  not full also loses **Server configuration**.
- The server's secrets need a full token with read and write access, even to
  read them: the full backup and restore, the server's files, the advanced
  settings files and where scheduled backups go.
- With an address list, a request from any other address is refused. The list
  checks the address the console sees. Behind a reverse proxy, set
  `TRUST_PROXY` to the proxy's address and keep the console's port closed to
  everyone else, see
  [Trusting the proxy](/docs/operations/reverse-proxy-tls#trusting-the-proxy).

One token may make 1,200 requests a minute. An address that sends 20 tokens
the console refuses within one of its 5-minute windows gets no token through
until that window ends. Both limits answer 429 with a `Retry-After` header.

The audit log records when a token is made and revoked, every change a token
makes, with its route and answer, and, once a minute per token, what the
console refused it.

::: warning
Guest links, device tokens and support passwords that a token made stay valid
after the token is revoked. Revoke or delete them on their own pages too.
:::

## Use it with the command line

The command line saves the console's address and the token once:

```bash
neodesk login --url https://<console-address>
```

Put your console's address in place of `<console-address>`, the one you open
in the browser. `neodesk login` asks for the token and doesn't show it as you
paste it. [The neodesk command line](/docs/command-line/neodesk) explains where
the command is, certificates and the first commands, and the
[command reference](/docs/command-line/reference) lists them all.

## Use it with curl

Send the token in the `Authorization` header to the console's address. With
the token in the variable `NEODESK_TOKEN` and your console's address in place
of `<console-address>`:

```bash
curl -H "Authorization: Bearer $NEODESK_TOKEN" https://<console-address>/api/panel/api-tokens/current
```

This answers with the token, the account it acts as, the permissions it has now
and `full`, which says whether it carries every permission of its account.
Every route the command line calls takes the token the same way; each command
in the [command reference](/docs/command-line/reference) names its route.

This lists the devices the token's account may see, which needs **View
devices**. Again with your console's address in place of `<console-address>`:

```bash
curl -H "Authorization: Bearer $NEODESK_TOKEN" https://<console-address>/api/devices
```

The answer is JSON with the devices in `data.devices` and how many there are in
`data.total`. Add `?status=online` to the address for only the devices that
are online.

The console reads a token only from that header. A token in the address, a
cookie or a form field is ignored, and the client API port, 21121, doesn't take
tokens. A request with a token signs in with it alone: the console ignores its
cookies.

When the console refuses a token, the answer is JSON with `error` and `code`:

| Status | `code` | Why |
|---|---|---|
| 401 | `token_invalid` | The token is unknown, expired or revoked, its account is disabled, or this address may not use it |
| 403 | `token_read_only` | A read-only token asked to change something |
| 403 | `token_not_allowed` | No token may do this, such as signing in or changing its own account |
| 429 | `token_rate_limited` | Too many requests, or too many refused tokens from this address |

### A self-signed certificate

The Linux and Windows installers give the console a self-signed certificate on
port 5443, and curl refuses it until you name it with `--cacert`. On the Linux
server only root and the service can read the file, so copy it first:

```bash
sudo cat /opt/neodesk/ssl/neodesk.crt > neodesk.crt
```

Then list the devices with your server's address in place of
`<server-address>`:

```bash
curl --cacert neodesk.crt -H "Authorization: Bearer $NEODESK_TOKEN" https://<server-address>:5443/api/devices
```

On Windows the file is `C:\NeoDesk\ssl\neodesk.crt`. To run curl on another
computer, copy the file there. Behind a reverse proxy with a certificate
browsers trust, use the proxy's address and leave `--cacert` out.

## See and revoke tokens

**API tokens** lists **Your tokens**: each token's name with its start,
`ndt_` and its ID, its access and allowed addresses, how many permissions it
has, when it expires, when and from where it was last used, and its status:
**Active**, **Expired** or **Revoked**. The list shows the active tokens; choose
**All** for the others. Super admins can tick **Every account's tokens** to see
the tokens of every account.

To revoke a token, open the menu at the end of its row and choose **Revoke**.
The console names the token and asks once more: "Scripts that use it stop
working right away. This can't be undone." Super admins can revoke any
account's token, everyone else only their own.

The command line revokes a token by its ID, the 12 characters after `ndt_`, as
`neodesk api-tokens revoke <id>`; `neodesk logout --revoke` revokes the token it
uses itself. See [neodesk api-tokens](/docs/command-line/reference/api-tokens).
