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
**Date:** Originally ~early March 2026; under reconsideration as of 2026-04-30.  
**Status:** 🤔 Reconsidering  
**Original decision:** Member survey answers are stored in `public.survey_responses` as a JSONB blob in a `responses` column, one row per member, keyed by question code (e.g. `{"f1": "temple_active_attending", "fm1": 3, ...}`).  
**Original rationale:** Simple, flexible, fast to ship. Adding new questions doesn't require schema changes.  
**Why being reconsidered:** A later session flagged that this design makes the matching engine slower and more bug-prone — to compare any single answer across members, the engine must parse every member's full JSON blob. Normalized storage (one row per (member, question), with typed value columns and FK integrity to `survey_options`) would make matching queries cleaner and catch typo bugs at write time.  
**Status as of 2026-04-30:** Decision pending. The `survey_responses` table is currently empty (no production data), and no application code yet writes to it, so changing the design is currently free. Decision must be made before survey UI is built.  
**See also:** `/docs/decisions/003-jsonb-vs-normalized-discussion.md` (to be written when the decision is made).

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