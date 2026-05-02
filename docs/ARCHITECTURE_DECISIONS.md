# matchMor Architecture Decisions

> **For future Claude (or any future contributor):** Read this file before making any architectural recommendations about the matchMor codebase or database. It records decisions that have already been made, so we don't keep relitigating settled questions or accidentally reverse choices that were made for good reasons.
>
> When you're starting a new session and the user references something architectural, look here first. If a decision exists, honor it unless there's a specific new reason to revisit. If you think a decision should be revisited, flag it explicitly rather than silently recommending the opposite.

## How to use this log

- One section per decision, in chronological order.
- Status is one of: ✅ Decided, 🤔 Reconsidering, ❌ Reversed, 📝 Provisional.
- When a decision changes, don't delete the old one. Add a new entry that supersedes it, and update the old entry's status to ❌ Reversed with a pointer to the new one. The history matters.
- Keep entries short. If something needs more depth, link to a longer doc.

---

## Decision 001 — Tech stack and hosting
**Date:** ~early March 2026 (predates this log)  
**Status:** ✅ Decided  
**Decision:** Next.js (TypeScript) frontend, deployed via Vercel, with Supabase (Postgres) as the database. Code lives in a GitHub repo; pushes to GitHub auto-deploy to Vercel.  
**Rationale:** Standard, well-supported stack. Owner is a non-developer working with AI assistance; this combination has good defaults and minimal ops burden.  
**Trigger to revisit:** Only if hitting a real wall the stack can't handle.

---

## Decision 002 — Survey schema lives in `public` schema, populated by hand-pasted migrations
**Date:** ~early March 2026 (predates this log; reconstructed from artifacts)  
**Status:** ✅ Decided  
**Decision:** The 48-question survey schema (`survey_sections`, `survey_questions`, `survey_options`) lives in the `public` schema in Supabase, not a dedicated `matchmor` schema. Migrations are applied by pasting SQL into the Supabase dashboard SQL Editor; there is no Supabase CLI setup.  
**Rationale:** Simpler for a non-developer owner to operate. Avoids tooling overhead. Tradeoff is no automated migration history — files in `supabase/migrations/` are documentation, not auto-applied.  
**Trigger to revisit:** When a second contributor joins, or when a staging environment is needed, switching to the Supabase CLI becomes worthwhile.

---

## Decision 003 — JSONB vs. normalized response storage
**Date:** Originally ~early March 2026; reaffirmed 2026-05-01.  
**Status:** ✅ Decided  
**Decision:** Member survey answers are stored in `public.survey_responses` as a JSONB blob in a `responses` column, one row per member, keyed by question code (e.g. `{"f1": "temple_active_attending", "fm1": 3, ...}`). Scores are stored similarly in a `scores` JSONB column.  
**Rationale:** Simple, flexible, fast to ship. Adding new questions doesn't require schema changes. Owner explicitly chose to treat the matching engine as a black box rather than do hands-on result debugging — which is the use case that would have made normalized storage worthwhile. JSONB is the right tradeoff for this product, this owner, this stage.  
**Considered and rejected (2026-05-01):** Normalizing into one row per (member, question) with typed value columns and FK integrity to `survey_options`. Rejected because: (a) better matching-engine debuggability was the main benefit and the owner doesn't want hands-on debugging, (b) the performance argument doesn't bite at matchMor's planned scale, (c) typo-safety and FK-integrity benefits are small when the survey UI is the only writer. The normalized design from the 2026-04-30 session is documented but not adopted.  
**Implications future-Claude must respect:**
- The matching engine reads JSONB and parses in code. Don't recommend SQL-native scoring queries against `survey_responses`.
- pr4 privacy is enforced by the `is_private` flag on `survey_questions`, not by separate table isolation. Whatever code reads `survey_responses` must filter out questions where `is_private = true` before returning data to authenticated clients.
- Adding new questions in v1.x is a content-only change (rows in `survey_questions` and `survey_options`), no schema migration required.  
**Trigger to revisit:** If the owner ever wants to do hands-on matching-result debugging, OR if matchMor scales past ~10k active matched members and matching becomes slow, OR if a developer joins who would benefit from SQL-native query patterns.

---

## Decision 004 — pr4 self-rating privacy enforcement
**Date:** 2026-04-30  
**Status:** 📝 Provisional (see note below)  
**Decision:** pr4's two self-rating sub-questions (`pr4_others`, `pr4_self`) are flagged with `is_private = true` on the `survey_questions` table. Whatever response storage system stores them, it must enforce that they are never returned in any read path that reaches an authenticated client — only service-role / matching-engine code should read them.  
**Rationale:** The locked v1 spec promises members: "this information is never displayed to other members." The schema needs to enforce this architecturally, not just by app-layer convention.  
**Open question:** The spec review in the 2026-04-30 session recommended a *separate table* (`private_self_ratings`) with stricter RLS than a simple `is_private` flag, on the grounds that a flag is enforced by app code (fragile) while a separate table is enforced by SQL grep (durable). The current implementation is the flag-based approach. **This is acceptable for v1, but should be revisited if any privacy-sensitive admin or analytics tooling is built that might inadvertently read the field.**  
**Trigger to revisit:** Building admin tools, analytics dashboards, or data exports.

---

## Decision 005 — r5 dealbreakers require demographics data not collected by the survey
**Date:** 2026-04-30  
**Status:** 📝 Provisional — table to be built  
**Decision:** The r5 dealbreaker question references attributes (children, marital status, sealing status, country, fertility) that aren't collected anywhere in the 48-question survey. A separate `member_demographics` table will be built to hold these, populated by a short pre-survey onboarding step. The collection UI is a future build; the table will be built first so the matching engine has somewhere to read from.  
**Rationale:** Without this table, r5 is unevaluable. The spec implicitly assumes these attributes exist somewhere; they have to live somewhere structured, not embedded inside survey response JSON.  
**Trigger to revisit:** If product decides to subset r5 to only attributes that are askable in the survey itself.

---

## Decision 006 — Decisions log itself
**Date:** 2026-04-30  
**Status:** ✅ Decided  
**Decision:** This file (`docs/ARCHITECTURE_DECISIONS.md`) exists. It is the canonical record of architectural decisions for matchMor. Future Claude sessions should be pointed at this file before making recommendations. It is committed to the repo so it travels with the code.  
**Rationale:** Without a persistent record, each fresh Claude session re-derives architectural opinions from scratch and may contradict prior sessions, leading to wasted work and inconsistent designs. This file provides continuity.  
**Trigger to revisit:** If the decision log itself gets unwieldy (more than ~30 decisions), split into individual decision files in `/docs/decisions/`.

---

## Things NOT decided yet (and need to be)

This section tracks open architectural questions that are being deferred. When one is resolved, move it up into a numbered Decision entry.

- **Matching engine architecture.** Where does it run? Edge Function? Scheduled job? Cron via Vercel? How are weights configured — in code, or in a `scoring_dimensions` table? Open.
- **Photo storage bucket configuration.** Bucket name, RLS policies, signed-URL flow. The schema implies pr1 expects photos somewhere; the storage bucket setup hasn't been verified yet.
- **LLM analysis output storage.** Stage-3 essay analysis output needs to live somewhere queryable. Not yet designed.
- **Survey progress tracking.** How is "this member has finished the survey and is ready to be matched" represented? Open — currently no `survey_progress` or completion state exists.
- **Versioning of the survey.** When v1.1 of the spec lands, how do we handle members who answered v1.0? Open.