-- =============================================================================
-- matchMor Compatibility Survey — Seed Data (v1.0)
-- =============================================================================
-- Populates public.survey_sections, public.survey_questions, and public.survey_options from the
-- authoritative spec. Run AFTER 001_initial_schema.sql.
--
-- Conventions:
--   - Section codes use short identifiers: 'faith', 'family', etc.
--   - Question codes match the spec exactly: 'f1', 'fm2', 'pr3_height', etc.
--     Grouped questions get suffixed codes: pr3 → pr3_height, pr3_build, pr3_style.
--   - Option codes are stable kebab-case identifiers — change wording without
--     breaking matching logic that references them.
--   - score_ordinal is populated for ordered scales (e.g., activity level).
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Sections
-- -----------------------------------------------------------------------------

insert into public.survey_sections (code, display_order, title, intro_text) values
  ('faith', 1, 'Faith & Testimony',
   'Your relationship with the gospel and the Church is at the heart of who you are. These questions help us understand your testimony, your practices, and where you are in your spiritual journey.'),
  ('family', 2, 'Family & Future',
   'Family is the foundation of the eternal plan. These questions explore your hopes for family life, parenting, and the kind of home you want to build together.'),
  ('personality', 3, 'Personality & Character',
   'Who are you when no one is watching? These questions explore your temperament, how you relate to others, and the qualities that define your character.'),
  ('lifestyle', 4, 'Lifestyle & Interests',
   'Daily life and shared interests matter deeply in a marriage. These questions help us find someone whose rhythms, passions, and lifestyle align with yours.'),
  ('relationship', 5, 'Relationship & Courtship',
   'How you approach dating and courtship reflects your values and readiness. These questions help match you with someone on the same page about pace, expectations, and long-term vision.'),
  ('work', 6, 'Work, School & Ambition',
   'Your work and educational journey shape your life rhythms and your future. These questions help us understand where you are professionally and what you''re building.'),
  ('profile', 7, 'Profile & Photos',
   'Physical attraction is part of how God designed marriage to work — and being honest about what you bring and what you''re drawn to helps us build a compatible match. These questions ask you to be honest without being harsh on yourself. If any of this is uncomfortable, that''s okay — answer as honestly as you can.');


-- -----------------------------------------------------------------------------
-- Helper: small CTE-based pattern for inserting question + options together.
-- Each question block uses a WITH clause to capture the new question's id,
-- then inserts its options in one statement.
-- -----------------------------------------------------------------------------


-- =============================================================================
-- SECTION 1: FAITH & TESTIMONY
-- =============================================================================

-- f1. Current relationship with the Church
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='faith'), 'f1', 1,
    'How would you describe your current relationship with the Church?',
    'radio', 'high',
    'High weight. Primary activity-level match dimension. Paired with f2 and f5 for composite spiritual-path matching.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('temple_active_regular',     1, 'Active, temple-worthy and attending regularly', 6),
    ('working_toward_temple',     2, 'Active, working toward temple worthiness', 5),
    ('semi_active',               3, 'Semi-active — attending occasionally', 4),
    ('less_active_strong_faith',  4, 'Less active but with a strong personal faith', 3),
    ('returning_to_activity',     5, 'Currently returning to activity', 3),
    ('reflection_rooted',         6, 'In a season of reflection — still rooted in the Restoration', 2)
  ) as v(code, ord, label, score_ord);

-- f2. Temple journey
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='faith'), 'f2', 2,
    'Where are you in your temple journey right now?',
    'radio', 'high',
    'High weight. Gradient scoring — first four options score as "temple-active" range; last two score as "transitioning" and are matched within that group or with flexible members.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('recommend_attending_regularly',   1, 'I currently hold a temple recommend and attend regularly', 6),
    ('recommend_attending_less',        2, 'I currently hold a recommend; attendance is less frequent', 5),
    ('recommend_recently_expired',      3, 'My recommend recently expired — planning to renew', 4),
    ('working_toward_worthiness',       4, 'I''m actively working toward temple worthiness', 4),
    ('past_recommend_different_path',   5, 'I''ve held a recommend in the past; currently on a different path', 2),
    ('not_focus_but_central',           6, 'Not my current focus, but the Restoration is central to my faith', 2)
  ) as v(code, ord, label, score_ord);

-- f3. Mission service
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='faith'), 'f3', 3,
    'Did you serve a full-time mission?',
    'radio', 'low',
    'Soft factor. Not a filter. Open-text follow-up for members who served is optional (future enhancement — not in v1).'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('served_foundational',     1, 'Yes — I served and it was foundational to my faith'),
    ('served_released_early',   2, 'Yes — but I was released early'),
    ('service_mission',         3, 'I served a service mission'),
    ('planned_circumstances',   4, 'I planned to serve but circumstances changed'),
    ('no_supported_other_ways', 5, 'No — I supported my faith in other ways'),
    ('no_comfortable',          6, 'No — and I''m comfortable with that')
  ) as v(code, ord, label);

-- f4. Daily prayer/scripture rating
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier,
   slider_min, slider_max, slider_step, scoring_notes)
values (
  (select id from public.survey_sections where code='faith'), 'f4', 4,
  'How central is daily personal prayer and scripture study to your life?',
  '1 = rarely practice, 10 = a non-negotiable daily anchor',
  'rating', 'medium',
  1, 10, 1,
  'Medium weight. Lifestyle compatibility — gaps of 4+ flag as notable differences in spiritual rhythm.'
);

-- f5. Importance of shared spiritual path (META)
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='faith'), 'f5', 5,
    'How important is it that your future spouse shares your current spiritual path?',
    'radio', 'meta',
    'Functions as each member''s tolerance-for-mismatch modifier. "Essential" tightens matching on f1/f2; "Not a primary factor" widens it.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('essential_same_place',    1, 'Essential — we need to be in the same place spiritually right now', 5),
    ('very_important_flex',     2, 'Very important — some flexibility on timing and specifics', 4),
    ('important_direction',     3, 'Important but not a dealbreaker — direction matters more than current status', 3),
    ('value_loosely',           4, 'I value faith compatibility but hold it loosely', 2),
    ('not_primary',             5, 'Not a primary factor for me', 1)
  ) as v(code, ord, label, score_ord);

-- f6. Temple marriage
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='faith'), 'f6', 6,
    'How do you feel about temple marriage?',
    'radio', 'high',
    'High weight. Gaps of 2+ between partners flag significant negative signal.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('only_path_eternal',       1, 'It''s the only path I''m pursuing — eternal sealing is my goal', 5),
    ('strongly_preferred',      2, 'Strongly preferred — I''d want to be sealed eventually even if civil first', 4),
    ('open_civil_then_sealed',  3, 'Open to civil marriage with the intent to be sealed later', 3),
    ('working_through',         4, 'I''m working through my feelings on temple marriage', 2),
    ('comfortable_civil',       5, 'I''m comfortable with a civil ceremony', 1)
  ) as v(code, ord, label, score_ord);

-- f7. Spiritual practices (multi-select checkbox)
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='faith'), 'f7', 7,
    'Which of these spiritual practices are a regular part of your life?',
    'checkbox', 'medium',
    'Medium weight. Overlap scored — shared practices correlate with shared spiritual rhythm.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('daily_prayer',           1, 'Daily personal prayer'),
    ('daily_scripture',        2, 'Daily scripture study'),
    ('weekly_sacrament',       3, 'Weekly sacrament attendance'),
    ('fhe',                    4, 'Family home evening (or similar weekly devotional time)'),
    ('regular_fasting',        5, 'Regular fasting'),
    ('ministering',            6, 'Visiting/ministering'),
    ('serving_poor',           7, 'Serving the poor and needy / caring for those in need'),
    ('journaling',             8, 'Journaling'),
    ('patriarchal_blessing',   9, 'Patriarchal blessing guidance'),
    ('temple_attendance',     10, 'Temple attendance (endowment, proxy work)'),
    ('callings_service',      11, 'Regular church service / callings')
  ) as v(code, ord, label);

-- f8. Testimony essay
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, char_limit, scoring_notes)
values (
  (select id from public.survey_sections where code='faith'), 'f8', 8,
  'In your own words, share a little about your testimony and what your faith in Christ means to you personally.',
  'This is one of the first things your matches will see. Be genuine and heartfelt.',
  'essay', 'llm_only', 800,
  'LLM analysis in stage 3. Used for depth, honesty, and compatibility of faith expression. Heavily weighted in the compatibility brief.'
);


-- =============================================================================
-- SECTION 2: FAMILY & FUTURE
-- =============================================================================

-- fm1. Number of children desired (slider)
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier,
   slider_min, slider_max, slider_step, slider_default, slider_unit, scoring_notes)
values (
  (select id from public.survey_sections where code='family'), 'fm1', 1,
  'How many children do you hope to have?',
  'Drag to your ideal number. If you''re open to what comes, set a midpoint.',
  'slider', 'high',
  0, 10, 1, 3, 'children',
  'High weight. Gaps of 3+ flag significant mismatch. 0-wanting members matched only with 0-wanting or "open to what comes" members.'
);

-- fm2. Gender roles in marriage
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='family'), 'fm2', 2,
    'How do you view traditional gender roles in marriage and family?',
    'Father as provider/presider/protector; mother as primary nurturer — the framework taught in The Family: A Proclamation to the World.',
    'radio', 'high',
    'High weight. Gaps of 2+ flag significant friction predictor.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('embrace_fully',           1, 'I embrace this framework fully — it''s the pattern I want to build our family around', 5),
    ('largely_embrace',         2, 'I largely embrace it, with flexibility where life requires', 4),
    ('value_principles_egal',   3, 'I value the principles but want a more egalitarian day-to-day partnership', 3),
    ('lean_egalitarian',        4, 'I lean egalitarian — we''d share roles based on strengths and circumstances', 2),
    ('still_working_out',       5, 'I''m still working out my views on this', 1)
  ) as v(code, ord, label, score_ord);

-- fm3. Family traditions importance (rating)
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier,
   slider_min, slider_max, slider_step, scoring_notes)
values (
  (select id from public.survey_sections where code='family'), 'fm3', 3,
  'How important is it that your home is built around strong family traditions — shared meals, family prayer, FHE, holidays?',
  '1 = flexible/casual approach, 10 = deeply structured family rhythms',
  'rating', 'medium',
  1, 10, 1,
  'Medium weight.'
);

-- fm4. Family of origin relationship
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='family'), 'fm4', 4,
    'What is your relationship with your own family of origin like?',
    'radio', 'medium',
    'Medium weight. Used by LLM in compatibility brief for context about how family dynamics may play out.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('very_close_central',      1, 'Very close — they are central to my life', 5),
    ('close_with_boundaries',   2, 'Close but with healthy boundaries', 4),
    ('cordial_not_involved',    3, 'Cordial but not deeply involved', 3),
    ('complicated',             4, 'Complicated — working through things', 2),
    ('estranged',               5, 'Estranged or minimal contact', 1)
  ) as v(code, ord, label, score_ord);

-- fm5. Financial approach
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='family'), 'fm5', 5,
    'How would you describe your financial approach to family life?',
    'radio', 'medium',
    'Medium weight.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('debt_free',           1, 'Debt-free focused — we live lean to stay out of debt', 5),
    ('conservative',        2, 'Conservative — live within our means, save consistently', 4),
    ('balanced',            3, 'Balanced — enjoy life now while planning for the future', 3),
    ('spontaneous',         4, 'More spontaneous — trust things will work out', 2),
    ('still_developing',    5, 'Still developing my financial philosophy', 1)
  ) as v(code, ord, label, score_ord);

-- fm6. Family vision essay
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, char_limit, scoring_notes)
values (
  (select id from public.survey_sections where code='family'), 'fm6', 6,
  'Describe the kind of home and family life you envision. What does a thriving eternal family look like to you?',
  'Paint a picture of your hopes and dreams for your future family.',
  'essay', 'llm_only', 700,
  'LLM analysis. Aspirational/future-vision dimension for compatibility brief.'
);

-- fm7. Parenting style
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='family'), 'fm7', 7,
    'How do you think about discipline, structure, and parenting style?',
    'radio', 'medium_high',
    'Medium-high weight. Gaps of 2+ flag daily-friction predictor.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('structured_consistent',   1, 'Structured and consistent — clear expectations, firm boundaries', 5),
    ('warm_authoritative',      2, 'Warm authoritative — high warmth, high standards, lots of communication', 4),
    ('relaxed_trust_based',     3, 'Relaxed and trust-based — kids learn by experience and natural consequences', 3),
    ('lean_on_partner',         4, 'I''d lean on what my partner brings — I''m flexible', 2),
    ('still_forming',           5, 'Still forming my philosophy — I''d want to discuss this together', 1)
  ) as v(code, ord, label, score_ord);


-- =============================================================================
-- SECTION 3: PERSONALITY & CHARACTER
-- =============================================================================

-- p1. Social energy
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='personality'), 'p1', 1,
    'How would you describe your social energy?',
    'radio', 'medium',
    'Medium weight. Moderate mismatch (2 points apart) is often complementary; extreme mismatch (4 points) is more challenging.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('strong_introvert',    1, 'Strong introvert — I recharge deeply alone', 1),
    ('more_introvert',      2, 'More introverted, but enjoy close-knit gatherings', 2),
    ('ambivert',            3, 'Ambiverted — I genuinely enjoy both', 3),
    ('more_extrovert',      4, 'More extroverted — I love social energy', 4),
    ('strong_extrovert',    5, 'Strong extrovert — I come alive around people', 5)
  ) as v(code, ord, label, score_ord);

-- p2. Conflict style
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='personality'), 'p2', 2,
    'When you have a serious disagreement with a partner, what is your natural tendency?',
    'radio', 'high',
    'High weight. Gottman-flavored conflict style. Avoidant + immediate-address pairings flagged as friction risk.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('immediate',           1, 'Address it immediately — I don''t like unresolved tension'),
    ('time_then_calm',      2, 'Give it a little time, then talk it through calmly'),
    ('need_space',          3, 'I need space to process before I can discuss it'),
    ('avoid_conflict',      4, 'I tend to avoid conflict and let things pass'),
    ('struggle',            5, 'I sometimes struggle with how to handle conflict well')
  ) as v(code, ord, label);

-- p3. Stress response
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='personality'), 'p3', 3,
    'When you''re under significant stress or pressure, how does it tend to show up?',
    'radio', 'medium_high',
    'Medium-high weight. Stress-response compatibility predicts marriage outcomes. LLM flags mismatched stress patterns in compatibility brief.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('quieter_withdraw',    1, 'I get quieter and withdraw'),
    ('irritable_short',     2, 'I become more irritable and short with people'),
    ('push_then_crash',     3, 'I push through and crash later'),
    ('faith_and_people',    4, 'I lean on my faith and trusted people'),
    ('control_what_can',    5, 'I try to control what I can'),
    ('still_learning',      6, 'I''m still learning how I handle stress')
  ) as v(code, ord, label);

-- p4. Humor
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='personality'), 'p4', 4,
    'How do you approach humor in a relationship?',
    'radio', 'low_medium',
    'Low-medium weight. Conversational tone match.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('humor_is_everything',     1, 'Humor is everything — we should laugh daily'),
    ('playful_substance',       2, 'I love playfulness, but substance matters more'),
    ('dry_wit',                 3, 'I appreciate dry wit and thoughtful humor'),
    ('serious_appreciate',      4, 'I''m more serious but enjoy when others bring lightness'),
    ('learning_playful',        5, 'I''m still learning to be more playful')
  ) as v(code, ord, label);

-- p5. Personality traits (multi-select tag, max 6)
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, max_selections, scoring_notes)
  values (
    (select id from public.survey_sections where code='personality'), 'p5', 5,
    'Which personality traits do you most identify with?',
    'tag', 'medium', 6,
    'Medium weight. Overlap scored; used heavily in compatibility brief for natural language description.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('empathetic',     1, 'Empathetic'),
    ('ambitious',      2, 'Ambitious'),
    ('patient',        3, 'Patient'),
    ('creative',       4, 'Creative'),
    ('organized',      5, 'Organized'),
    ('spontaneous',    6, 'Spontaneous'),
    ('loyal',          7, 'Loyal'),
    ('intellectual',   8, 'Intellectual'),
    ('nurturing',      9, 'Nurturing'),
    ('adventurous',   10, 'Adventurous'),
    ('grounded',      11, 'Grounded'),
    ('optimistic',    12, 'Optimistic'),
    ('principled',    13, 'Principled'),
    ('funny',         14, 'Funny'),
    ('thoughtful',    15, 'Thoughtful'),
    ('resilient',     16, 'Resilient'),
    ('gentle',        17, 'Gentle'),
    ('passionate',    18, 'Passionate')
  ) as v(code, ord, label);

-- p6. Character essay
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, char_limit, scoring_notes)
values (
  (select id from public.survey_sections where code='personality'), 'p6', 6,
  'What do the people who love you most say about you? What would you most want a potential partner to know about your character?',
  'Be honest and specific — this is a chance to show who you really are.',
  'essay', 'llm_only', 700,
  'LLM analysis. Character dimension for compatibility brief.'
);

-- p7. Emotional overwhelm response (attachment-adjacent)
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='personality'), 'p7', 7,
    'When you feel emotionally overwhelmed in a close relationship, what do you tend to do?',
    'radio', 'high',
    'High weight. Attachment-adjacent — ECR-R flavored. Used by LLM to flag complementary vs. conflicting attachment patterns. Certain pairings (e.g., "seek connection" with "need space") create real dynamics worth naming.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('seek_connection',         1, 'Seek connection and talk it through with the person'),
    ('reach_out_others',        2, 'Reach out to others for perspective before engaging'),
    ('need_space_process',      3, 'Need space and time to process before I can re-engage'),
    ('work_internal_first',     4, 'Try to work through it internally before bringing it up'),
    ('still_learning',          5, 'I''m still learning what I need in those moments')
  ) as v(code, ord, label);


-- =============================================================================
-- SECTION 4: LIFESTYLE & INTERESTS
-- =============================================================================

-- l1. Hobbies and interests (multi-select tag, max 8)
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, max_selections, scoring_notes)
  values (
    (select id from public.survey_sections where code='lifestyle'), 'l1', 1,
    'What are your main hobbies and interests?',
    'tag', 'medium', 8,
    'Medium weight. Overlap scored.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('hiking_outdoors',     1, 'Hiking & outdoors'),
    ('music_instruments',   2, 'Music/playing instruments'),
    ('cooking_baking',      3, 'Cooking & baking'),
    ('reading',             4, 'Reading'),
    ('sports_athletics',    5, 'Sports & athletics'),
    ('pickleball',          6, 'Pickleball'),
    ('travel',              7, 'Travel'),
    ('service_volunteer',   8, 'Service & volunteering'),
    ('arts_crafts',         9, 'Arts & crafts'),
    ('gaming',             10, 'Gaming'),
    ('fitness_gym',        11, 'Fitness & gym'),
    ('gardening',          12, 'Gardening'),
    ('film_theater',       13, 'Film & theater'),
    ('camping',            14, 'Camping'),
    ('photography',        15, 'Photography'),
    ('technology',         16, 'Technology'),
    ('writing',            17, 'Writing'),
    ('dance',              18, 'Dance'),
    ('board_games',        19, 'Board games'),
    ('hunting_fishing',    20, 'Hunting & fishing'),
    ('fashion',            21, 'Fashion'),
    ('family_activities',  22, 'Family activities'),
    ('home_diy',           23, 'Home improvement / DIY'),
    ('cars_mechanical',    24, 'Cars / mechanical'),
    ('social_content',     25, 'Social media / content creation')
  ) as v(code, ord, label);

-- l2. Activity/fitness level
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='lifestyle'), 'l2', 2,
    'How would you describe your activity and fitness level?',
    'radio', 'medium',
    'Medium weight. Gaps of 3+ flag as lifestyle mismatch.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('very_active_daily',   1, 'Very active — daily exercise is non-negotiable', 5),
    ('active_3_5x',         2, 'Active — I work out 3-5x per week', 4),
    ('moderate',            3, 'Moderately active — I enjoy being active but it''s not a priority', 3),
    ('lightly_active',      4, 'Lightly active — walks, casual hikes', 2),
    ('mostly_sedentary',    5, 'Mostly sedentary — health is something I''m working on', 1)
  ) as v(code, ord, label, score_ord);

-- l3. Living situation / relocation
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='lifestyle'), 'l3', 3,
    'What is your current living situation and are you open to relocating?',
    'radio', 'high',
    'High weight. Paired with ws4 for combined relocation compatibility. Two "rooted" members in different regions = hard incompatibility.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('rooted',              1, 'I''m rooted where I am — relocation is unlikely', 1),
    ('region',              2, 'Open to relocating within my region', 2),
    ('us',                  3, 'Open to relocating within the US', 3),
    ('anywhere',            4, 'Open to anywhere — adventure awaits', 4),
    ('planning_relocate',   5, 'Currently planning to relocate', 4)
  ) as v(code, ord, label, score_ord);

-- l4. Home environment preference
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='lifestyle'), 'l4', 4,
    'What is your preference for the home environment you''d build together?',
    'radio', 'medium',
    'Medium weight.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('city',                1, 'City living — walkable, vibrant, urban'),
    ('suburban',            2, 'Suburban — good schools, space, community'),
    ('small_town_lds',      3, 'Small town — LDS community feel, tight-knit'),
    ('rural',               4, 'Rural — space, land, closer to nature'),
    ('no_preference',       5, 'No strong preference — open to wherever feels right')
  ) as v(code, ord, label);

-- l5. Importance of shared interests (META)
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier,
   slider_min, slider_max, slider_step, scoring_notes)
values (
  (select id from public.survey_sections where code='lifestyle'), 'l5', 5,
  'How important is it that you and your partner share significant hobbies or interests?',
  '1 = complete independence is fine, 10 = we need deep overlapping passions',
  'rating', 'meta',
  1, 10, 1,
  'Meta-question. Modifies how heavily l1 overlap scoring is weighted for this member.'
);

-- l6. Ideal Saturday
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='lifestyle'), 'l6', 6,
    'What does your ideal Saturday look like?',
    'radio', 'medium',
    'Medium weight.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('productive',      1, 'Productive — projects, errands, achievements'),
    ('adventurous',     2, 'Adventurous — hike, trip, something new'),
    ('social',          3, 'Social — friends, family, ward events'),
    ('restful',         4, 'Restful — home, cozy, recharging'),
    ('service',         5, 'Service-oriented — something meaningful for others')
  ) as v(code, ord, label);

-- l7. Passion essay
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, char_limit, scoring_notes)
values (
  (select id from public.survey_sections where code='lifestyle'), 'l7', 7,
  'Tell us about something you''re passionate about outside of church, work, and school — a cause, hobby, or pursuit that lights you up.',
  'The goal is to help your potential match see your full, vibrant self.',
  'essay', 'llm_only', 500,
  'LLM analysis. Vibrancy/personality dimension for compatibility brief.'
);


-- =============================================================================
-- SECTION 5: RELATIONSHIP & COURTSHIP
-- =============================================================================

-- r1. Marriage readiness
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='relationship'), 'r1', 1,
    'Where are you in your readiness for marriage?',
    'radio', 'high',
    'High weight. Major mismatches (actively seeking + still growing) create friction; similar-readiness pairings favored.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('actively_seeking',        1, 'Actively seeking — I''m ready when the right person comes', 5),
    ('ready_not_rushing',       2, 'Ready but not rushing — I want it to be right', 4),
    ('growing_into_readiness',  3, 'Still growing into readiness — maybe 1-2 years', 2),
    ('hurt_healing',            4, 'I''ve been hurt before and I''m healing — taking it slowly', 2),
    ('divorced_widowed_hopeful', 5, 'Divorced/widowed and cautiously hopeful', 3)
  ) as v(code, ord, label, score_ord);

-- r2. Courtship pace
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='relationship'), 'r2', 2,
    'What is your preferred pace for courtship?',
    'radio', 'medium',
    'Medium weight.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('intentional_focused', 1, 'Intentional and focused — 6-18 months to engagement'),
    ('unhurried_1_2y',      2, 'Unhurried — 1-2 years to know someone fully'),
    ('natural_no_timeline', 3, 'Whatever feels natural — no timeline pressure'),
    ('open_to_moving',      4, 'I''ve been slow before — I''m open to moving when it''s right'),
    ('spirit_guides',       5, 'The Spirit will guide the timing')
  ) as v(code, ord, label);

-- r3. Long-distance dating
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='relationship'), 'r3', 3,
    'Are you open to long-distance dating?',
    'radio', 'hard_filter',
    'Hard filter when combined with l3 and ws4. Two "local only" members in different regions = no match.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('distance_logistics',  1, 'Yes — distance is just logistics', 5),
    ('willing_strong',      2, 'Willing to try if the connection is strong', 4),
    ('local_open_regional', 3, 'Prefer local but open to regional', 3),
    ('couple_hours',        4, 'Only within a couple of hours', 2),
    ('local_only',          5, 'Looking for someone local only', 1)
  ) as v(code, ord, label, score_ord);

-- r4. Physical affection during courtship
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='relationship'), 'r4', 4,
    'How do you feel about physical affection (within LDS standards) during courtship?',
    'radio', 'medium',
    'Medium weight. Gaps of 2+ flag potential friction.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('very_reserved',       1, 'Very reserved — I prefer emotional/spiritual connection first', 1),
    ('modest_affection',    2, 'Modest affection — holding hands, brief embraces', 2),
    ('moderate_natural',    3, 'Moderate — affectionate naturally as trust builds', 3),
    ('warmly_affectionate', 4, 'Warmly affectionate — touch is how I connect', 4),
    ('still_figuring',      5, 'Still figuring out what feels right for me', 0)
  ) as v(code, ord, label, score_ord);

-- r5. Dealbreakers (multi-select toggle — each option is independent on/off)
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='relationship'), 'r5', 5,
    'Mark any of these as dealbreakers for you',
    'toggle', 'hard_filter',
    'Hard filters. Any toggled dealbreaker creates hard exclusion for members who match that attribute.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, is_dealbreaker_eligible)
select q.id, code, ord, label, true from q,
  (values
    ('has_children',            1, 'Has children from previous relationship'),
    ('divorced',                2, 'Divorced'),
    ('previously_sealed',       3, 'Has been previously sealed'),
    ('age_diff_10y',            4, 'Significant age difference (10+ years)'),
    ('different_ethnic_culture',5, 'Different ethnic/cultural background'),
    ('less_education',          6, 'Less education than you'),
    ('different_career_amb',    7, 'Different professional/career ambitions'),
    ('not_financially_stable',  8, 'Not yet financially stable'),
    ('cant_have_bio_children',  9, 'Unable to have biological children'),
    ('outside_country',        10, 'Lives outside my country')
  ) as v(code, ord, label);

-- r6. Feelings about partner with children
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='relationship'), 'r6', 6,
    'How do you feel about a partner who has children from a previous relationship?',
    'radio', 'medium',
    'Nuance layer on top of r5. A member who didn''t toggle "Has children" as a dealbreaker but answered "Would prefer someone without" gets soft-filtered away from members with children.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('open_blessing',           1, 'I''m open and see it as a blessing', 5),
    ('open_if_connect',         2, 'Open if we connect deeply — I''d embrace the children', 4),
    ('cautious_not_rule_out',   3, 'Cautious but wouldn''t rule it out', 3),
    ('prefer_without',          4, 'Would prefer someone without children', 1),
    ('have_children_understand',5, 'I have children too — I understand that path', 4)
  ) as v(code, ord, label, score_ord);

-- r7. Dating experience essay
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, char_limit, scoring_notes)
values (
  (select id from public.survey_sections where code='relationship'), 'r7', 7,
  'What has your experience with dating taught you? What are you looking for that you haven''t found yet?',
  'Be honest and vulnerable — this response helps our AI understand your heart.',
  'essay', 'llm_only', 700,
  'LLM analysis. Relational/vulnerable dimension for compatibility brief.'
);


-- =============================================================================
-- SECTION 6: WORK, SCHOOL & AMBITION
-- =============================================================================

-- ws1. Education level
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='work'), 'ws1', 1,
    'What is your current education level?',
    'radio', 'low_medium',
    'Low-medium weight. Soft compatibility signal, not hard filter.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('high_school',         1, 'High school graduate', 1),
    ('some_college',        2, 'Some college', 2),
    ('associates',          3, 'Associate''s degree', 3),
    ('bachelors',           4, 'Bachelor''s degree', 4),
    ('masters_plus',        5, 'Master''s degree or higher', 5),
    ('trade_certification', 6, 'Trade/technical certification', 3),
    ('currently_in_school', 7, 'Currently in school', 2)
  ) as v(code, ord, label, score_ord);

-- ws2. Occupation (open text)
insert into public.survey_questions
  (section_id, code, display_order, prompt, placeholder, response_type, weight_tier, scoring_notes)
values (
  (select id from public.survey_sections where code='work'), 'ws2', 2,
  'What is your current occupation or career field?',
  'E.g., "Registered Nurse," "Software Engineer," "Elementary School Teacher," "Stay-at-home parent," "Currently a student"',
  'text', 'low',
  'LLM uses in compatibility brief. Very soft career-cluster signal for matching.'
);

-- ws3. Relationship to work
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='work'), 'ws3', 3,
    'How would you describe your relationship to your work or career?',
    'radio', 'high',
    'High weight. Gaps of 3+ are significant mismatch; gaps of 2 are brief-worthy. Combined with fm2 for gender-role + career-drive nuanced scoring.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('deeply_driven',       1, 'Deeply driven — my work is core to my identity and calling', 6),
    ('ambitious_long_term', 2, 'Ambitious — I''m building something meaningful long-term', 5),
    ('engaged_balance',     3, 'Engaged — I care about my work but I work to live, not live to work', 4),
    ('practical_funds',     4, 'Practical — work funds the life I actually want to build', 3),
    ('in_transition',       5, 'In transition — I''m rethinking my career path right now', 2),
    ('family_first_design', 6, 'Family-first by design — my work serves my family, not the reverse', 1)
  ) as v(code, ord, label, score_ord);

-- ws4. Career flexibility for spouse/family
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='work'), 'ws4', 4,
    'Setting aside your general openness to moving — how flexible is your specific career path for your future spouse and family?',
    'radio', 'high',
    'High weight. Asymmetric scoring — combined flexibility of a pair matters, not identical answers.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('very_flexible',           1, 'Very flexible — I''d rebuild my career anywhere for the right marriage', 5),
    ('flexible_within_reason',  2, 'Flexible within reason — I''d consider a move if the opportunity were right for both of us', 4),
    ('somewhat_flexible',       3, 'Somewhat flexible — I have professional roots but I''m open', 3),
    ('not_very_flexible',       4, 'Not very flexible — my career is geographically and structurally specific', 2),
    ('calling_partner_comes',   5, 'I have a calling/path that won''t move easily — I''d need a partner who could come to me', 1)
  ) as v(code, ord, label, score_ord);

-- ws5. Honest professional state
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='work'), 'ws5', 5,
    'What''s the most honest thing about where you are educationally and professionally right now?',
    'radio', 'medium_high',
    'Medium-high weight. Stage-of-life compatibility signal.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('established_stable',          1, 'Established and stable in my field — confident in my trajectory'),
    ('building_hard',               2, 'Building hard — I''m in an intense growth phase right now'),
    ('just_starting',               3, 'Just starting out — early career, figuring it out'),
    ('mid_career_change',           4, 'Mid-career and considering a change'),
    ('school_full_time',            5, 'In school full-time, focused on finishing'),
    ('working_and_school',          6, 'Working and going to school simultaneously'),
    ('transition_rebuilding',       7, 'In a season of transition or rebuilding'),
    ('focus_family_healing',        8, 'Taking a season to focus on family, healing, or other priorities')
  ) as v(code, ord, label);

-- ws6. Importance of continued education/growth
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, scoring_notes)
  values (
    (select id from public.survey_sections where code='work'), 'ws6', 6,
    'How important is continued education and professional growth — for yourself and your future spouse?',
    'radio', 'medium_high',
    'Medium-high weight. "Mixed" answers flagged for LLM scrutiny — captures asymmetric expectations.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('essential_both_growing',  1, 'Essential — both of us should always be growing intellectually and professionally', 5),
    ('important_balance',       2, 'Important — I value growth but with reasonable life balance', 4),
    ('moderate_not_central',    3, 'Moderate — it''s good but not central to who I want us to be', 3),
    ('lower_priority',          4, 'Lower priority — I value other dimensions of growth more (spiritual, relational, family)', 2),
    ('mixed_asymmetric',        5, 'Mixed — important for me, less important that my spouse share this', 0)
  ) as v(code, ord, label, score_ord);


-- =============================================================================
-- SECTION 7: PROFILE & PHOTOS
-- pr3, pr4, pr5 are GROUPED — each sub-question is its own row, linked by group_code.
-- =============================================================================

-- pr1. Profile photos
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier,
   min_selections, max_selections, file_size_limit_mb, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr1', 1,
  'Upload your profile photos',
  'Add at least 3 photos. Include a clear face photo, a full-length photo, and one that shows your personality. Photos should be recent (within 12 months); at least one should clearly show your face without sunglasses or filters; at least one should show you full-length; at least one should show you in your natural element. Avoid: group photos where you''re hard to identify, car selfies, heavily filtered or edited photos.',
  'photo', 'llm_only',
  3, 8, 10,
  'Claude (stage 3) reviews photos for apparent age range, style, energy/vibe, and compatibility with partner''s stated preferences. NOT scored numerically. Photos displayed to both members at introduction stage for mutual approval before messaging opens.'
);

-- pr2. Instagram handle (optional)
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, placeholder, response_type, weight_tier, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr2', 2,
  'Your Instagram handle (optional)',
  'Helps us understand the fuller picture of your life — we''ll review your public photos during profile approval. Leave blank if you prefer not to share.',
  '@yourhandle',
  'text', 'low',
  'Admin context during one-time profile review. Not used programmatically.'
);

-- pr3. Physical details — GROUPED (3 sub-questions: height, build, style)

-- pr3_height: slider 54-84"
insert into public.survey_questions
  (section_id, code, display_order, prompt, response_type, weight_tier,
   slider_min, slider_max, slider_step, slider_default, slider_unit,
   group_code, group_label, group_position, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr3_height', 3,
  'Height',
  'slider', 'medium',
  54, 84, 1, 67, 'inches',
  'pr3', 'Your physical details', 1,
  'Used in matching against partner preferences (pr5).'
);

-- pr3_build: radio
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier,
     group_code, group_label, group_position, scoring_notes)
  values (
    (select id from public.survey_sections where code='profile'), 'pr3_build', 4,
    'Build',
    'radio', 'medium',
    'pr3', 'Your physical details', 2,
    'Used in matching against partner preferences (pr5).'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('slim_lean',           1, 'Slim / lean'),
    ('athletic_toned',      2, 'Athletic / toned'),
    ('average',             3, 'Average build'),
    ('curvy_full',          4, 'Curvy / full-figured'),
    ('muscular_stocky',     5, 'Muscular / stocky'),
    ('plus_sized',          6, 'Plus-sized'),
    ('prefer_not_say',      7, 'Prefer not to say')
  ) as v(code, ord, label);

-- pr3_style: tag, max 3
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier, max_selections,
     group_code, group_label, group_position, scoring_notes)
  values (
    (select id from public.survey_sections where code='profile'), 'pr3_style', 5,
    'Style / presentation',
    'tag', 'low_medium', 3,
    'pr3', 'Your physical details', 3,
    'Used by LLM for compatibility brief.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('polished',        1, 'Polished and put-together'),
    ('casual_comfort',  2, 'Casual and comfortable'),
    ('modest_classic',  3, 'Modest and classic'),
    ('outdoorsy',       4, 'Outdoorsy and practical'),
    ('trendy',          5, 'Trendy / fashion-forward'),
    ('understated',     6, 'Understated and simple'),
    ('formal',          7, 'Formal / professional')
  ) as v(code, ord, label);

-- pr4. Self-rating — GROUPED (2 sub-questions). PRIVATE — never displayed.
-- Framing text shown above the sliders is captured on pr4_others.

insert into public.survey_questions
  (section_id, code, display_order, prompt, framing_text, response_type, weight_tier,
   slider_min, slider_max, slider_step,
   group_code, group_label, group_position, is_private, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr4_others', 6,
  'How do you think most people would rate your physical attractiveness, 1-10?',
  'This is one of the harder questions on the survey. We''re asking not to judge you but to help you be matched with people in a similar range — your own sense of where you are is usually more accurate than a stranger''s. There are no wrong answers, and this information is never displayed to other members. Anchors: 1 = "not particularly striking", 5 = "average — similar to most people", 10 = "exceptionally attractive — turns heads regularly".',
  'rating', 'medium',
  1, 10, 1,
  'pr4', 'Self-rating: how would you describe your attractiveness?', 1, true,
  'Averaged with pr4_self to create a "range center" for matching. Combined with partner''s pr5 importance to determine match band width. NEVER displayed to any member or admin in UI. Strictly internal matching signal.'
);

insert into public.survey_questions
  (section_id, code, display_order, prompt, response_type, weight_tier,
   slider_min, slider_max, slider_step,
   group_code, group_label, group_position, is_private, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr4_self', 7,
  'How do you rate your own physical attractiveness, 1-10?',
  'rating', 'medium',
  1, 10, 1,
  'pr4', 'Self-rating: how would you describe your attractiveness?', 2, true,
  'Gap between pr4_others and pr4_self provides confidence signal for LLM. NEVER displayed.'
);

-- pr5. What you're drawn to — GROUPED (4 sub-questions)

-- pr5_age_range: checkbox multi-select
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier,
     group_code, group_label, group_position, scoring_notes)
  values (
    (select id from public.survey_sections where code='profile'), 'pr5_age_range', 8,
    'Age range you''re open to',
    'checkbox', 'hard_filter',
    'pr5', 'What are you drawn to?', 1,
    'Age range: hard filter.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('three_plus_younger',  1, '3+ years younger'),
    ('one_three_younger',   2, '1-3 years younger'),
    ('same_age',            3, 'Same age (±1 year)'),
    ('one_three_older',     4, '1-3 years older'),
    ('three_seven_older',   5, '3-7 years older'),
    ('seven_twelve_older',  6, '7-12 years older'),
    ('twelve_plus_older',   7, '12+ years older')
  ) as v(code, ord, label);

-- pr5_height_min: slider
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier,
   slider_min, slider_max, slider_step, slider_unit,
   group_code, group_label, group_position, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr5_height_min', 9,
  'Height preference: minimum',
  'Most people are drawn to a range rather than a specific height. Set your range honestly — leaving it wide is fine.',
  'slider', 'medium',
  54, 84, 1, 'inches',
  'pr5', 'What are you drawn to?', 2,
  'Soft filter with tolerance against partner''s pr3_height.'
);

-- pr5_height_max: slider
insert into public.survey_questions
  (section_id, code, display_order, prompt, response_type, weight_tier,
   slider_min, slider_max, slider_step, slider_unit,
   group_code, group_label, group_position, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr5_height_max', 10,
  'Height preference: maximum',
  'slider', 'medium',
  54, 84, 1, 'inches',
  'pr5', 'What are you drawn to?', 3,
  'Soft filter with tolerance against partner''s pr3_height.'
);

-- pr5_build_pref: checkbox multi
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier,
     group_code, group_label, group_position, scoring_notes)
  values (
    (select id from public.survey_sections where code='profile'), 'pr5_build_pref', 11,
    'Build preferences you''re drawn to',
    'checkbox', 'medium',
    'pr5', 'What are you drawn to?', 4,
    'Soft filter; "open to a wide range" scores as compatible with all.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label)
select q.id, code, ord, label from q,
  (values
    ('slim_lean',           1, 'Slim / lean'),
    ('athletic_toned',      2, 'Athletic / toned'),
    ('average',             3, 'Average build'),
    ('curvy_full',          4, 'Curvy / full-figured'),
    ('muscular_stocky',     5, 'Muscular / stocky'),
    ('plus_sized',          6, 'Plus-sized'),
    ('open_wide_range',     7, 'I''m genuinely open to a wide range')
  ) as v(code, ord, label);

-- pr5_attraction_importance: META — modifies match band width
with q as (
  insert into public.survey_questions
    (section_id, code, display_order, prompt, response_type, weight_tier,
     group_code, group_label, group_position, scoring_notes)
  values (
    (select id from public.survey_sections where code='profile'), 'pr5_attraction_importance', 12,
    'How important is physical attraction to you in partner selection, relative to other factors?',
    'radio', 'meta',
    'pr5', 'What are you drawn to?', 5,
    'Modifies how tightly matching engine respects member''s self-rating range.'
  )
  returning id
)
insert into public.survey_options (question_id, code, display_order, label, score_ordinal)
select q.id, code, ord, label, score_ord from q,
  (values
    ('essential_strong',        1, 'Essential — I need to feel strong physical attraction from the start', 5),
    ('very_important',          2, 'Very important — it needs to be there, but personality and faith carry significant weight too', 4),
    ('important_one_of_many',   3, 'Important, but one of many factors I weigh together', 3),
    ('moderate_can_grow',       4, 'Moderate — I''m open; attraction can grow as I get to know someone', 2),
    ('lower_priority',          5, 'Lower priority — connection matters most; attraction follows', 1)
  ) as v(code, ord, label, score_ord);

-- pr6. Bio essay
insert into public.survey_questions
  (section_id, code, display_order, prompt, helper_text, response_type, weight_tier, char_limit, scoring_notes)
values (
  (select id from public.survey_sections where code='profile'), 'pr6', 13,
  'Write a short bio introducing yourself. This is the first thing a potential match will read about you. Don''t repeat what you''ve already shared about your faith or your character — let them meet the you that shows up in daily life. What are you like to be around? What do you find yourself talking about? What''s a small thing that brings you joy?',
  'Let your voice come through. The goal isn''t to impress — it''s to sound like you.',
  'essay', 'llm_only', 600,
  'LLM voice sample. Shapes the tone of the compatibility brief for this member. Used in introduction display.'
);


-- =============================================================================
-- Verification: should output 7 sections, 53 question rows
-- (48 spec questions, but pr3/pr4/pr5 expand into 9 sub-question rows total
--  vs 3 spec entries → +6 net = 54... let me recount:
--   pr3 (1 spec) → pr3_height, pr3_build, pr3_style (3 rows) → +2
--   pr4 (1 spec) → pr4_others, pr4_self (2 rows) → +1
--   pr5 (1 spec) → pr5_age_range, pr5_height_min, pr5_height_max,
--                  pr5_build_pref, pr5_attraction_importance (5 rows) → +4
--  Total: 48 + 7 = 55. Let me run this and verify.)
-- =============================================================================

-- The actual count check (uncomment to run after seeding):
-- select count(*) as total_questions from public.survey_questions;
-- select s.code, count(q.id) as question_count
--   from public.survey_sections s left join public.survey_questions q on q.section_id = s.id
--   group by s.code, s.display_order order by s.display_order;
