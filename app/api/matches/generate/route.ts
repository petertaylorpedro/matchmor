// ============================================================
// app/api/matches/generate/route.ts
// POST — Generate a new match between two members
// Admin-only endpoint — called from the admin dashboard
// or by a scheduled cron job
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { generateCompatibility, type MemberSnapshot } from '@/lib/matching'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  // Verify admin auth (simple secret header for now)
  const authHeader = req.headers.get('x-admin-secret')
  if (authHeader !== process.env.APP_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { memberAId, memberBId } = await req.json()

    if (!memberAId || !memberBId) {
      return NextResponse.json({ error: 'Both member IDs required' }, { status: 400 })
    }

    // ── FETCH BOTH MEMBERS ──
    const [snapshotA, snapshotB] = await Promise.all([
      fetchMemberSnapshot(memberAId),
      fetchMemberSnapshot(memberBId),
    ])

    if (!snapshotA || !snapshotB) {
      return NextResponse.json({ error: 'One or both members not found' }, { status: 404 })
    }

    // ── GENERATE COMPATIBILITY VIA CLAUDE ──
    console.log(`[match] Generating compatibility: ${memberAId} ↔ ${memberBId}`)
    const result = await generateCompatibility(snapshotA, snapshotB)

    // ── SAVE MATCH TO DATABASE ──
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .insert({
        member_a_id: memberAId,
        member_b_id: memberBId,
        overall_score: result.overallScore,
        dimension_scores: result.dimensionScores,
        brief_ai: result.brief,
        brief_summary: result.briefSummary,
        friction_note: result.frictionNote,
        convo_starters: result.convoStarters,
        status: 'sent',
        sent_at: new Date().toISOString(),
        generated_by: 'ai',
      })
      .select()
      .single()

    if (matchError) throw matchError

    // ── SAVE DATE SUGGESTIONS ──
    await supabaseAdmin
      .from('date_suggestions')
      .insert({
        match_id: match.id,
        suggestions: result.dateIdeas,
      })

    // ── NOTIFY BOTH MEMBERS ──
    await Promise.all([
      sendMatchNotification(snapshotA, snapshotB, match.id, result),
      sendMatchNotification(snapshotB, snapshotA, match.id, result),
    ])

    console.log(`[match] Created match ${match.id} — score: ${result.overallScore}%`)

    return NextResponse.json({
      success: true,
      matchId: match.id,
      overallScore: result.overallScore,
      dimensionScores: result.dimensionScores,
    })

  } catch (err) {
    console.error('[match/generate] error:', err)
    return NextResponse.json({ error: 'Failed to generate match' }, { status: 500 })
  }
}

// ── FETCH FULL MEMBER SNAPSHOT ──
async function fetchMemberSnapshot(profileId: string): Promise<MemberSnapshot | null> {
  const [profileRes, detailsRes, surveyRes] = await Promise.all([
    supabaseAdmin.from('profiles').select('*').eq('id', profileId).single(),
    supabaseAdmin.from('profile_details').select('*').eq('profile_id', profileId).single(),
    supabaseAdmin.from('survey_responses').select('*').eq('profile_id', profileId).single(),
  ])

  if (profileRes.error || !profileRes.data) return null

  return {
    profile: profileRes.data,
    details: detailsRes.data!,
    survey: surveyRes.data!,
  }
}

// ── SEND MATCH NOTIFICATION EMAIL ──
async function sendMatchNotification(
  recipient: MemberSnapshot,
  matchedWith: MemberSnapshot,
  matchId: string,
  result: Awaited<ReturnType<typeof generateCompatibility>>
) {
  const p = recipient.profile
  const other = matchedWith.profile

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: p.email,
    subject: `✦ ${p.first_name} — a new introduction is ready (${result.overallScore}% match)`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#2A1E10">
        <div style="font-size:24px;margin-bottom:20px">
          <span style="font-weight:300">match</span><span style="font-weight:700;font-style:italic;color:#C9A84C">Mor</span>
        </div>
        <h1 style="font-weight:300;font-size:28px;line-height:1.25;color:#2A1E10;margin-bottom:16px">
          ${p.first_name} — your introduction<br>
          <em style="color:#C9A84C">is ready.</em>
        </h1>
        <p style="font-size:14px;line-height:1.85;color:#6B4C32;margin-bottom:20px">
          We've prepared a compatibility brief for you. 
          Your match scored <strong style="color:#C9A84C">${result.overallScore}%</strong> — 
          and the brief explains exactly why this introduction makes sense.
        </p>
        <div style="background:#FAFAF7;border:1px solid #E8E0D0;border-radius:4px;padding:20px 24px;margin:20px 0">
          <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin-bottom:10px">Why This Introduction</div>
          <p style="font-size:14px;color:#555;line-height:1.75;margin:0;font-style:italic">"${result.briefSummary}"</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches/${matchId}"
           style="display:inline-block;background:#2A1E10;color:#F5F0E8;padding:13px 28px;border-radius:3px;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:8px 0">
          Read the Full Brief →
        </a>
        <p style="font-size:12px;color:#AAA;margin-top:24px;line-height:1.6">
          This introduction expires in 7 days. Take your time — but not too much.
        </p>
      </div>
    `
  })
}
