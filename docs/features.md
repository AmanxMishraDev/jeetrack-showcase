# Features

## 📊 Dashboard

Daily study tracking, subject-wise progress, streak system, and a live
countdown to JEE Mains/Advanced.

## 📝 Test Tracker

Log JEE Mains / Advanced mock scores with trend charts and performance
analytics over time — see whether a subject is actually improving or just
feels like it is.

## 📚 Syllabus Tracker

Chapter-level coverage tracking across Physics, Chemistry, and Maths, so
you always know what's actually left, not just a vague sense of it.

## 🗂️ To-Do & Backlog

Task management with priority levels and a "no-backlog streak" — a nudge
to actually clear pending items instead of letting them pile up silently.

## 🤖 AI Insights

Personalised coaching analysis powered by Groq (LLaMA 3.3 70B). Pinpoints
weak areas from your own test and syllabus data and suggests a plan —
this isn't generic advice, it's generated from your actual numbers.

## 📧 Monthly Reports

An automated PDF report card delivered via email each month — score
trends, syllabus progress, and consistency, without needing to open the
app to check.

## 📱 PWA (installable, offline-first)

Installable on Android and iOS like a native app. Core features work fully
offline and sync once you're back online.

## 🔔 Push Notifications

Daily study reminders via service worker — configurable, not spammy by
default.

## ☕ Support / Donations

An optional Razorpay-backed support flow. Fully server-verified — order
amounts are set server-side, payment signatures are verified via
HMAC-SHA256, and a webhook (not just the browser callback) is the source
of truth for whether a payment succeeded. See
[`jeetrack-showcase`](https://github.com/AmanxMishraDev/jeetrack-showcase)
for the engineering write-up.

---

See something missing that should be here, or a feature that's outdated?
Open a docs PR — see [CONTRIBUTING.md](../CONTRIBUTING.md).
