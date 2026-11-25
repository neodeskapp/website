---
title: Your account
description: Your own profile, status, password and two-factor sign-in, the browsers you are signed in on, your API tokens and how the console looks for you, and the limit on sessions per account.
order: 2.5
related: /docs/people/two-factor, /docs/command-line/api-tokens, /docs/people/users-and-roles
---

**Your account** is one page with everything about your own account. Every account has it. Open the account menu, your picture or initials at the end of the top bar, and choose **Your account**.

The page has these parts:

- **Profile**: your picture, user name and role, and **My status**: **Online**, **Away** or **Busy**. Colleagues see your status in chat and next to your name. The account menu changes it too. Your name, email and role can't be changed here; an administrator changes them on the [Users](/docs/people/users-and-roles) page.
- **Password**: change your own password with **Current password**, **New password** and **New password again**, then **Change password**. Directory and single sign-on accounts have no password in the console and get a note instead.
- **Two-factor sign-in**: turn it on or off and make new recovery codes. See [Two-factor sign-in](/docs/people/two-factor).
- **Signed-in devices**: the browsers and devices where your account is signed in, described below.
- **API tokens**: your tokens for scripts, the command line and AI agents. Only Super admin, Administrator, Global admin and Server admin accounts have this part. See [API tokens](/docs/command-line/api-tokens).
- **Preferences**: **Theme for this browser** (**Console default**, **Light** or **Dark**), **Language**, which applies to your account on every device, and **Accessibility settings** for contrast, text size, motion and colour filters in this browser. **Console default** follows the theme set under **Settings**, **Appearance**.

The account menu has short ways to some of these: **Signed-in devices** opens the list in a sheet, **API tokens** opens that part of the page, and **Theme**, **Language** and **Accessibility** change the same preferences.

The settings search in the top bar (Ctrl K) finds the fields of this page too, for example "password" or "signed-in devices".

## Signed-in devices

An account can be signed in on several browsers and devices at once. **Signed-in devices** lists them. Each entry names the browser and system, such as "Firefox on Windows", with its **Address**, when it **Signed in** and when it was **Last used**. The browser you are using is marked **This browser**.

- **Sign out** next to an entry signs out that browser after you confirm. It goes to the sign-in page at its next request, which says "You were signed out from another device. Please sign in again."
- **Sign out everywhere else** signs out every entry but this browser. The line next to it says how many sessions it signed out.
- Your own browser signs out with **Sign out** in the account menu.

Under the list, a line says how many sessions the server allows per account. The audit log records each sign-out as "Session signed out from another device".

### For administrators

An account with **Edit users** finds **Signed-in devices…** in a person's row menu on the **Users** page. It opens the same list for that person, with **Sign out** for each entry and **Sign out everywhere**. That browser's sign-in page then says "An administrator signed you out. Please sign in again." The entry is there only for accounts whose role you may change (see [who can give which role](/docs/people/users-and-roles#who-can-give-which-role)). The audit log records "Session ended by an administrator", with who ended which session.

## How many sessions an account may have

By default an account can be signed in on up to 10 browsers and devices at once. A sign-in beyond that signs out the one used longest ago, and that browser is told "You were signed out because your account signed in on more browsers than this server allows. Please sign in again." The audit log records "Session ended by the session limit".

To allow one session per account, open **Settings**, **Sign-in**, tick **One session per account** under **For everyone** and click **Save**. A new sign-in then signs out the account's other browser, which is told "You were signed out because your account signed in on another browser. This server allows one session per account." The switch applies from the next sign-in: sessions open at that moment stay until their account signs in again. The audit log records the change as "Sessions per account changed".

`SESSION_MAX_PER_USER` in the server's environment decides instead of the switch when it is set: the number of sessions per account, from 1 to 1000, or `0` for no limit. The switch is then locked, and the page says "SESSION_MAX_PER_USER is set to … in the server's environment and decides instead of this switch. Remove it there to use the switch." Older env files from the installers had `SESSION_MAX_PER_USER=1` with the template's comment above it. When the server starts and finds those lines exactly as the template wrote them, it empties the value, so the switch decides. A value or comment you changed yourself stays. See [Configuration](/docs/operations/configuration#console-sessions-and-logs).

A session still ends after 30 minutes without activity and 24 hours after sign-in; see [Sessions and failed sign-ins](/docs/people/users-and-roles#sessions-and-failed-sign-ins).

## What signs an account out everywhere

These end an account's console sessions:

- Changing your own password, or turning your own two-factor sign-in on or off, ends your other sessions. The browser you made the change in stays signed in. The other browsers are told "You were signed out because your password, two-factor sign-in or access changed. Please sign in again." It also ends the account's sign-ins in the RustDesk client.
- An administrator who gives the account a new password, name or role, turns off its two-factor sign-in, disables it or deletes it ends all its sessions. A new password set on your own account keeps your current session.
- The server's password reset command, which [Troubleshooting](/docs/operations/troubleshooting#forgot-the-admin-password) describes, ends the account's console sessions.

## On the command line

With an [API token](/docs/command-line/api-tokens):

```bash
neodesk sessions list                  # the browsers your account is signed in on
neodesk sessions list-for <user>       # another account's, with Edit users
neodesk sessions end <user> <session>  # sign one of them out
neodesk sessions end-all <user>        # sign an account out everywhere
neodesk settings console-sessions      # the switch and what decides the limit
neodesk settings console-sessions-set --single-session=true
```

A token has no browser session of its own, so `sessions list` marks no entry as the current one. A token can't sign out its own account's sessions: use **Signed-in devices** in the browser for that. The [command reference](/docs/command-line/reference) lists the options.
