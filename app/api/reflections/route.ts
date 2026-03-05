// ============================================================
// app/api/reflections/route.ts
// POST — Submit a post-date reflection
// Triggers AI coaching note generation
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { generateCoachingNote } from '@/lib/matching'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      matchId,
      profileId,
      overallRating,
      spiritualEase,
      surpriseText,
      frictionObserved,
      seeAgain,
      freeText,
    } = body

    // ── VERIFY MEMBER IS PART OF THIS MATCH ──
    const { data: match, error: matchError } = await supabaseAdmin
      .from('matches')
      .select('*, member_a_id, member_b_id, overall_score, friction_note')
      .eq('id', matchId)
      .single()

    if (matchError || !match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    const isParticipant = match.member_a_id === profileId || match.member_b_id === profileId
    if (!isParticipant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── SAVE REFLECTION ──
    const { data: reflection, error: reflError } = await supabaseAdmin
      .from('reflections')
      .insert({
        match_id: matchId,
        profile_id: profileId,
        overall_rating: overallRating,
        spiritual_ease: spiritualEase,
        surprise_text: surpriseText,
        friction_observed: frictionObserved,
        see_again: seeAgain,
        free_text: freeText,
      })
      .select()
      .single()

    if (reflError) throw reflError

    // ── FETCH BOTH PROFILES FOR COACHING ──
    const otherMemberId = match.member_a_id === profileId
      ? match.member_b_id
      : match.member_a_id

    const [{ data: profile }, { data: matchProfile }] = await Promise.all([
      supabaseAdmin.from('profiles').select('*').eq('id', profileId).single(),
      supabaseAdmin.from('profiles').select('*').eq('id', otherMemberId).single(),
    ])

    if (!profile || !matchProfile) throw new Error('Profiles not found')

    // ── GENERATE COACHING NOTE via Claude ──
    const coachingNote = await generateCoachingNote({
      profile,
      matchProfile,
      reflection: {
        overallRating,
        spiritualEase,
        surpriseText,
        frictionObserved,
        seeAgain,
        freeText,
      },
      matchScore: match.overall_score,
      frictionNote: match.friction_note,
    })

    // ── SAVE COACHING NOTE ──
    await supabaseAdmin
      .from('reflections')
      .update({
        coaching_note: coachingNote,
        coaching_sent_at: new Date().toISOString(),
      })
      .eq('id', reflection.id)

    // ── SEND COACHING EMAIL ──
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: profile.email,
      subject: `Your coaching note from matchMor — after your date with ${matchProfile.first_name}`,
      html: buildCoachingEmail({
        firstName: profile.first_name,
        matchFirstName: matchProfile.first_name,
        coachingNote,
        matchId,
      }),
    })

    return NextResponse.json({
      success: true,
      reflectionId: reflection.id,
      coachingNote,
    })

  } catch (err) {
    console.error('[reflections] error:', err)
    return NextResponse.json({ error: 'Failed to save reflection' }, { status: 500 })
  }
}

function buildCoachingEmail(params: {
  firstName: string
  matchFirstName: string
  coachingNote: string
  matchId: string
}): string {
  const { firstName, matchFirstName, coachingNote, matchId } = params
  const paragraphs = coachingNote
    .split('\n\n')
    .filter(Boolean)
    .map(p => `<p style="font-size:14px;line-height:1.85;color:#555;margin-bottom:14px">${p}</p>`)
    .join('')

  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#2A1E10">
      <div style="font-size:24px;margin-bottom:20px">
        <span style="font-weight:300">match</span><span style="font-weight:700;font-style:italic;color:#C9A84C">Mor</span>
      </div>
      <h1 style="font-weight:300;font-size:28px;line-height:1.25;color:#2A1E10;margin-bottom:8px">
        ${firstName} — here's what<br>
        <em style="color:#C9A84C">we noticed.</em>
      </h1>
      <p style="font-size:12px;color:#AAA;margin-bottom:24px;letter-spacing:2px;text-transform:uppercase">
        After your date with ${matchFirstName}
      </p>
      <hr style="border:none;border-top:1px solid #E8E0D0;margin-bottom:24px">
      ${paragraphs}
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/matches/${matchId}"
         style="display:inline-block;background:#2A1E10;color:#F5F0E8;padding:12px 24px;border-radius:3px;text-decoration:none;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-top:8px">
        Back to Your Introduction →
      </a>
      <hr style="border:none;border-top:1px solid #F0EDE8;margin:28px 0">
      <p style="font-size:11px;color:#AAA">matchMor, LLC · matchmor.com</p>
    </div>
  `
}
