// ============================================================
// app/api/waitlist/route.ts
// POST — Join the founding member waitlist
// Called from the landing page signup form
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Generate FM-XXXXXX reference code
function generateFoundingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = 'FM-'
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)]
  }
  return ref
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName, lastName, location, gender } = body

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Email and first name required' }, { status: 400 })
    }

    // Check for duplicate
    const { data: existing } = await supabaseAdmin
      .from('waitlist')
      .select('id, founding_ref')
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      // Already on waitlist — return their ref code gracefully
      return NextResponse.json({
        success: true,
        alreadyJoined: true,
        foundingRef: existing.founding_ref,
      })
    }

    // Get current count for founding number
    const { count } = await supabaseAdmin
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const foundingNum = (count || 0) + 1
    const foundingRef = generateFoundingRef()

    // Insert waitlist record
    const { error: insertError } = await supabaseAdmin
      .from('waitlist')
      .insert({
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName || null,
        location: location || null,
        gender: gender || null,
        founding_ref: foundingRef,
        founding_num: foundingNum,
      })

    if (insertError) throw insertError

    // Send confirmation email
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: `✦ ${firstName} — you're Founding Member #${foundingNum}. Welcome to matchMor.`,
      html: buildWelcomeEmail({ firstName, foundingNum, foundingRef }),
    })

    return NextResponse.json({
      success: true,
      foundingNum,
      foundingRef,
    })

  } catch (err) {
    console.error('[waitlist] error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

function buildWelcomeEmail(params: {
  firstName: string
  foundingNum: number
  foundingRef: string
}): string {
  const { firstName, foundingNum, foundingRef } = params
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 20px;color:#2A1E10">
      <div style="font-size:26px;margin-bottom:4px">
        <span style="font-weight:300">match</span><span style="font-weight:700;font-style:italic;color:#C9A84C">Mor</span>
      </div>
      <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#AAA;margin-bottom:24px">
        Eternal Connections, Intelligently Made.
      </div>
      <hr style="border:none;border-top:2px solid #C9A84C;margin-bottom:28px">
      <h1 style="font-weight:300;font-size:32px;line-height:1.25;color:#2A1E10;margin-bottom:20px">
        ${firstName}, you're in.<br>
        <em style="color:#C9A84C">Welcome to the founding cohort.</em>
      </h1>
      <p style="font-size:14px;line-height:1.85;color:#6B4C32;margin-bottom:16px">
        You just claimed founding spot <strong style="color:#2A1E10">#${foundingNum}</strong> at matchMor — the first AI-powered matchmaking platform built specifically for Latter-day Saints.
      </p>
      <div style="background:#FAFAF7;border-left:3px solid #C9A84C;padding:18px 22px;margin:20px 0;border-radius:0 4px 4px 0">
        <p style="margin:0 0 10px;font-size:13px;color:#555"><strong style="color:#2A1E10">✦ Complete your 48-question compatibility survey</strong><br>Takes about 10 minutes. This is what our AI uses to find your matches.</p>
        <p style="margin:0 0 10px;font-size:13px;color:#555"><strong style="color:#2A1E10">✦ We review your profile by hand</strong><br>Every founding member profile is personally reviewed before your first introduction.</p>
        <p style="margin:0;font-size:13px;color:#555"><strong style="color:#2A1E10">✦ Your first introduction arrives</strong><br>One door, opened with intention. Not a list — one curated match.</p>
      </div>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboard" 
         style="display:inline-block;background:#2A1E10;color:#F5F0E8;padding:13px 28px;border-radius:3px;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin:8px 0 24px">
        Complete My Profile →
      </a>
      <div style="background:#2A1E10;color:rgba(245,240,232,0.75);border-radius:4px;padding:18px 22px;margin:24px 0;font-style:italic;font-size:15px;line-height:1.7">
        "And whoso findeth a wife findeth a good thing, and obtaineth favour of the Lord."
        <div style="font-size:11px;font-style:normal;color:#C9A84C;margin-top:8px;letter-spacing:2px;text-transform:uppercase">Proverbs 18:22</div>
      </div>
      <p style="font-size:13px;color:#888;margin-top:20px">Your founding member reference: 
        <code style="background:#FFF8E8;border:1px solid #E8C96A;border-radius:2px;padding:3px 10px;font-family:monospace;color:#8A6A20">${foundingRef}</code>
      </p>
      <hr style="border:none;border-top:1px solid #F0EDE8;margin:28px 0">
      <p style="font-size:11px;color:#AAA;line-height:1.7">
        matchMor, LLC · Provo, Utah · matchmor.com<br>
        <a href="#" style="color:#C9A84C;text-decoration:none">Unsubscribe</a> · 
        <a href="#" style="color:#C9A84C;text-decoration:none">Privacy Policy</a>
      </p>
    </div>
  `
}
