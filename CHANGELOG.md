# Changelog

All notable changes to JEETrack are documented here. Format loosely follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

Since JEETrack is continuously deployed, dates refer to when a change went
live at [jeetrack.in](https://www.jeetrack.in), not a tagged release.

## [Unreleased]

### Added
- Support/donation flow via Razorpay, fully server-verified
- Internal admin dashboard powered by PostHog (feature usage, activation
  funnels, DAU/WAU/MAU)

### Changed
- Sync layer now batches and diffs writes instead of firing one write per
  edit (see `jeetrack-showcase` engineering notes for details)
- Analytics moved off ad-hoc production database queries and onto PostHog
  events

### Fixed
- RLS policies rewritten to avoid per-row re-evaluation of `auth.uid()`
- Closed a gap where a `SECURITY DEFINER` view bypassed row-level security

---

<!--
Add new entries above this line, newest first. Suggested format:

## [YYYY-MM-DD]
### Added
- ...
### Changed
- ...
### Fixed
- ...
### Security
- ...
-->
