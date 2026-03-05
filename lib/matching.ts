// ============================================================
// lib/matching.ts
// Anthropic AI matching engine
// Generates compatibility scores + briefs between two members
// ============================================================

import Anthropic from '@anthropic-ai/sdk'
import type { Profile, ProfileDetails, SurveyResponse } from './supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ── TYPES ──
export interface MemberSnapshot {
  profile: Profile
  details: ProfileDetails
  survey: SurveyResponse
}

export interface CompatibilityResult {
  overallScore: number
  dimensionScores: {
    faithAlignment: number
    familyVision: number
    personalityFit: number
    communicationStyle: number
    lifestyle: number
    values: number
    emotionalMaturity: number
    practicalCompatibility: number
  }
  brief: string            // full AI-written compatibility brief (markdown)
  briefSummary: string     // 1-sentence summary
  frictionNote: string     // the one thing to be aware of
  convoStarters: string[]  // 5 conversation starters
  dateIdeas: DateIdea[]    // 3-5 curated date ideas
}

export interface DateIdea {
  icon: string
  name: string
  description: string
  tag: string
  whyThisPair: string
}

// ── FAITH TRACK LABELS ──
const trackLabels: Record<string, string> = {
  t1: 'Orthodox — temple-centered, fully active, covenant-focused',
  t2: 'Aspirational — active and faith-grounded, on their own timeline',
  t3: 'Open — culturally and spiritually LDS, non-traditional path',
}

// ── BUILD MEMBER SUMMARY FOR AI ──
function buildMemberSummary(m: MemberSnapshot, label: 'Member A' | 'Member B'): string {
  const p = m.profile
  const d = m.details
  const s = m.survey?.responses || {}

  return `
## ${label}
- Name: ${p.first_name}, Age: ${p.birth_date ? new Date().getFullYear() - new Date(p.birth_date).getFullYear() : 'unknown'}
- Location: ${p.location_city}, ${p.location_state}
- Faith Track: ${trackLabels[p.faith_track] || p.faith_track}
- Occupation: ${p.occupation || 'not specified'}
- Temple endowed: ${d.temple_endowed ? 'Yes' : 'No'}
- Temple recommend: ${d.temple_recommend ? 'Yes' : 'No'}
- Sealing importance (1-5): ${d.sealing_importance || 'not answered'}
- Mission: ${d.mission_served || 'not specified'}
- Church activity: ${d.church_activity || 'not specified'}
- Faith in own words: "${d.faith_description || 'not provided'}"
- Children desired: ${d.children_desired || 'not specified'}
- Family culture vision: "${d.family_culture || 'not provided'}"
- Recharge style: ${d.recharge_style || 'not specified'}
- Love language: ${d.love_language || 'not specified'}
- Sunday afternoon: "${d.sunday_afternoon || 'not provided'}"
- What they're looking for: "${d.looking_for || 'not provided'}"
- Interests: ${(d.interests || []).join(', ') || 'not specified'}
- Survey dimension scores: ${JSON.stringify(s)}
`.trim()
}

// ── GENERATE COMPATIBILITY ──
export async function generateCompatibility(
  memberA: MemberSnapshot,
  memberB: MemberSnapshot
): Promise<CompatibilityResult> {

  const summaryA = buildMemberSummary(memberA, 'Member A')
  const summaryB = buildMemberSummary(memberB, 'Member B')

  const locationA = `${memberA.profile.location_city}, ${memberA.profile.location_state}`
  const locationB = `${memberB.profile.location_city}, ${memberB.profile.location_state}`
  const sharedLocation = locationA === locationB
    ? locationA
    : `${locationA} / ${locationB}`

  const prompt = `You are matchMor's AI matching engine — the first AI matchmaking system built specifically for Latter-day Saints.

You have been given profiles for two members. Your task is to:
1. Score their compatibility across 8 dimensions (0–100 each)
2. Calculate an overall weighted compatibility score
3. Write a warm, specific, honest compatibility brief that will be shown to both members before they message each other
4. Identify one genuine friction point to be aware of
5. Suggest 5 natural conversation starters
6. Suggest 3–5 curated first date ideas for their specific location and shared interests

MEMBER PROFILES:
${summaryA}

${summaryB}

THEIR LOCATION(S): ${sharedLocation}

SCORING WEIGHTS:
- Faith Alignment: 25%
- Family Vision: 20%
- Values: 20%
- Personality Fit: 15%
- Communication Style: 10%
- Lifestyle: 5%
- Emotional Maturity: 3%
- Practical Compatibility: 2%

TONE GUIDANCE:
- Write as a thoughtful, warm matchmaker who knows both people personally
- Be specific — reference actual things they wrote, not generic observations
- Be honest about the friction point — a gentle, specific warning is more valuable than vague reassurance
- Adapt language to their faith tracks:
  - Orthodox (t1): covenant language, temple references are natural
  - Aspirational (t2): faith-honoring but no pressure toward specific milestones
  - Open (t3): values-focused, faith-respectful but non-prescriptive
- The brief will be read by BOTH members before their first message — it should create anticipation, not overwhelm

Respond ONLY with valid JSON in this exact structure:
{
  "overallScore": 91,
  "dimensionScores": {
    "faithAlignment": 95,
    "familyVision": 92,
    "personalityFit": 78,
    "communicationStyle": 88,
    "lifestyle": 82,
    "values": 96,
    "emotionalMaturity": 85,
    "practicalCompatibility": 90
  },
  "brief": "Full markdown compatibility brief here...",
  "briefSummary": "One sentence summary of why this introduction makes sense.",
  "frictionNote": "Honest, specific description of the one thing to be aware of.",
  "convoStarters": [
    "Ask about their mission to...",
    "What their Sunday afternoons look like",
    "The last book that changed how they think",
    "What service means to them personally",
    "Their family dinner table culture growing up"
  ],
  "dateIdeas": [
    {
      "icon": "🌿",
      "name": "Temple Grounds Walk",
      "description": "A Sunday evening walk around the Provo temple grounds...",
      "tag": "Recommended",
      "whyThisPair": "Specific reason this date suits this particular pair"
    }
  ]
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')

  // Strip any markdown fences if present
  const clean = text.replace(/```json\n?|\n?```/g, '').trim()
  const result = JSON.parse(clean) as CompatibilityResult

  return result
}

// ── GENERATE POST-DATE COACHING ──
export async function generateCoachingNote(params: {
  profile: Profile
  matchProfile: Profile
  reflection: {
    overallRating: number
    spiritualEase: string
    surpriseText: string
    frictionObserved: string
    seeAgain: string
    freeText: string
  }
  matchScore: number
  frictionNote: string   // the friction we flagged in the original brief
}): Promise<string> {

  const { profile, matchProfile, reflection, matchScore, frictionNote } = params

  const prompt = `You are matchMor's coaching AI — a warm, perceptive, and spiritually grounded guide for Latter-day Saint singles navigating intentional dating.

A member has just submitted their post-date reflection. Write them a personal coaching note.

MEMBER: ${profile.first_name}, ${profile.gender}, Faith Track: ${trackLabels[profile.faith_track]}
THEIR DATE: ${matchProfile.first_name}
MATCH SCORE: ${matchScore}%
FRICTION WE FLAGGED IN THE BRIEF: "${frictionNote}"

THEIR REFLECTION:
- Overall rating: ${reflection.overallRating}/5
- Felt spiritually at ease: ${reflection.spiritualEase}
- What surprised them: "${reflection.surpriseText}"
- What they observed about the friction point: "${reflection.frictionObserved}"
- Would see them again: ${reflection.seeAgain}
- Free text: "${reflection.freeText}"

COACHING GUIDELINES:
- Address ${profile.first_name} directly and personally
- Notice 2–3 specific things from their reflection that reveal something meaningful
- Gently point toward any patterns or insights they may not have named themselves
- If they flagged the friction point, respond to what they observed specifically
- Offer one practical, actionable suggestion for a second date or next conversation (if seeAgain = yes/maybe)
- Keep it under 350 words — this is a personal note, not an essay
- Tone: warm, perceptive, spiritually grounded — like a wise friend who happens to know both people
- Adapt to their faith track:
  - t1: covenant-aware, can reference spiritual promptings naturally
  - t2: faith-honoring, no pressure toward milestones
  - t3: values-focused, respectful of their personal faith expression
- End with a forward-looking note — what to pay attention to next

Write the coaching note in plain text (no markdown headers). It should read like a personal letter, not a report.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  })

  return response.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('')
}
