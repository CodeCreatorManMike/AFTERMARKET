# Ticket-transfer-process research

Evidence-based research into how each ticket provider's transfer/resale mechanism works, so
Aftermarket can pick a safe, compliant integration path per provider before building any
automation against it.

## Structure

Each provider gets its own folder under `providers/`:

```
providers/<provider-name>/
  terms-and-conditions.md   — sourced findings on resale/transfer permission and restrictions
  transfer-process.md       — exact step-by-step sender/receiver flow
  screenshots/              — evidence captures (dated, named by what they show)
  source-links.md           — every URL cited above, one per line
  open-questions.md         — unresolved questions, risk rating, recommended integration path
```

Start from `providers/_template/` when researching a new provider — it mirrors the
`.github/ISSUE_TEMPLATE/provider_research.md` issue template so a research issue and its
corresponding folder stay in sync.

## Ground rules

1. **Evidence over speed.** Every claim in `terms-and-conditions.md` or `transfer-process.md`
   must link to a source (provider docs, T&Cs page, support response) or a screenshot.
2. **Never assume automation is allowed.** If a provider's terms are silent or ambiguous on
   transfer automation, flag it in `open-questions.md` as `needs-decision` / `legal-review`,
   don't default to "probably fine."
3. **Recommended integration path is one of exactly four options**: Automated validation/transfer
   candidate, Manual transfer workflow candidate, Referral-only candidate, or Unsupported / do not
   integrate. Pick one explicitly in `open-questions.md`.

## Status

Tracked live in GitHub Issues (`research` + `provider-integration` labels) and summarized in
[`docs/roadmap.md`](../docs/roadmap.md#provider-research-status). The root `README.md` §3 already
contains first-pass, unverified findings for Howler, Quicket, Webtickets, Ticketmaster SA, and
Computicket from earlier product research — use those as a starting hypothesis, not a substitute
for sourced verification here.
