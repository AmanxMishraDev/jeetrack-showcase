# Security Policy

JEETrack is a live product that handles real user accounts and payments
(via Razorpay). If you've found a security issue, thank you — please report
it responsibly rather than filing a public issue.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Instead, report it privately:

- 📧 Email: **security@jeetrack.in** <!-- TODO: replace with real inbox -->
- Include: a description of the issue, steps to reproduce, and the
  potential impact if you can assess it

You should expect an acknowledgment within **72 hours**. This is a
solo-maintained project, so response time may vary, but security reports
are treated as top priority.

## What's in scope

- Authentication / authorization bypasses
- Any way to access another user's data (test scores, syllabus progress,
  personal info)
- Payment flow issues — e.g., manipulating order amount, bypassing
  signature verification, replaying/duplicating a payment
- Injection vulnerabilities (SQL, XSS, etc.)
- Exposed secrets or credentials in any public JEETrack repo

## What's out of scope

- Issues in third-party services JEETrack depends on (Supabase, Razorpay,
  Groq, Resend, Vercel, PostHog) — please report those directly to the
  respective vendor
- Social engineering, physical attacks, or denial-of-service testing
  against the live app
- Missing security headers or best-practice suggestions with no
  demonstrated impact (feel free to open a normal issue for these instead)

## Disclosure

Please give a reasonable amount of time to fix a confirmed issue before
any public disclosure. Credit will happily be given (with permission) once
a fix is shipped.

## Supported versions

JEETrack is a continuously-deployed web app — there's only ever one
version in production, and that's the one covered by this policy.
