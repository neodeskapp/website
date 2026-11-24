---
title: License
description: NeoDesk's license, the AGPL-3.0, the trademark note and where the third-party notices are.
order: 1
---

NeoDesk is free software under the GNU Affero General Public License, version 3 (AGPL-3.0). The [LICENSE file](https://github.com/neodeskapp/neodesk/blob/main/LICENSE) in the repository holds the full text and the notes this page sums up; where the two differ, the file counts. Neither is legal advice.

NeoDesk is a modified version of BetterDesk by UNITRONIX, released under the AGPL-3.0. UNITRONIX holds the copyright the LICENSE file names. NeoDesk is maintained by Linus Rath at [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk).

## AGPL-3.0

- You may use, change and run NeoDesk, for personal or commercial purposes.
- If you change NeoDesk and run it as a network service, the AGPL requires you to make your changes available to the people who use that service.
- The AGPL-3.0 covers the whole project in the repository: the server and its console (`neodesk-server` and `web-ui`), the CDAP SDKs (`sdks`), the CDAP bridges (`bridges`) and the tooling.

### Which versions

The AGPL-3.0 applies to all commits on the development branch since June 2026. The LICENSE file names v3.4.0 as the first stable release under the AGPL-3.0, and releases v3.3.x and earlier remain under the Apache License 2.0, as published in their release artifacts. These are releases of the original project, from before NeoDesk.

NeoDesk itself has no stable release yet. The releases in neodeskapp/neodesk so far are release candidates of 3.6.0, all under the AGPL-3.0; see [Updating](/docs/operations/updating#releases-so-far).

Third-party contributions that were merged earlier under other terms have been withdrawn and recreated by the maintainer under the AGPL-3.0 where applicable.

## Trademark

"RustDesk" is a trademark of the RustDesk Team. NeoDesk is an independent project that implements the RustDesk protocol for client compatibility. Its use of the name "RustDesk" is purely descriptive and does not imply affiliation with or endorsement by the RustDesk Team.

The RustDesk client is separate software under its own license.

## Clean-room notice

The LICENSE file states that the NeoDesk server (`neodesk-server`) is an independent, clean-room implementation of the RustDesk rendezvous and relay protocol, and contains no code derived from the RustDesk project. It also states that the protocol definitions (the `.proto` files) describe message formats for interoperability and are not derived from any copyrighted source code.

## Third-party notices

[THIRD_PARTY_NOTICES.md](https://github.com/neodeskapp/neodesk/blob/main/THIRD_PARTY_NOTICES.md) in the repository lists the third-party material that ships with NeoDesk. A running console also serves the licenses of the code in its web app at `/licenses.txt`, for example `https://desk.example.com/licenses.txt`.
