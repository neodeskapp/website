---
title: Contributing
description: How to propose a change to NeoDesk, what a pull request needs, how commit messages look, and the policy on copyright and provenance of contributions.
order: 1
---

NeoDesk is developed in the repository [neodeskapp/neodesk](https://github.com/neodeskapp/neodesk) on GitHub. Changes come in as pull requests against `main`, the repository's only branch. This page covers what a pull request needs; [Building from source](/docs/development/building) and [Tests and checks](/docs/development/tests-and-checks) cover the work before it.

## Propose a change

1. Fork the repository and clone your fork.
2. Create a branch from the current `main`.
3. Make the smallest change that solves the problem. Keep one concern per pull request.
4. Build what you changed and run its tests, see [Tests and checks](/docs/development/tests-and-checks). CI runs the full checks on the pull request.
5. Open the pull request against `main`.

Releases are tagged from `main`. [Branches, versions and releases](/docs/development/releasing) has the details.

Report security problems privately, not in a public issue: open a [security advisory](https://github.com/neodeskapp/neodesk/security/advisories/new) on GitHub. [SECURITY.md](https://github.com/neodeskapp/neodesk/blob/main/SECURITY.md) has the process.

## Pull request rules

The [pull request template](https://github.com/neodeskapp/neodesk/blob/main/.github/pull_request_template.md) asks for each of these:

- **Target:** `main`.
- **No private data:** no credentials, private keys, hostnames, IP addresses, paths or configuration of a real deployment. Use example addresses such as `203.0.113.10` in docs, tests and examples. The Secret Scan workflow fails on a list of known operator fingerprints.
- **No secrets for fork code:** don't add a workflow that runs code from a fork with the repository's secrets.
- **Provenance:** say where external code, generated files, protocol compatibility code and anything taken from upstream come from.
- **Security changes:** a change to authentication, authorization or a network path explains the trust boundary, who may do what, its limits and how it fails.
- **Deployable:** the change reaches users through the console's updater, the installer scripts or the Docker image.
- **Database changes:** additive and safe on both SQLite and PostgreSQL, or the pull request describes the manual step.
- **Env file changes:** new settings are added as missing keys. An update never overwrites what an operator set.
- **Update and rollback:** when the change touches deployment files or the server, check that update, restart and rollback still work.
- **Tests:** list the exact commands you ran and their results.
- **Console texts:** a new or changed text has its key in every language file, see [Translations](/docs/development/translations#add-a-text-to-the-console).
- **Attribution:** credit contributors and the sources of reports and designs accurately, and keep the author and license of reused code.

The maintainer reviews every pull request (`.github/CODEOWNERS` assigns them to every path). The maintainer decides whether to merge the patch as it is or to write a reviewed alternative, and keeps the attribution accurate either way.

## Code

- The server and its tools are Go, in `neodesk-server`. The web console is Svelte and TypeScript, in `web-ui`; its rules (runes only, no text literals in markup, tokens for styles, a unit test per component) are in [web-ui/README.md](https://github.com/neodeskapp/neodesk/blob/main/web-ui/README.md).
- The repository keeps no JavaScript of its own. `go run ./cmd/repotool check-js` in `neodesk-server` fails on any tracked `.js`, `.mjs` or `.cjs` file that is not in `.github/javascript-allowlist.txt`, and every entry there needs a comment that says why the file has to stay JavaScript.
- A new npm package whose code ends up in the browser must be under MIT, ISC, 0BSD, BSD-2-Clause, BSD-3-Clause, Apache-2.0 or the Unlicense, and ship its license text. The web app's build fails otherwise. `THIRD_PARTY_NOTICES.md` lists the same packages.
- Write tests that fail when the behaviour they cover is broken, and check that they do before you rely on them.

## Commit messages

Commits on `main` use a Conventional Commits subject without a scope:

```text
fix: never press Ctrl+C on the device when a drag reaches the edge of the remote screen
feat: move a database between SQLite and PostgreSQL with neodesk-server migrate
```

- The type is one of `feat`, `fix`, `refactor`, `chore`, `docs`, `test` and `ci`.
- After the colon: lower case, imperative, no full stop at the end. Say what changes for the user, not which file you touched.
- Put the issue number at the end of the subject when there is one: `... #1039`.
- Most commits need a subject only. A large change gets a body in plain prose that explains why.
- Never write `[version-bump]` in a commit message, and don't start a subject with `chore: bump version` or `chore: release version`. Those belong to the Version Bump workflow: Go Server CI, Web UI CI and CDAP SDK CI skip a push whose last commit carries the marker, and Version Bump does not run for those subjects.

A user-facing change can get a line under `## [Unreleased]` in `CHANGELOG.md`. The version bump after the merge files that section under the new version number.

## Contributor licensing

NeoDesk is distributed under the AGPL-3.0, as [LICENSE](https://github.com/neodeskapp/neodesk/blob/main/LICENSE) and the [License](/docs/project/license) page describe. This section is the maintainer policy for contributions. It is not legal advice.

### Copyright

- The copyright notice in LICENSE names the project's copyright holder, UNITRONIX. It does not transfer the copyright in later contributions to UNITRONIX. A contributor keeps the copyright in original code they write, unless a separate written agreement says otherwise.
- A `Co-authored-by` trailer records authorship. It is not a copyright assignment, not a license grant beyond the project license and not a promise of exclusive ownership. Don't invent an email address for it.
- Where UNITRONIX has no assignment, the contributor's copyright and the AGPL treatment of their code are kept, and nobody claims exclusive ownership of it. The source and what was actually used are recorded in the [contributor credits](/docs/project/sponsors#contributor-credits).
- Where UNITRONIX needs exclusive control of a contribution, it gets a written copyright assignment or a suitable contributor agreement before the code is accepted. That agreement stays outside the public repository; the maintainer's contribution register records a reference to it.

### Direct contribution and clean-room work

There are two paths, both open to review:

- **Direct contribution:** the contributor's copyright, provenance, AGPL license and attribution are kept. A pull request is not a copyright assignment.
- **Clean-room implementation:** the code is written only from the reviewed specification, observable behaviour and independently written test vectors. The source is credited for the report or design, not as an author of code they did not write.

When an external patch is not accepted directly:

1. The specification role records the problem, the public behaviour, the security invariants and independently written test vectors.
2. The implementation role gets that specification. It does not get the external patch, comments taken from its source, copied tests or generated files.
3. The implementation is written independently for the NeoDesk architecture and reviewed for provenance before the merge.
4. The external reporter is credited for the report, the design input or the test scenario, only for what they actually supplied.

Bug reports, requirements, protocol observations and test ideas do not by themselves transfer copyright in implementation code. Don't copy an external pull request's code, comments, tests, generated output or distinctive structure into a clean-room implementation.

Code that speaks RustDesk's protocol has its own rules and a release gate, see [Clean-room provenance](/docs/development/provenance).

### AGPL obligations

This policy adds no proprietary restrictions to AGPL-covered code. Modified NeoDesk code that is conveyed keeps the AGPL notices, the availability of its source and the source offer to users over a network. A commercial grant or a dual license can only be offered for material whose copyright and third-party permissions UNITRONIX actually controls.

Before an implementation derived from outside work is merged, the maintainer records:

- the source issue or pull request, and what was actually used from it;
- whether the code was accepted directly, rewritten clean-room, or supplied under a written assignment or agreement;
- the copyright and license notices that apply;
- the attribution planned for `CHANGELOG.md` or the release notes.
