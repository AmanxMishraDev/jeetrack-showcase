# FAQ

### Is JEETrack free?

Yes, and it stays free. There's an optional Razorpay-backed "Buy me a
coffee"-style support option if JEETrack has helped your prep, but nothing
is paywalled.

### Is my data private?

Yes — see [docs/privacy.md](docs/privacy.md) for the full breakdown of what's
collected and how it's protected (Row-Level Security ensures your data is
only ever visible to you).

### Why is the source code private if this project talks about being open?

JEETrack is a live product handling real user accounts and payments. The
production repo is private to avoid exposing anything that could be used
to compromise user data or payment flows. In exchange, this docs repo and
[`jeetrack-showcase`](https://github.com/AmanxMishraDev/jeetrack-showcase)
are public — you can see the architecture, the engineering decisions, and
generalized code patterns, just not the exact production implementation.

### Can I self-host JEETrack?

Not currently — the production source isn't public. If there's real demand
for this, it's worth raising in [Discussions](../../discussions).

### Does JEETrack work offline?

Yes — it's a PWA (installable on Android/iOS) and core features work
offline, syncing once you're back online.

### What exam does JEETrack support?

JEE Mains and JEE Advanced (India's engineering entrance exams). Subject
coverage is Physics, Chemistry, and Maths.

### How do I report a bug?

Open an issue using the **Bug Report** template. See
[CONTRIBUTING.md](CONTRIBUTING.md) for what to include.

### How do I request a feature?

Open an issue using the **Feature Request** template, or check the
[Roadmap](ROADMAP.md) first — it might already be planned.

### I found a security issue — what do I do?

Please don't open a public issue. See [SECURITY.md](SECURITY.md) for how
to report it privately.

### Who builds JEETrack?

It's built and maintained solo by [Aman Mishra](https://www.jeetrack.in/about)
— frontend, backend, payments, and the admin tooling.
