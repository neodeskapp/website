---
title: License
description: NeoDesk's license, the AGPL-3.0, the Commercial Grant for sponsors of upstream BetterDesk, the trademark note and where the third-party notices are.
order: 1
---

NeoDesk is free software under the GNU Affero General Public License, version 3 (AGPL-3.0). The [LICENSE file](https://github.com/neodeskapp/neodesk/blob/main/LICENSE) in the repository holds the full text and the notes this page sums up; where the two differ, the file counts. Neither is legal advice.

NeoDesk started as a fork of BetterDesk, which UNITRONIX (Krzysztof Nienartowicz) created and maintains at [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk). UNITRONIX holds the copyright the LICENSE file names. NeoDesk is maintained by Linus Rath at [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk).

## AGPL-3.0

- You may use, change and run NeoDesk, for personal or commercial purposes.
- If you change NeoDesk and run it as a network service, the AGPL requires you to make your changes available to the people who use that service.
- The AGPL-3.0 covers the whole project in the repository: the server and its console (`neodesk-server` and `web-ui`), the CDAP SDKs (`sdks`), the CDAP bridges (`bridges`) and the tooling.

### Which versions

The AGPL-3.0 applies to all commits on the development branch since June 2026. v3.4.0 is the first stable release under the AGPL-3.0. Releases v3.3.x and earlier remain under the Apache License 2.0, as published in their release artifacts.

Third-party contributions that were merged earlier under other terms have been withdrawn and recreated by the maintainer under the AGPL-3.0 where applicable.

## Commercial Grant

The AGPL-3.0 applies to everyone. The Commercial Grant is an optional exception to its copyleft for your private deployment patches. It is for:

- sponsors of [UNITRONIX on GitHub Sponsors](https://github.com/sponsors/UNITRONIX) at $50 a month or more: the Bronze, Silver and Gold tiers
- Honorary Supporters

The $5 and $15 tiers and [Buy Me a Coffee](https://buymeacoffee.com/unitronix) don't include it.

### What the grant allows

While the eligible sponsorship is active, the organization may run modified NeoDesk (private patches, branding) for internal or client use, without publishing those private modifications under the AGPL, provided it:

- does not resell NeoDesk as a standalone product (OEM)
- keeps the features merged into the public repository open for everyone

| Where | What applies |
|---|---|
| The public NeoDesk repository | Always AGPL-3.0, always open |
| Your private deployment | With the grant, private patches are fine while you are eligible |

### Start and end

The grant starts with an active GitHub Sponsors subscription of $50 a month or more, or with Honorary Supporter status. It ends when the sponsorship ends. There are no certificates.

The grant is self-service. GitHub Sponsors billing, or honorary status, is the only check: there are no license keys, endpoint counts or audits, and no contracts unless you ask for a large deal later. There is no guaranteed SLA either; priority triage is best effort, when the maintainer has time.

A paid commercial license for OEM and special cases without sponsorship may be offered later. Normal sponsor use doesn't need one. Questions about the grant go to a GitHub issue in [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk/issues), and the maintainer replies when there is time.

## Trademark

"RustDesk" is a trademark of the RustDesk Team. NeoDesk is an independent project that implements the RustDesk protocol for client compatibility. Its use of the name "RustDesk" is purely descriptive and does not imply affiliation with or endorsement by the RustDesk Team.

The RustDesk client is separate software under its own license.

## Clean-room notice

The LICENSE file states that the NeoDesk server (`neodesk-server`) is an independent, clean-room implementation of the RustDesk rendezvous and relay protocol, and contains no code derived from the RustDesk project. It also states that the protocol definitions (the `.proto` files) describe message formats for interoperability and are not derived from any copyrighted source code.

## Third-party notices

[THIRD_PARTY_NOTICES.md](https://github.com/neodeskapp/neodesk/blob/main/THIRD_PARTY_NOTICES.md) in the repository lists the third-party material that ships with NeoDesk. A running console also serves the licenses of the code in its web app at `/licenses.txt`, for example `https://desk.example.com/licenses.txt`.
