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

## What's already built (as of 2026-05-01)

> **Future Claude: read this before recommending anything.** This section catalogues the substantial work already in the codebase from prior sessions. Do not propose redesigning, replacing, or "improving" any of these without first reading the actual code and confirming the recommendation makes sense given what exists. Many of these were built in different sessions with different framings; they may not all align with each other or with the current spec, and reconciling them is a product decision (see Open Path Question below) — not a technical refactor decision.

**Database (Supabase, `public` schema):**
- `survey_sections`, `survey_questions`, `survey_options` — populated with the locked v1 spec (7 sections, 48 questions + grouped sub-questions, 247 options)
- `survey_responses` — empty; designed for JSONB blob storage (Decision 003)
- `profiles`, `profile_details` — empty; schema unknown without inspection. Matching engine reads from these (see lib/matching.ts)
- `matches` — empty; populated by `app/api/matches/generate`
- `date_suggestions` — empty; populated by the same matching endpoint
- `reflections` — empty; intended to feed post-date AI coaching loop
- `match_responses`, `messages`, `email_series` — empty; purpose to be confirmed
- `waitlist` — 21 real signups from matchmor.com

**Application code (Next.js):**
- `lib/matching.ts` — the AI matching engine. Calls Anthropic API (Claude). Generates 8-dimension compatibility scores, full markdown brief, friction note, conversation starters, date ideas. Also has a `generateCoachingNote()` function for post-date coaching.
- `lib/supabase.ts` — Supabase client setup
- `lib/stripe.ts` — Stripe integration (payments). Purpose: founding members get 6 months free, then $18.30/month.
- `app/api/matches/generate` — POST endpoint that runs matching for a pair of members and emails both via Resend
- `app/api/contact`, `app/api/contact-form` — contact-us endpoints
- `app/api/home` — homepage data endpoint (purpose tbd)
- `app/api/waitlist` — receives waitlist signups
- `app/api/webhooks` — handles incoming events (likely Stripe and/or Supabase)
- `app/api/reflections` — endpoint for post-date reflections
- `app/page.tsx` — currently `return null` (the live homepage rendering must come from somewhere else; likely middleware or a different routing path; not yet investigated)

**Concepts in the matching engine that are NOT in the locked v1 spec:**
- **Faith tracks** (t1 = Orthodox, t2 = Aspirational, t3 = Open). Stored on `profiles.faith_track`. Used to adapt brief tone and coaching language.
- **`profile_details` schema** with rich open-text fields: `faith_description`, `family_culture`, `recharge_style`, `love_language`, `sunday_afternoon`, `looking_for`, `interests` (array), plus structured fields like `temple_endowed`, `temple_recommend`, `sealing_importance`, `mission_served`, `church_activity`, `children_desired`. **These are interview-style narrative inputs, fundamentally different in shape from the 48-question structured survey.**
- **Post-date reflection + AI coaching loop.** Members fill a reflection after each date; an AI coaching note is generated using the reflection + the original brief's friction note.

**External services wired in:**
- Anthropic (Claude API) — for generating briefs and coaching
- Resend — for transactional emails
- Stripe — for subscription payments

**The product vision (from matchmor.com landing page):**
matchMor is a guided AI-powered journey for LDS singles, framed as an alternative to swipe-based dating apps and to expensive human matchmaking services. Five-step journey per introduction: Brief → Conversation → Date → Reflection → Coaching. One curated introduction per week. Founding members (first 200) get 6 months free, then $18.30/month locked permanently.
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
**Note added 2026-05-01:** The narrower JSONB-vs-normalized question is settled, but the broader question of *whether `survey_responses` is even the right input for the matching engine* is now open. The matching engine reads `profile_details` (interview-style narrative fields), not `survey_responses` (structured survey answers). See "Open Path Question" below.
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
---

## OPEN PATH QUESTION (added 2026-05-01)

> **This is the most important unresolved question in the codebase right now. Future Claude must not recommend building UI, migrations, or matching changes until this is answered.**

Two parallel mental models of matchMor exist in the codebase:

- **Vision A — the locked v1 spec.** A 48-question structured survey (`survey_questions`, `survey_options`) with radios, sliders, tags, essays. Designed in a 2026-04-30 session.
- **Vision B — the matching engine's mental model.** Interview-style narrative inputs in `profile_details` (faith_description, family_culture, sunday_afternoon, looking_for, etc.) plus faith tracks (t1/t2/t3) on `profiles`. Designed earlier (the matching engine was written 2026-03-04).

These two visions are pointed at related but different products. The matching engine was built to read narrative texture. The 48-question survey collects structured data points. Neither is wrong, but they don't currently work together, and the next layer of UI work (onboarding, survey rendering, profile pages) needs to feed the matching engine — which means we have to pick one of:

- **Path 1 — Vision B is right.** The matching engine's `profile_details` interview is what onboarding should be. The 48-question survey is deprecated work; we don't build UI for it. Cheapest, fastest. Means accepting that significant 2026-04-30 design work is sunk.
- **Path 2 — Vision A is right.** The 48-question survey is what onboarding should be. The matching engine is rewritten to read structured survey responses. Means rewriting `lib/matching.ts` to take a different prompt with structured inputs. Means deprecating `profile_details`.
- **Path 3 — Both, integrated.** The 48-question survey is intake (the structured part). The six essay questions in the survey (f8 testimony, fm6 family vision, p6 character, l7 passion, r7 relationship, pr6 bio) populate `profile_details` narrative fields. The matching engine continues reading `profile_details`. Some additional onboarding fields (faith_description, recharge_style, etc.) may need to be added to the survey or collected separately. More work but uses both halves of existing investment.

**Status:** Open. To be resolved by owner (Peter).

**What changes once this is decided:**
- Whether the next build task is "render the 48-question survey UI" (Paths 2/3) or "render the profile_details interview UI" (Path 1)
- Whether the matching engine needs rewriting (Path 2)
- Whether additional questions need to be added to bridge what the engine wants vs. what the survey collects (Path 3)
- What the demographics table (Decision 005) needs to look like, since it overlaps with `profile_details` fields

**Decision is not urgent in the sense that nothing is breaking — but it IS blocking, in the sense that almost no further build work makes sense without it.**

---

## Decision 007 — Path 3 chosen for survey + profile_details + matching engine reconciliation
**Date:** 2026-05-02  
**Status:** ✅ Decided (resolves OPEN PATH QUESTION above)

**Decision:** The 48-question locked spec survey AND the matching engine's `profile_details` interview model are BOTH retained. Onboarding will collect the structured 48-question survey + a small set of additional interview-style questions to bridge fields the survey doesn't cover. The matching engine continues reading `profile_details` (unchanged from current `lib/matching.ts`); `profile_details` is populated from a combination of survey answers (especially essays) and the bridging questions.

**Rationale:** matchMor's product promise is that the AI is as good as or better than a human matchmaker. Human matchmakers get hours of interview time; their value comes from rich, narrative understanding of the person. The 48-question survey alone doesn't give the AI enough narrative texture to be a matchmaker — it gives data points. The matching engine was built to read narrative inputs (`faith_description`, `family_culture`, `sunday_afternoon`, `looking_for`) and that is the right shape for the product. The survey's essay questions (f8, fm6, p6, l7, r7, pr6) are exactly the kind of narrative input the engine needs. Path 3 honors both halves of existing work and produces an onboarding flow that gives the AI matchmaker-quality input.

**Mapping from survey to profile_details:**
- `temple_endowed`, `temple_recommend` ← derived from f2 (with bucket logic)
- `sealing_importance` ← f6 ordinal
- `mission_served` ← f3 option label
- `church_activity` ← f1 option label
- `faith_description` ← f8 essay (direct)
- `children_desired` ← fm1 numeric to text
- `family_culture` ← fm6 essay (direct)
- `interests` ← l1 tag array (direct)
- `looking_for` ← r7 essay (direct)
- `children_count` ← from `member_demographics` (Decision 005); NOTE potential duplication to resolve
- **GAP — needs new bridging questions:** `recharge_style`, `love_language`, `sunday_afternoon`

**Bridging questions to add (NOT in the locked v1 spec; need to be designed):**
- A short interview-style question about recharge style / where they get energy
- A love language question (could be radio with the 5 standard love languages or a short essay)
- A short interview question about what their typical Sunday afternoon looks like (this matters specifically because it's mentioned in the locked spec's section intros and reflects a member's lived rhythm)

These three questions should feel like the kind of things a thoughtful matchmaker would ask in an in-person interview — not data fields. Tone matters.

**Open sub-questions arising from this decision:**
- The `embedding` column on `profile_details` (USER-DEFINED type) suggests semantic similarity / vector search was planned but is not yet wired up in `lib/matching.ts`. Status of this work is unknown. Future Claude should investigate before assuming the matching engine is "complete."
- The duplication between `member_demographics.children_count` and `profile_details.children_count` should be resolved when demographics is built — pick one as canonical.
- Onboarding length: 48 questions + 3 bridging + photos + demographics is a lot. Pacing/save-and-resume is mandatory (already required by spec).

**Implications future-Claude must respect:**
- Do NOT propose rewriting `lib/matching.ts` to read `survey_responses` directly. The matching engine reads `profile_details`. That is the contract.
- Do NOT propose dropping `survey_responses` or its supporting schema. The survey is the structured intake; its answers populate `profile_details`.
- The next build task is the survey UI + the bridging questions UI + the mapping logic that writes to `profile_details` on survey completion.
- Photos are pr1 in the survey but the storage bucket itself hasn't been verified to exist. Future open question.

**Trigger to revisit:** If real members start completing the survey and the AI briefs feel thin (i.e., the matching engine isn't getting enough signal), we may need to add more bridging questions or revisit which survey fields populate `profile_details`. Test with the first 5-10 founding members and tune.