# Adding the Survey Questions to Your matchMor Database

**Read this first. The whole thing. It's short.**

---

## What we're doing

You already have a working matchMor database in Supabase. It has tables for profiles, the waitlist (with 19 real people on it), matches, messages, etc. **None of that is changing.**

What's missing is a place where the actual 48 survey questions live. Right now your `survey_responses` table can store members' answers as a JSON blob, but nothing in the database actually defines what those 48 questions ARE.

We're going to add that — and only that. Three new tables, populated with the 48 questions from the spec we just locked.

---

## What you'll do

Two SQL files, run in order, in the Supabase SQL Editor. Same place you saw the old schema sitting earlier.

**File 1:** `001_add_survey_tables.sql` — creates the three new empty tables
**File 2:** `002_seed_survey_questions.sql` — fills them with the 48 questions

Each file takes a few seconds to run. Order matters: file 1 first, then file 2.

---

## Step-by-step

### Before you start

⚠️ **Do not delete the SQL that's currently in the SQL Editor** without saving it somewhere first. You already noticed this — that's good. If you're worried about losing it, copy that whole block of text into a Notepad file on your computer and save it as `original_matchmor_schema.sql` somewhere you'll remember. That way you have a backup of what's already in your database.

### Step 1: Open the SQL Editor (you've done this before)

1. Go to your Supabase dashboard → matchMor project
2. Click the **SQL Editor** icon in the left sidebar (the one that looks like `>_`)

### Step 2: Run File 1 — create the new tables

1. **Look for a "+ New query" or "+" button** somewhere near the top of the SQL Editor page. Click it. This gives you a fresh, empty query window — without touching whatever was there before.
2. **Open `001_add_survey_tables.sql` on your computer** (right-click → Open with → Notepad)
3. **Select all** (`Ctrl+A`) and **copy** (`Ctrl+C`)
4. **Paste** (`Ctrl+V`) into the new empty query window in Supabase
5. **Click the green "Run" button** (or press `Ctrl+Enter`)

**What you should see:** "Success. No rows returned" or similar. Should take 1-2 seconds.

**If you see an error:** copy the entire error message and send it to me. Don't try to fix it. Don't proceed to step 3.

### Step 3: Verify the new tables exist

Before running file 2, let's confirm file 1 worked.

1. Click the **Table Editor** icon in the left sidebar (the grid icon, above the SQL Editor icon)
2. Look at the list of tables on the left

You should now see **three new tables** in the list, in addition to all your existing ones:
- `survey_sections`
- `survey_questions`
- `survey_options`

If you see them: file 1 worked. Proceed to step 4.
If you don't see them: send me a screenshot of what you do see.

### Step 4: Run File 2 — populate with the 48 questions

1. **Go back to the SQL Editor**
2. **Click "+ New query" again** for a fresh empty window
3. **Open `002_seed_survey_questions.sql`** on your computer (right-click → Open with → Notepad)
4. **Select all** and **copy**
5. **Paste** into the new query window in Supabase

⚠️ This file is much longer than file 1 — about 900 lines. That's expected. Don't be alarmed by the size.

6. **Click "Run"**

**What you should see:** "Success. No rows returned" — should take 2-5 seconds. Behind the scenes it inserted 7 sections, 55 question rows, and ~150 option rows.

**If you see an error:** send it to me.

### Step 5: Verify everything is there

Back in the **Table Editor**, click each of the three new tables one at a time. You should see:

- `survey_sections` → **7 rows** (faith, family, personality, lifestyle, relationship, work, profile)
- `survey_questions` → **55 rows** (one per question — the spec has 48 but pr3, pr4, and pr5 each split into multiple rows for their sub-questions)
- `survey_options` → roughly **150 rows** (the multiple-choice answers)

If those numbers look right, you're done. The survey is now defined in your database, ready for the application code to render and capture answers against.

---

## What if I'm not seeing what I expect?

The most common situations:

| You see this | What it means | What to do |
|---|---|---|
| "Success. No rows returned" | The SQL ran, no errors. Tables exist or rows were inserted. | Continue to next step |
| Red error message | Something didn't run | Copy the entire error, send to me, don't proceed |
| `relation "public.survey_sections" already exists` | You already ran file 1. That's fine — `if not exists` should prevent this, but if you see it, just move on | Skip ahead and run file 2 |
| `duplicate key value violates unique constraint` while running file 2 | File 2 was already run — questions already in the database | Don't re-run. Check the tables to confirm they're populated. |

---

## What this does NOT do

For the avoidance of confusion:

- ❌ Does NOT change your existing `survey_responses` table (that's where members' actual answers go — it stays as it is)
- ❌ Does NOT touch the waitlist, profiles, matches, or any other existing table
- ❌ Does NOT delete anything
- ❌ Does NOT cost you any Supabase resources to speak of (a few hundred small rows)
- ❌ Does NOT change anything for the 19 people already on your waitlist

---

## After this is done

Once both files have run successfully, the next step (for whoever builds the matchMor application code) is to:

1. Read questions from the new `survey_questions` table when rendering the survey
2. Save members' answers into the existing `survey_responses` table, keyed by question code (e.g., `{"f1": "temple_active_regular", "fm1": 3, "f8": "essay text..."}`)
3. Use the question metadata (weights, scoring rules) when running the matching engine

That's a future chat — but the database side will be ready.
