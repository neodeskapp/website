---
title: Clean-room provenance
description: The policy for code and protocol schemas that talk to stock RustDesk clients, the clean-room workflow, and the release gate for clean-room claims.
order: 10
icon: verified
---

NeoDesk talks to the stock RustDesk desktop client, so part of its code follows a protocol that NeoDesk did not design. This page is the provenance register for that part: how compatibility code and protocol schemas are written, and what has to be shown before a release describes them in any way that implies independent authorship. It applies to everyone who changes the repository.

This is a technical provenance process, not legal advice. Licensing, trademarks, patents and contributor rights need a qualified legal review.

## Release gate

Status: **verification required.**

The NeoDesk Support Agent is a NeoDesk product. Its compatibility surface with the stock desktop client must not be described as a fork, a clone, an independently licensable component or a clean-room implementation until this register and its supporting evidence have been reviewed. The same holds for the server: make no clean-room or relicensing claims in code, documentation or release notes until the register has been reviewed.

### What the review covers

- The protocol schemas in `neodesk-server/protos/`, the copy the console serves (`neodesk-server/console/static/files/protos/`), and the code generated from them (`neodesk-server/proto/` and `web-ui/src/lib/remote/client/generated/`).
- Compatibility framing, cryptography, generated client configuration and test fixtures.
- Branded Support Agent binaries and their third-party notices.

A protocol name, a port number or interoperability seen from outside is never taken as proof that an implementation was written independently.

### Evidence before a compatibility release

1. Record the author, date, source-of-truth specification and review status of every compatibility module and protocol schema.
2. Compare the current four copies of the protocol schemas with the relevant external releases, and keep the result of the comparison for counsel. A documented instruction from the past to copy a schema is an audit trigger, not evidence that a current file is safe to relicense.
3. Where provenance can't be shown, replace the affected code or schema from a new NeoDesk specification. Renaming or reformatting is not a remedy.
4. Publish an SBOM and `THIRD_PARTY_NOTICES` for every artifact that is distributed, including bundled codec, UI and vendor components.
5. Record the result in the release record before any clean-room or licensing claim is made.

## Clean-room workflow

The implementation works from two inputs that are kept apart:

1. **The specification role** records only public standards and black-box observations of stock clients: packet captures, state changes that can be seen from outside, the public port layout, and test vectors it writes itself.
2. **The implementation role** receives the NeoDesk specification and those vectors. It does not receive external source code, generated artifacts, copied comments or test files derived from source.

The specification is versioned. Every new wire feature names the revision of the specification it implements and a test vector generated independently.

For contributors this means:

- Don't judge the provenance or copyright status of a `.proto` file by its role in the protocol or by its header. The existing schemas are subject to the release gate above.
- Don't copy external source, generated artifacts, comments or test fixtures. Implement only from NeoDesk's own specifications and black-box test vectors written independently.
- Don't add direct imports of external source, instructions to clone or build upstream code, or copied protocol artifacts, except in a compatibility test fixture that was explicitly approved and carries its attribution and notice.

## The Support Agent boundary

Any wire compatibility of the Support Agent with the desktop client must live behind an explicitly named compatibility adapter with a narrow API:

```text
Compatibility adapter -> Session authorizer -> Passive session core -> Platform services
```

The adapter may never create a user-facing external-client UI, an outbound connection workflow or a privilege bypass. It receives a short-lived session grant that the server authorized, and can only open an inbound session on the target side.

The server's half of this is `neodesk-server/sessiongrant`: it signs a grant with the server's Ed25519 key for exactly one session on one device, valid for at most 10 minutes, and never puts a password, two-factor code, device token or other long-lived secret into it.

## Schema rules

- `neodesk-server/protos/` is the canonical schema source, owned by NeoDesk. `neodesk-server/console/static/files/protos/` is a committed copy that the console serves at `/protos`, never a second source.
- The generated Go code in `neodesk-server/proto/` is committed. No CI job regenerates it or the served copy, so compare both with the canonical schema by hand when it changes. The browser's messages are generated from the canonical schema by every build, dev server and test run of `web-ui` (`web-ui/vite-plugins/protos.ts`) and are not committed.
- The legacy `hbb` names stay at the edge of the protocol. New packages, APIs and documentation use NeoDesk's names.
- A schema change needs a compatibility test and a provenance entry.

## Safeguards in the repository

- The pull request template asks whether external code, generated artifacts, protocol compatibility code and material derived from upstream have documented provenance.
- `go run ./cmd/repotool check-provenance` in `neodesk-server` is a guardrail that the [local gate](/docs/development/tests-and-checks#the-local-gate) runs. It checks that `THIRD_PARTY_NOTICES.md` keeps a short form of this policy (its sections "Clean-room workflow" and "Release gate") and describes the SBOM requirement, and that `.github/go-server-context.md` neither tells contributors to copy external protocol schemas nor claims that the `.proto` files carry no copyright headers. It can't prove independent authorship and doesn't replace a source review or a legal review.
