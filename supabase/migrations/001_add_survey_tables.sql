-- =============================================================================
-- matchMor — ADD Survey Definition Tables (Additive Migration)
-- =============================================================================
-- This script ADDS three new tables to your existing matchMor database:
--   • survey_sections   — the 7 sections of the survey
--   • survey_questions  — the 48 questions (55 rows including grouped sub-questions)
--   • survey_options    — the multiple-choice options for radio/checkbox/tag/toggle questions
--
-- It does NOT touch any of your existing tables (profiles, survey_responses,
-- matches, waitlist, etc.). It does NOT delete anything. Safe to run.
--
-- After running this file, run 002_seed_survey_questions.sql to populate the
-- 48 questions and their options.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- The 7 sections of the survey, in display order.
-- -----------------------------------------------------------------------------
create table if not exists public.survey_sections (
  id              smallserial primary key,
  code            text not null unique,            -- 'faith', 'family', etc.
  display_order   smallint not null unique,
  title           text not null,
  intro_text      text not null,
  created_at      timestamptz default now()
);


-- -----------------------------------------------------------------------------
-- Response type taxonomy (defines which widget renders for each question).
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.survey_response_type as enum (
    'radio',     -- single-select from options
    'checkbox',  -- multi-select all-that-apply
    'tag',       -- multi-select with max limit
    'rating',    -- 1-10 slider with semantic anchors
    'slider',    -- numeric slider with custom range
    'essay',     -- open text with character limit
    'text',      -- single-line open text
    'toggle',    -- independent on/off per option (r5 dealbreakers)
    'photo'      -- file upload multi (pr1)
  );
exception when duplicate_object then null;
end $$;


-- -----------------------------------------------------------------------------
-- Scoring weight tier (used by the matching engine).
-- -----------------------------------------------------------------------------
do $$ begin
  create type public.survey_weight_tier as enum (
    'high',
    'medium_high',
    'medium',
    'low_medium',
    'low',
    'meta',          -- modifies how other questions are weighted (f5, l5, pr5_attraction)
    'hard_filter',   -- stage 1 elimination (r5, pr5 age, r3+l3)
    'llm_only'       -- essays — never deterministically scored
  );
exception when duplicate_object then null;
end $$;


-- -----------------------------------------------------------------------------
-- The 48 questions (plus grouped sub-questions for pr3, pr4, pr5).
-- -----------------------------------------------------------------------------
create table if not exists public.survey_questions (
  id              bigserial primary key,
  section_id      smallint not null references public.survey_sections(id),
  code            text not null unique,            -- 'f1', 'fm2', 'pr3_height', etc.
  display_order   smallint not null,               -- order within section
  prompt          text not null,                   -- the question text
  helper_text     text,                            -- shown beneath the prompt
  framing_text    text,                            -- longer intro (used by pr4)
  response_type   public.survey_response_type not null,
  weight_tier     public.survey_weight_tier not null,
  scoring_notes   text,                            -- the spec's "scoring role" text

  -- Type-specific configuration (only relevant fields are populated):
  max_selections  smallint,                        -- tag/checkbox max (e.g., p5=6, l1=8)
  min_selections  smallint,                        -- e.g., pr1 photos min=3
  slider_min      numeric,                         -- slider/rating numeric min
  slider_max      numeric,                         -- slider/rating numeric max
  slider_step     numeric,                         -- step increment
  slider_default  numeric,                         -- default value
  slider_unit     text,                            -- e.g., 'inches', 'children'
  char_limit      smallint,                        -- essay/text max characters
  file_size_limit_mb smallint,                     -- pr1 photos
  placeholder     text,                            -- text/essay placeholder

  -- Grouping: pr3 (height + build + style), pr4 (others + self),
  -- pr5 (age + height min + height max + build pref + attraction importance)
  -- display as one card but store as separate questions. group_code links them.
  group_code      text,                            -- e.g., 'pr3', 'pr4', 'pr5'
  group_label     text,                            -- e.g., 'Your physical details'
  group_position  smallint,                        -- order within the group

  -- Privacy: pr4 self-rating must never be displayed to anyone.
  is_private      boolean not null default false,

  created_at      timestamptz default now(),

  unique (section_id, display_order)
);

create index if not exists idx_survey_questions_section
  on public.survey_questions (section_id);
create index if not exists idx_survey_questions_group
  on public.survey_questions (group_code) where group_code is not null;


-- -----------------------------------------------------------------------------
-- Options for radio / checkbox / tag / toggle questions.
-- (Sliders, essays, text, photos do NOT have option rows.)
-- -----------------------------------------------------------------------------
create table if not exists public.survey_options (
  id              bigserial primary key,
  question_id     bigint not null references public.survey_questions(id) on delete cascade,
  code            text not null,                   -- short stable identifier
  display_order   smallint not null,
  label           text not null,                   -- the displayed text
  helper_text     text,                            -- per-option helper (rare)

  -- Scoring metadata used by the deterministic matching engine:
  --   - Ordinal questions (e.g., f1 activity level): score_ordinal gives position
  --   - Categorical questions: matched by code, not score
  score_ordinal   smallint,
  score_weight    numeric,                         -- per-option weight (rare)

  -- Hard-filter flag for r5 dealbreakers:
  is_dealbreaker_eligible boolean not null default false,

  created_at      timestamptz default now(),

  unique (question_id, code),
  unique (question_id, display_order)
);

create index if not exists idx_survey_options_question
  on public.survey_options (question_id);


-- -----------------------------------------------------------------------------
-- Row Level Security: the survey definition is public-readable.
-- (Members need to read it to render the survey. Only admins write to it.)
-- -----------------------------------------------------------------------------
alter table public.survey_sections  enable row level security;
alter table public.survey_questions enable row level security;
alter table public.survey_options   enable row level security;

do $$ begin
  create policy "Anyone can read survey sections"
    on public.survey_sections for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Anyone can read survey questions"
    on public.survey_questions for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Anyone can read survey options"
    on public.survey_options for select using (true);
exception when duplicate_object then null; end $$;


-- =============================================================================
-- Done. Tables exist but are empty.
-- Next: run 002_seed_survey_questions.sql to populate the 48 questions.
-- =============================================================================
