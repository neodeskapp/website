---
title: Sponsors and credits
description: How to support BetterDesk, the sponsor tiers and their terms, the organizations and people who support it, and the contributors whose work went into it.
order: 3
---

BetterDesk was created by UNITRONIX (Krzysztof Nienartowicz), and most of the server is that project's work. This site documents [neodeskapp/betterdesk](https://github.com/neodeskapp/betterdesk), a fork of [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk) maintained by Linus Rath. Sponsorship and donations go to UNITRONIX, upstream. The console's **Help & Supporters** panel links to the same places.

## Sponsor the project

- [GitHub Sponsors](https://github.com/sponsors/UNITRONIX), monthly
- [Buy Me a Coffee](https://buymeacoffee.com/unitronix), one-time

UNITRONIX uses the money for AI development tools such as GitHub Copilot, for the environments that keep the code tested and stable, and for the maintainer's time, which comes out of evenings and weekends.

### Tiers

| Tier | Price | Perks | Commercial Grant |
|---|---|---|---|
| Buy Me a Coffee | One-time | Thanks, and a mention in the supporters list if you agree | No |
| Buy me a Coffee | $5 a month | Sponsor badge on GitHub | No |
| Pizza Fuel | $15 a month | Sponsor badge, and your name in the repository's thanks section | No |
| Bronze Sponsor (Backer) | $50 a month | Company link or small logo in the README; priority triage, best effort and without SLA | Yes |
| Silver Sponsor (Priority Support) | $100 a month | Medium logo with a link in the README and the docs; priority triage; email for bugs and configuration; input on the roadmap | Yes |
| Gold Sponsor (Core Partner) | $200 a month | Large logo in the README and the docs; everything in Silver | Yes |

The tiers and perks are UNITRONIX's, so the README, docs and thanks section they name are upstream's.

The $5 and $15 tiers fund tools and the maintainer's time. Bronze and above are the tiers for companies; they include the [Commercial Grant](/docs/project/license#commercial-grant), which allows private deployment patches without the copyleft while you sponsor.

An Honorary Supporter is someone who made a significant contribution that isn't money, such as audits, infrastructure or mentorship. Honorary Supporters get their logo and their own section in the supporters list, a README badge, and the Commercial Grant.

### Sponsorship terms

By sponsoring UNITRONIX you accept these terms:

- **Upstream changes stay open:** nothing merged into the public BetterDesk repository during a sponsorship may be hidden from the community, kept from upstream, or sold as a paid add-on that others can't get. Everything built with sponsorship support and merged upstream is available to everyone under the AGPL-3.0. This applies to the project's code, not to private patches that exist only in a sponsor's own deployment; those are what the Commercial Grant covers for the eligible tiers.
- **Best effort, no guaranteed SLA:** upstream BetterDesk is a solo, spare-time project. There is no guaranteed response time, no license audit and no paperwork for the grant; GitHub Sponsors billing is the only check. Development, fixes and replies happen when the maintainer has time.
- **Communication:** send change requests and bug reports through GitHub Issues, so the project stays transparent. For sensitive information, such as proprietary configuration or company logs, email is fine too.
- **The creator decides:** sponsorship gives no ownership of the project and no veto over its roadmap. It doesn't entitle a sponsor to press for architectural changes or features that conflict with the project's vision. The final word on the code and the direction of development stays with the creator.

To become an Honorary Supporter, or for a corporate partnership around the Commercial Grant, open an issue in [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk/issues) or contact its maintainer through the repository.

## Supporters

The console's **Help & Supporters** panel lists them as well.

### Honorary Supporters

**[INSOLVE](https://insolve.pl)** is an Honorary Supporter of BetterDesk. Its support went into security audits, hardening work and the development of the Go server, the web console and the operator and agent clients. It contributed security review, production audits, infrastructure testing and feedback from real deployments.

### Individual backers

- **Marco Jakobs** ([@jacotec](https://github.com/jacotec)) donated through Buy Me a Coffee.
- **MyNameisStitch** ([@MyNameisStitch](https://github.com/MyNameisStitch)) donated through Buy Me a Coffee, and wrote a detailed report on remote desktop in the browser behind a reverse proxy that made the documentation clearer for other operators ([UNITRONIX/BetterDesk#329](https://github.com/UNITRONIX/BetterDesk/issues/329)).
- **Redspin** (@playerumpknow) donated through Buy Me a Coffee.
- **muopc** ([@muopc](https://github.com/muopc)) sponsored once through GitHub Sponsors.

## Contributor credits

This section credits the reports, designs, tests and code that went into BetterDesk from people other than UNITRONIX. The issues and pull requests named here are in [UNITRONIX/BetterDesk](https://github.com/UNITRONIX/BetterDesk).

### Linus Rath (@rathlinus)

[Linus Rath](https://github.com/rathlinus) designed and wrote the console in `web-ui`, the Svelte app this fork ships in place of upstream's Node.js console. He proposed the redesign upstream in [issue #493](https://github.com/UNITRONIX/BetterDesk/issues/493) and [pull request #495](https://github.com/UNITRONIX/BetterDesk/pull/495).

### @remoover

[remoover](https://github.com/remoover) discussed open pull requests and how to work together in [issue #346](https://github.com/UNITRONIX/BetterDesk/issues/346). Upstream keeps the original heads of those pull requests in branches named `archive/remoover/pr-<number>`, for #266, #271, #282, #283, #348, #357, #358, #359, #419, #420, #421 and #423.

This work went into BetterDesk:

- [#358](https://github.com/UNITRONIX/BetterDesk/pull/358): the design for RustDesk apps that only start sessions and never register as a device. BetterDesk has it as the opt-in `ALLOW_LEGACY_OUTBOUND`, honored only in the open enrollment mode and checked with relay tickets; see [Configuration](/docs/operations/configuration#connections).
- [#282](https://github.com/UNITRONIX/BetterDesk/pull/282): the framing of the browser's relay connection, one RustDesk frame per WebSocket message, and some compatibility fixes. The pull request was not merged as a whole.
- [#348](https://github.com/UNITRONIX/BetterDesk/pull/348): keeping a connected device registered while its ID changes. BetterDesk has its own implementation.
- [#357](https://github.com/UNITRONIX/BetterDesk/pull/357): letting `ENROLLMENT_MODE` win over a mode saved earlier. BetterDesk does this when `ENROLLMENT_MODE_ENV_OVERRIDE` is on; see [Enrollment](/docs/console/enrollment#changing-the-mode).
- [#420](https://github.com/UNITRONIX/BetterDesk/pull/420): a cleanup of the Docker build, checked independently; the Dockerfile already had it.
- [#283](https://github.com/UNITRONIX/BetterDesk/pull/283) and [#423](https://github.com/UNITRONIX/BetterDesk/pull/423): requirements and failure cases from production reporting, which shaped the design review. The live session reporting itself was not merged.

Two proposals are not in BetterDesk and wait for separate security decisions: [#359](https://github.com/UNITRONIX/BetterDesk/pull/359), turning off relay ticket checks for standalone relays, and [#271](https://github.com/UNITRONIX/BetterDesk/pull/271), a generator for the upstream RustDesk client with a GitHub Actions build.

### Rights

Credit here is not a copyright assignment and not a legal opinion. Code reused directly from a contributor stays under the AGPL-3.0 notices and the contributor's copyright, and no contributor has assigned copyright because their issue or pull request is named here. Bug reports, design proposals, production observations and test scenarios are credited as such; they don't make the reporter the author of unrelated code.
