---
title: LDAP and Active Directory
description: Let people sign in to the console with their directory user name and password, and give them roles from their directory groups.
order: 4
icon: account_tree
---

With LDAP sign-in turned on, people from your directory sign in with their directory user name and password. Their account is made at the first sign-in, and their role comes from their directory groups at every sign-in. This works with Active Directory and other LDAP servers.

## Where it is set

Open **Settings**, **Directory (LDAP)**. In the sidebar the page is in the folded part of **Settings**: click **Show … more** there to reach it, or search for it. It is there for accounts with the **Change server settings** permission: Super admin, Administrator and Server admin by default.

The settings are saved in the server's database. There are no environment variables for them, and saving applies them to the next sign-in without a restart. People who are already signed in stay signed in.

## Settings

**Turn on LDAP sign-in** turns directory sign-in on and off. The other fields show either way. **Skip TLS verify** and **Connection timeout (s)** are under **Advanced options**, the attribute fields under **User attributes**.

| Setting | Meaning |
| --- | --- |
| **Host** | Host name or address of the directory server, such as `dc01.example.com`. |
| **Port** | `389` for plain LDAP and StartTLS, `636` for LDAPS. Ticking **LDAPS (TLS)** switches 389 to 636. |
| **LDAPS (TLS)** | Connect with TLS from the start. |
| **StartTLS** | Connect on the plain port, then switch to TLS. Has no effect when LDAPS is ticked. |
| **Skip TLS verify** | Under **Advanced options**. Do not check the server's certificate. Only for tests. |
| **Connection timeout (s)** | Under **Advanced options**. Seconds to wait for the connection to the directory, and for each of its answers. Default 10. A whole sign-in waits at most 30 seconds; see [How long a sign-in waits](#how-long-a-sign-in-waits). |
| **Direct bind** | Sign in by building the user's DN from a template instead of searching for it with a service account. |
| **Bind DN (service account)** | A read-only account the server signs in with to search for users. |
| **Bind password** | Its password. A saved password shows as dots; leave them to keep it. |
| **Base DN** | Where the search for users starts, such as `dc=example,dc=com`. Needed unless Direct bind is ticked. |
| **User filter** | The search for the user, with `{{username}}` for the name typed at sign-in. Default `(sAMAccountName={{username}})`. |
| **Direct bind DN template** | With Direct bind: the user's DN with `{{username}}`, such as `uid={{username}},ou=users,dc=example,dc=com`. |
| **User name attribute** | Under **User attributes**. Its value, in lower case, becomes the account name. Default `sAMAccountName`. |
| **Email attribute**, **Display name attribute** | Default `mail` and `displayName`. Their values are stored with the account at every sign-in; the email address shows in the **Email** column of the Users page. |
| **Group base DN** | Where a group search starts. Empty means the Base DN. |
| **Group filter** | The group search, with `{{dn}}` for the user's DN and `{{username}}` for the account name. Default `(member={{dn}})`. |
| **Group name attribute** | The attribute the group search asks for. Default `cn`. |
| **Auto-create users** | On by default: a person the directory accepts gets an account at their first sign-in. Off: only people who already have a directory account here can sign in through the directory. |
| **Default role** | The role for people none of whose groups is in the map. The choice lists every role of the server, from **Super admin** to **Pro license (client API only)**; see the [roles table](/docs/people/users-and-roles#roles). |
| **Group to role map** | Directory groups and the role each gives (see below). |

For OpenLDAP and similar servers, set **User filter** to something like `(uid={{username}})` and **User name attribute** to `uid`.

::: warning
**Super admin** and **Administrator** have every permission. With one of them in **Default role**, every person the directory accepts gets full control of the server. **Server admin** and **Global admin** there give everyone server settings or all users and devices.
:::

## Accounts from the directory

The first time someone signs in with directory credentials, the server makes an account with the **LDAP/AD** tag, named after the **User name attribute** in lower case. While **Auto-create users** is on, anyone the **User filter** finds and the directory accepts gets an account. To let in only one group, put it in the filter:

```text
(&(sAMAccountName={{username}})(memberOf=CN=NeoDesk Users,OU=Groups,DC=example,DC=com))
```

Things to know about directory accounts:

- The directory checks the password at every sign-in. The console keeps no usable password for these accounts and has no password field for them.
- People can type their user name in any letter case. The account name is always in lower case, and every spelling signs in to the same account.
- If a password account with the same name already exists, the directory sign-in is refused with "A local account with this username already exists. Sign in with your local password, or ask an administrator to rename or remove the conflicting account." Delete the password account first if the person should sign in through the directory.
- While **Auto-create users** is on, deleting a directory account on the Users page does not stop the person: their next sign-in makes a new account. To keep someone out, choose **Disable account…** in the row menu instead (see [Disable an account](/docs/people/users-and-roles#disable-an-account)). A disabled directory account stays disabled when the person signs in again.

## The RustDesk client

Directory accounts sign in to the RustDesk client with the same user name and directory password as in the console. The client needs this server as its API server (see [Connect a RustDesk client](/docs/getting-started/connect-a-client)). The server checks the password against the directory in the same way, and while **Auto-create users** is on, a first sign-in in the client makes the account just like one in the console. If the account has [two-factor sign-in](/docs/people/two-factor) on, the client asks for the code too.

## Roles from directory groups

The role is set again at every sign-in, so you cannot change it on the Users page. The server reads the groups from the user's `memberOf` attribute. Only if the entry has none does it search with **Group base DN** and **Group filter**.

Under **Group to role map**, click **Add a group** for each directory group. Type the group into the new row's **Group** field (**Group 1**, **Group 2** and so on) and pick the role its members get in **Role for group 1**, **Role for group 2** and so on. The roles are the same as in **Default role**. Remove a row with its remove button, and click **Save changes**.

A group written as a full DN must match the group's DN, ignoring letter case. A bare name, or a single `CN=name`, matches every group with that common name, wherever it is, and also the **Group name attribute** of a group the group search found. If none matches, the person gets the **Default role**. If several match, the role with the most rights wins, in this order:

1. Super admin and Administrator
2. Server admin and Global admin
3. Remote operator
4. Viewer and Guest link issuer
5. Pro license

Between two roles on the same line, such as one group for Server admin and one for Global admin, the group that comes first in the map wins: the one in the upper row. The person gets that role at every sign-in.

The server stores the map as text: entries separated by `|`, each a group, `=`, and the role's name from the [roles table](/docs/people/users-and-roles#roles), such as `CN=NeoDesk Admins,OU=Groups,DC=example,DC=com=global_admin`. The last `=` separates the group from the role, so DNs with `=` in them work. That is the form the API takes; the server skips an entry with an unknown role name.

## Example for Active Directory

A domain `example.com` with a read-only service account and two groups for NeoDesk:

| Setting | Value |
| --- | --- |
| **Host** | `dc01.example.com` |
| **Port** and **LDAPS (TLS)** | `636`, ticked |
| **Bind DN (service account)** | `CN=svc-neodesk,OU=Service Accounts,DC=example,DC=com` |
| **Base DN** | `DC=example,DC=com` |
| **User filter** | `(sAMAccountName={{username}})` |
| **Default role** | **Viewer** |

**Group to role map**, two rows:

| Group | Role for the group |
| --- | --- |
| `CN=NeoDesk Admins,OU=Groups,DC=example,DC=com` | **Global admin** |
| `CN=NeoDesk Operators,OU=Groups,DC=example,DC=com` | **Remote operator** |

People then sign in with their `sAMAccountName` in lower case, such as `jdoe`, and their domain password. Members of NeoDesk Admins become Global admin, members of NeoDesk Operators become Remote operator, and everyone else the filter finds becomes Viewer.

## How long a sign-in waits

A sign-in through the directory gets 30 seconds in all, in the console and in the RustDesk client, whatever **Connection timeout (s)** says. The server stops waiting for the directory 2 seconds before that, so that it can still answer.

When the directory hasn't answered in that time, the console's sign-in page says "The directory server took too long to answer. Try again in a moment." The server then makes no account and notes no sign-in for the attempt. In the console the attempt doesn't count towards locking the account, because the password was not wrong. The audit log records it as a failed sign-in.

## Test it

1. Fill in the settings and click **Test connection**. It checks that the server reaches the directory with the TLS settings you chose and that the **Bind DN** and **Bind password** work. It does not look up any user.
2. Click **Save changes** and confirm.
3. Stay signed in, and sign in with a directory account in a private browser window.
4. On the **Users** page the account appears with the **LDAP/AD** tag and its role.

If the sign-in says "Invalid username or password." although the password is right, check the **Base DN** and **User filter**. If it says "The directory server took too long to answer. Try again in a moment.", the directory took more than 30 seconds; see [How long a sign-in waits](#how-long-a-sign-in-waits). If the role is wrong, check the map. When the map is filled in and the person is in any group, the server log has a line starting with `[LDAP] User` that lists the groups it found and the role it chose. [Troubleshooting](/docs/operations/troubleshooting) says where the log is.
