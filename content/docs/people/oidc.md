---
title: Single sign-on with OIDC
description: Let people sign in to the console through an OpenID Connect identity provider, and give them roles from the groups the provider sends.
order: 5
icon: verified_user
---

With single sign-on turned on, the sign-in page gets a button that sends people to your OpenID Connect identity provider, such as Keycloak, Okta, Azure AD or Google. After they sign in there, they come back to the console signed in. The first sign-in makes their account.

## Where it is set

Open **Settings**, **Sign-in** and go to **OIDC / OAuth2 (SSO)** under **For everyone**. The section is there for accounts with the **Server configuration** permission: Super admin, Administrator and Server admin by default.

The settings are saved in the server's database and apply to the next sign-in without a restart. People who are already signed in stay signed in.

## Register NeoDesk at the provider

1. At your provider, create an OpenID Connect application that signs in with the authorization code flow.
2. Enter this redirect address, with the address people use to open the console:

   ```text
   https://desk.example.com/api/auth/oidc/callback
   ```

   It must be exactly the same as **Redirect URL** in NeoDesk. The path `/api/oidc/callback` works too.
3. Copy the client ID and the client secret.
4. If you want roles from groups, have the provider put the person's groups into a claim, by default `groups`.

Open the console at that same address when you sign in. The browser carries a cookie from the start of the sign-in to its end, so a sign-in started at another address, such as the server's IP address, fails with "Invalid OIDC callback. Please try again." Behind a reverse proxy, use the public address (see [Reverse proxy and TLS](/docs/operations/reverse-proxy-tls)).

## Settings

Tick **Turn on single sign-on** to show the fields. Turning it on fills **Redirect URL** and **Panel URL** with the address you are using, when they are empty.

| Setting | Meaning |
| --- | --- |
| **Button text** | The provider's name on the sign-in button. |
| **Issuer URL** | The provider's issuer address. With Auto-discovery the server finds the other addresses from it. |
| **Allowed private OIDC networks** | Addresses or ranges, separated by commas, for a provider on a private network, such as `10.20.0.0/16`. Without them the server does not contact providers at private addresses. Only private ranges are accepted, and providers on the server itself are never contacted. |
| **Client ID**, **Client Secret** | From the provider. A saved secret shows as dots; leave them to keep it. |
| **Redirect URL (callback)** | The redirect address registered at the provider. It must use http or https and end in `/api/auth/oidc/callback` or `/api/oidc/callback`. |
| **Panel URL** | The address people open the console at. The server sends the browser there to finish the sign-in. If it is empty, `PANEL_PUBLIC_URL` or `PUBLIC_URL` from the environment is used. |
| **Scopes** | Default `openid profile email`. |
| **Use PKCE (recommended)** | Adds PKCE to the sign-in. Ticked for a single sign-on that was never saved; a saved one keeps the value it was saved with. |
| **Auto-discovery** | On by default. Turned off, it shows **Authorization endpoint**, **Token endpoint** and **Userinfo endpoint** to fill in by hand. |
| **Auto-create users** | On by default: the first sign-in makes an account. Off: only people who already have a single sign-on account here can sign in. |
| **Prefer SSO login** | The sign-in page goes straight to the provider (see below). Off by default. |
| **User name claim** | Under **Claims**. The claim that becomes the account name. Default `preferred_username`. |
| **Email claim** | Default `email`. Stored with the account at every sign-in and shown in the **Email** column of the Users page. Used for the account name, the part before the @, only when the provider sends no user name claim and says the address is verified. |
| **Display name claim** | Default `name`. Stored with the account at every sign-in. |
| **Groups claim** | The claim with the person's groups. Default `groups`. |
| **Default role** | Under **Roles**: **Viewer**, **Operator** or **Admin**. These are the roles Viewer, Remote operator and Administrator in the [roles table](/docs/people/users-and-roles#roles). |
| **Group → Role Mapping** | Groups and the role each gives (see below). |

To save with single sign-on on, the server needs a Client ID, a Redirect URL, and an Issuer URL or both the authorization and token endpoints.

::: warning
**Admin** in **Default role** is the Administrator role, which has every permission. With it, everyone your provider lets through gets full control of the server.
:::

## Roles from groups

Write one entry per line, as `group=role`, with a role name from the [roles table](/docs/people/users-and-roles#roles), such as `viewer`, `operator`, `global_admin` or `super_admin`. Group names must be written exactly as the provider sends them, letter case included. The groups claim can be a list, or text with the names separated by spaces or commas.

The role starts at the **Default role**, and a group in the map can only raise it: if several match, the one with the most rights wins. A new account gets that role.

With a map filled in, the role is set again at every sign-in. Someone whose groups match none of the map gets the **Default role**, so a person removed from a group at the provider loses that group's role at the next sign-in. A role you choose on the **Users** page lasts only until then. Without a map, the **Default role** is only for new accounts, and a role you choose on the Users page stays.

## What people see

The sign-in page shows the password form, then "or" and a button **Sign in with** followed by the **Button text**, or **Sign in with SSO** without one. After the provider, people land on the page they wanted to open, signed in. Accounts made this way carry the **SSO** tag on the Users page and cannot sign in with a password. The console does not ask them for a [two-factor code](/docs/people/two-factor).

With **Prefer SSO login**, the sign-in page says "Opening single sign-on…" and goes to the provider by itself, except:

- when the address is `/login?autoLaunch=0`,
- right after a failed single sign-on,
- for visitors from a private network address (10.x, 172.16.x to 172.31.x, 192.168.x, 127.x and their IPv6 counterparts).

Behind a reverse proxy the console sees the proxy's address unless it is told to trust the proxy. With a proxy on the same machine or on a private network, everyone then counts as local and the page never goes to the provider by itself. [Trusting the proxy](/docs/operations/reverse-proxy-tls#trusting-the-proxy) covers that. To see how the console counts you, open `/api/auth/oidc/status` on the console's address. For the page to go to the provider by itself, `enabled` and `prefer_sso` have to be `true` and `local_bypass` `false`.

Prefer SSO login only changes the sign-in page. Password sign-in keeps working.

To stop one person from signing in by single sign-on, disable their account on the Users page (see [Disable an account](/docs/people/users-and-roles#disable-an-account)). Deleting it is not enough while **Auto-create users** is on, because the next sign-in makes a new account.

## Single sign-on in the RustDesk client

With single sign-on on, the server offers it to RustDesk clients as a second way to sign in, named after the **Button text**, or SSO without one. The client opens the provider in the computer's browser. After the sign-in there, the browser shows "Sign-in successful" and "You can close this window and return to RustDesk.", and the client is signed in.

The client uses the same settings, the same **Redirect URL** and the same accounts as the console, so you register nothing more at the provider. What it needs:

- The client has this server as its API server (see [Connect a RustDesk client](/docs/getting-started/connect-a-client)).
- The **Redirect URL** opens from the computer the client runs on. If the client keeps waiting after the sign-in at the provider, check that the browser reached that address and shows "Sign-in successful".
- The sign-in in the browser is finished within 10 minutes.

A refused sign-in shows "Sign-in failed" in the browser with the reason, such as "Your account was not found and auto-provisioning is disabled." The client does not ask for a two-factor code after single sign-on. A single sign-on account cannot sign in to the client with a password.

## Example with a generic provider

| Setting | Value |
| --- | --- |
| **Button text** | `Example ID` |
| **Issuer URL** | `https://sso.example.com` |
| **Client ID** | `neodesk` |
| **Redirect URL (callback)** | `https://desk.example.com/api/auth/oidc/callback` |
| **Panel URL** | `https://desk.example.com` |
| **Use PKCE (recommended)** | Ticked |
| **Default role** | **Viewer** |

**Group → Role Mapping**, for a provider that sends these names in `groups`:

```text
neodesk-admins=global_admin
neodesk-operators=operator
```

## Test it

1. Click **Test discovery**. The server fetches the discovery document of the **Issuer URL** and lists the endpoints it found. It does not check the client ID or secret.
2. Click **Save single sign-on settings** and confirm.
3. Stay signed in, open the sign-in page in a private browser window and click the new button.

| Message on the sign-in page | Meaning |
| --- | --- |
| Access was denied by the identity provider. | The provider refused, or the person cancelled. |
| Your account was not found and auto-registration is disabled. | **Auto-create users** is off and there is no single sign-on account of that name. |
| OIDC authentication failed. Please try again. | The server could not finish the sign-in with the provider, for example because of a wrong client secret, or because the provider took more than 15 seconds to answer the server's token request. |
| Invalid OIDC callback. Please try again. | The callback does not belong to a sign-in this browser started, or the sign-in at the provider took more than 10 minutes. |
| An error occurred during SSO login. | The server could not start or finish the sign-in, for example because it cannot reach the provider. |
| This name belongs to an account that signs in with a password or through the directory, so single sign-on cannot sign you in. Ask an administrator. | A password or directory account with the same name already exists. Single sign-on never takes over such an account. |
| This account is disabled. Ask an administrator. | The account is disabled on the Users page. |

When the provider sends the browser back, the console waits up to 30 seconds for the server to finish the sign-in with the provider. With no answer in that time, the browser shows a page that says only "OIDC callback proxy failed". Try again; when it keeps happening, the provider answers too slowly.
