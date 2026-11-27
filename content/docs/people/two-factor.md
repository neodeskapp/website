---
title: Two-factor sign-in
description: Turn on sign-in codes from an authenticator app, sign in with them, use and renew recovery codes, and make two-factor sign-in mandatory.
order: 3
icon: pin
---

With two-factor sign-in, a password alone no longer opens your account: after the password you also type a six-digit code from an authenticator app on your phone, such as Google Authenticator, Microsoft Authenticator or Authy. Each person turns it on for their own account, and an administrator can make it mandatory for password accounts.

## Turn it on

1. Open the account menu at the end of the top bar, choose **Your account** and go to **Two-factor sign-in**. See [Your account](/docs/people/your-account).
2. Click **Set up two-factor sign-in**.
3. Install an authenticator app on your phone if you have none.
4. Scan the QR code with the app. If you cannot scan it, type the **Manual key** into the app instead.
5. Type the six-digit code the app shows into **Enter verification code** and click **Verify and turn on**.
6. The page shows eight **Recovery codes**. Store them somewhere safe outside the phone, such as a password manager, then click **I have saved the codes**.

The section now says **Two-factor sign-in is on**. Administrators see the same in the **Two-factor sign-in** column on the **Users** page. Turning it on signs out your account's other browsers; the one you used stays signed in.

In the app, the new entry is called NeoDesk followed by your username. Any app for time-based codes works: the codes have six digits and change every 30 seconds.

If you leave the page before step 5, two-factor sign-in stays off. The next **Set up two-factor sign-in** makes a new key, so remove the unused entry from the app.

## Sign in with a code

1. Enter your username and password on the sign-in page as before.
2. The page asks for the **Verification code**. Type the six digits your app shows now and click **Verify**.

The code changes every 30 seconds, and the server accepts only the code of the current 30 seconds. Each code works once. If correct codes are refused, check that the clock on your phone and on the server is right.

You have five minutes after the password for the code. After five wrong codes, or when the time is up, the page says "Session expired. Sign in again." Click **Back to sign-in** and start with the password again. Wrong codes also count as failed sign-ins, so many of them lock the account for a while (see [failed sign-ins](/docs/people/users-and-roles#sessions-and-failed-sign-ins)).

The RustDesk client asks for the code too when you sign in to it with a password and an account that has two-factor sign-in on. With **Sign in with NeoDesk** the client asks for nothing: you sign in to the console in the browser, with the code there, and allow the client (see [Sign in through the browser](/docs/getting-started/connect-a-client#sign-in-through-the-browser)).

## Use a recovery code

When you do not have your phone, click **Use a recovery code instead** on the code page, type one of your recovery codes into **Recovery code** and click **Verify**. Capital letters, spaces and dashes do not matter.

Each recovery code works once. To get a fresh set, for example when the codes run low:

1. Open **Your account**, and in **Two-factor sign-in** click **New recovery codes**.
2. Type a current code from your app into **Verification code** and click **New recovery codes**.
3. Store the eight new codes. The old ones stop working.

A wrong code counts as a failed sign-in.

## Turn it off

1. Open **Your account** from the account menu.
2. In **Two-factor sign-in**, click **Turn off two-factor sign-in**.
3. Enter your **Current password** and click **Turn off two-factor sign-in** again. Directory and single sign-on accounts have no password in this console, so they type a current code from the app into **Verification code** instead.

This deletes the key and the recovery codes and signs out your account's other browsers. A wrong password or code counts as a failed sign-in.

## When someone has lost the phone

If someone has lost both the phone and the recovery codes, an administrator takes two-factor sign-in off their account:

1. Open **People**, then **Users**.
2. In the person's row menu, under **Sign-in security**, choose the entry it shows and confirm:
   - **Turn off two-factor sign-in…** when nothing requires two-factor sign-in of the person. They sign in with the password alone until they set it up again.
   - **Reset two-factor sign-in…** when it is required of them, for everyone (see [Make it mandatory](#make-it-mandatory)) or for this person. They set it up again, with the new phone, at their next console sign-in.

Both delete the person's key and recovery codes and end their console sessions and RustDesk client sign-ins. The entries show for accounts with two-factor sign-in on, to people with **Manage sign-in security of users** whose role may change the account (see [who can give which role](/docs/people/users-and-roles#who-can-give-which-role)). By default that is Super admin, Administrator and Global admin. They are never offered for your own account: your own two-factor sign-in you turn off under **Your account**.

**Make recovery codes unusable…** in the same group ends only the recovery codes, for example when someone else has seen them. The person makes new ones under **Your account** with their app.

## If the only admin is locked out {#if-the-only-admin-is-locked-out}

When the only administrator has lost both the phone and the recovery codes, nobody is left who can turn two-factor sign-in off in the console. The server's password reset command does it instead: with `--reset-two-factor` it gives the account a new password, turns off its two-factor sign-in and deletes its key and recovery codes. Where two-factor sign-in is required, the console asks the account to set it up again at its next sign-in. Afterwards, set it up again under **Your account** with the new phone.

The option needs NeoDesk 3.6.26 or newer. An older server refuses it, and the installers say to update first.

Docker, installed with the script. It prints the new password once; `--user <name>` picks another account than `admin`:

```bash
sudo bash /opt/neodesk/docker/neodesk-docker.sh reset-password --reset-two-factor
```

Docker with the compose file. Type the password after the first command (it does not show), then run the second in the folder with the compose file:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | docker compose exec -T -u neodesk neodesk neodesk-server reset-password --reset-two-factor admin
```

Linux. It prints the new password of `admin` once:

```bash
sudo neodesk-setup --reset-password --reset-two-factor
```

Windows, in PowerShell run as Administrator. It gives `admin` a new password: `ADMIN_PASSWORD` when you set it in the same window, else a random one that it shows once:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\NeoDesk\neodesk.ps1" -ResetTwoFactor
```

The Linux and Windows commands reset only the account named `admin`. For another account, give its name to the server's command with `--reset-two-factor`, as [Troubleshooting](/docs/operations/troubleshooting#forgot-the-admin-password) shows for a password reset, for example on Linux:

```bash
read -rs NEWPASS
printf '%s\n' "$NEWPASS" | sudo -u neodesk env NEODESK_ENV_FILE=/opt/NeoDeskConsole/.env /opt/neodesk/neodesk-server reset-password --reset-two-factor <name>
```

Put the account's name in place of `<name>`.

## Make it mandatory

An account with the **Change server settings** permission (Super admin, Administrator and Server admin by default) can require two-factor sign-in for every password account:

1. Open **Settings**, **Sign-in**, and go to **Signing in to the console**.
2. Turn on **Require two-factor sign-in** and click **Save changes**.

From then on, a password account without two-factor sign-in that signs in to the console sets it up right after the password. The sign-in page shows **Set up two-factor sign-in** with the QR code and the **Manual key**. The person scans it, types the code, clicks **Verify**, stores the recovery codes and clicks **I have saved the codes**, and is then signed in. The set-up has to be done within 15 minutes, and five wrong codes end it; then the sign-in starts again with the password.

Until the account has two-factor sign-in, the RustDesk client refuses it with "Two-factor sign-in is required for this account. Sign in to the web console once to set it up." People can still turn it off for their own account, and their next console sign-in asks for the set-up again.

To require it of one person only, choose **Require two-factor sign-in** in their row menu on the **Users** page, under **Sign-in security**. It is offered for password accounts, to people with **Manage sign-in security of users**. **Don't require two-factor sign-in** in the same place lets the person follow the server-wide switch again.

The switch does not apply to directory and single sign-on accounts, which are left to their directory or identity provider. It does not apply to Pro license accounts either: they cannot sign in to the console, where the set-up happens, so they keep signing in to the RustDesk client with their password.

## Directory and single sign-on accounts

- After a [single sign-on](/docs/people/oidc), the console does not ask for a code. Use the two-factor sign-in of your identity provider instead.
- A [directory account](/docs/people/ldap) can turn two-factor sign-in on and then gets asked for codes. It turns it off with a current code, as described under [Turn it off](#turn-it-off).
