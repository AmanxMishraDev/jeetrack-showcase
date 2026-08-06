# Privacy

This page explains, in plain terms, what JEETrack collects and how it's
protected. It's a summary for transparency — not a substitute for the
full privacy policy on [jeetrack.in](https://www.jeetrack.in), if/when one
is published there.

## What's collected

- **Account info**: email address, used for authentication (via Supabase
  Auth) and for sending monthly report emails
- **Study data**: mock test scores, syllabus progress, streaks, to-do items
  — the data JEETrack needs to function
- **Payment info (if you use the support flow)**: handled entirely by
  Razorpay. JEETrack never sees or stores your card/UPI details — only the
  payment status and amount, confirmed server-side
- **Usage analytics**: product usage events (via PostHog) — feature usage,
  session activity — used to understand what's working and what isn't, not
  tied to your study content

## How it's protected

- **Row-Level Security (RLS)** on every table containing user data — the
  database itself enforces that a user can only ever read/write their own
  rows, regardless of what the app's frontend does
- **No secrets in the client** — API keys and credentials (Supabase
  service keys, Groq, Razorpay, Resend) live in server-side environment
  variables, never shipped to the browser
- **Payments are never trusted client-side** — order amounts are set by a
  server-side function, and payment confirmation depends on a
  server-verified signature and webhook, not anything the browser reports

## What JEETrack does NOT do

- Sell or share your data with third parties for advertising
- Store your payment card/UPI details (Razorpay handles this — JEETrack
  never receives raw payment credentials)
- Make your study data or progress visible to other users, unless a
  feature explicitly says otherwise and you opt in (e.g. a future
  opt-in peer leaderboard — see [ROADMAP.md](../ROADMAP.md))

## Third-party services JEETrack relies on

| Service | Purpose | Data involved |
|---|---|---|
| Supabase | Database, auth, backend functions | Account + study data |
| Razorpay | Payments | Payment status only (not card details) |
| Groq | AI insights generation | Your study data, sent for analysis only |
| Resend | Transactional email | Email address |
| PostHog | Product analytics | Anonymized usage events |
| Vercel | Hosting | Standard request logs |

## Questions or requests

If you want your data deleted, or have a privacy question not answered
here, open a [Discussion](../../../discussions) or reach out via the
contact in [SECURITY.md](../SECURITY.md) if it's sensitive.
