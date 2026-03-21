import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateFoundingRef(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = 'FM-'
  for (let i = 0; i < 6; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)]
  }
  return ref
}

function confirmationEmail(firstName: string, foundingNum: number, foundingRef: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to matchMor</title>
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <tr>
        <td style="background:#3D2B1A;padding:40px;text-align:center;border-radius:6px 6px 0 0;">
          <div style="font-family:Georgia,serif;font-size:32px;color:#F5F0E8;font-weight:400;letter-spacing:0.02em;">
            match<span style="color:#C9A84C;font-weight:700;font-style:italic;">Mor</span>
          </div>
          <div style="font-size:11px;color:rgba(245,240,232,0.4);letter-spacing:0.2em;text-transform:uppercase;margin-top:8px;">
            Founding Member Confirmation
          </div>
        </td>
      </tr>

      <tr>
        <td style="height:3px;background:#C9A84C;"></td>
      </tr>

      <tr>
        <td style="background:#ffffff;padding:48px 48px 40px;">

          <p style="font-family:Georgia,serif;font-size:26px;color:#3D2B1A;font-weight:400;margin:0 0 8px;">
            You're in, ${firstName}.
          </p>
          <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;color:#6B4C32;line-height:1.75;margin:0 0 32px;">
            Welcome to the matchMor founding cohort. You've claimed one of just 200 founding member spots — and we're grateful you're here.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border:1px solid rgba(201,168,76,0.3);border-radius:6px;margin-bottom:32px;">
            <tr>
              <td style="padding:28px 32px;">
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Your Founding Member Details</div>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;">
                      <div style="font-size:11px;color:#6B4C32;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">Member Number</div>
                      <div style="font-family:Georgia,serif;font-size:22px;color:#3D2B1A;font-weight:600;">Founding Member #${foundingNum}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-top:1px solid rgba(61,43,26,0.1);padding-top:12px;">
                      <div style="font-size:11px;color:#6B4C32;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:4px;">Reference Code</div>
                      <div style="font-family:'Courier New',monospace;font-size:20px;color:#C9A84C;font-weight:700;letter-spacing:0.1em;">${foundingRef}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;margin:0 0 16px;">What You've Secured</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(61,43,26,0.08);">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;font-size:16px;vertical-align:top;padding-top:1px;">&#127963;&#65039;</td>
                  <td>
                    <div style="font-family:Georgia,serif;font-size:15px;color:#3D2B1A;font-weight:600;">Six Months Free</div>
                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#6B4C32;line-height:1.6;margin-top:2px;">Full matchMor membership — introductions, coaching, date ideas — at no cost for your first six months. A $109.80 value.</div>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(61,43,26,0.08);">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;font-size:16px;vertical-align:top;padding-top:1px;">&#128274;</td>
                  <td>
                    <div style="font-family:Georgia,serif;font-size:15px;color:#3D2B1A;font-weight:600;">Rate Locked at $18.30/month — Forever</div>
                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#6B4C32;line-height:1.6;margin-top:2px;">Your founding rate is permanently locked, regardless of future pricing changes.</div>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid rgba(61,43,26,0.08);">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;font-size:16px;vertical-align:top;padding-top:1px;">&#10022;</td>
                  <td>
                    <div style="font-family:Georgia,serif;font-size:15px;color:#3D2B1A;font-weight:600;">White-Glove Onboarding</div>
                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#6B4C32;line-height:1.6;margin-top:2px;">Every founding member profile is personally reviewed by the matchMor team before your first introduction.</div>
                  </td>
                </tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;">
                <table cellpadding="0" cellspacing="0"><tr>
                  <td style="width:28px;font-size:16px;vertical-align:top;padding-top:1px;">&#128155;</td>
                  <td>
                    <div style="font-family:Georgia,serif;font-size:15px;color:#3D2B1A;font-weight:600;">Permanent Founding Member Badge</div>
                    <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:13px;color:#6B4C32;line-height:1.6;margin-top:2px;">A permanent badge on your profile — you were here from the beginning.</div>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#3D2B1A;border-radius:6px;margin-bottom:32px;">
            <tr>
              <td style="padding:28px 32px;">
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#C9A84C;margin-bottom:12px;">What Happens Next</div>
                <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:rgba(245,240,232,0.8);line-height:1.75;margin:0;">
                  We're finalizing our founding cohort now. When matchMor launches in your area this spring, you'll receive your onboarding survey — 48 questions that form the foundation of every introduction we make for you. No introduction happens until that's complete.
                </p>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr>
              <td align="center">
                <a href="https://matchmor.com" style="display:inline-block;background:#C9A84C;color:#2A1E10;padding:14px 36px;border-radius:3px;font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;">
                  Visit matchmor.com &#8594;
                </a>
              </td>
            </tr>
          </table>

          <p style="font-family:Georgia,serif;font-size:15px;color:#3D2B1A;line-height:1.75;margin:0 0 8px;">
            We're honored to be part of your journey.
          </p>
          <p style="font-family:Georgia,serif;font-size:15px;color:#3D2B1A;font-style:italic;margin:0;">
            — The matchMor Team
          </p>

        </td>
      </tr>

      <tr>
        <td style="background:#2A1E10;padding:24px 48px;border-radius:0 0 6px 6px;text-align:center;">
          <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:rgba(245,240,232,0.3);margin:0 0 6px;">
            &copy; 2026 matchMor &middot; Provo, Utah
          </p>
          <p style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:rgba(245,240,232,0.3);margin:0;">
            <a href="https://matchmor.com/api/privacy" style="color:rgba(245,240,232,0.3);text-decoration:underline;">Privacy Policy</a>
            &nbsp;&middot;&nbsp;
            <a href="https://matchmor.com/api/terms" style="color:rgba(245,240,232,0.3);text-decoration:underline;">Terms of Service</a>
          </p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, location, gender } = body

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'This email is already on the waitlist.' }, { status: 409 })
    }

    // Get current count for member number
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })

    const foundingNum = (count || 0) + 1
    const foundingRef = generateFoundingRef()

    // Insert into waitlist
    const { error: insertError } = await supabase
      .from('waitlist')
      .insert([{
        email,
        first_name: firstName,
        last_name: lastName,
        location,
        gender,
        founding_ref: foundingRef,
        founding_num: foundingNum,
        created_at: new Date().toISOString(),
      }])

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save to waitlist' }, { status: 500 })
    }

    // Send emails via Resend
    const resendKey = process.env.RESEND_API_KEY
    const ownerEmail = process.env.OWNER_NOTIFY_EMAIL || 'hello@matchmor.com'
    if (resendKey) {
      try {
        await Promise.all([
          // Confirmation to new member
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'matchMor <hello@matchmor.com>',
              to: [email],
              subject: `You're Founding Member #${foundingNum} — Welcome to matchMor`,
              html: confirmationEmail(firstName, foundingNum, foundingRef),
            }),
          }),
          // Owner notification
          fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'matchMor <hello@matchmor.com>',
              to: [ownerEmail],
              subject: `New Signup - Founding Member #${foundingNum}`,
              html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 0;">
  <tr><td align="center">
    <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
      <tr><td style="background:#3D2B1A;padding:24px 32px;border-radius:6px 6px 0 0;">
        <div style="font-family:Georgia,serif;font-size:22px;color:#F5F0E8;">
          match<span style="color:#C9A84C;font-weight:700;font-style:italic;">Mor</span>
          <span style="font-size:13px;color:rgba(245,240,232,0.4);margin-left:12px;">New Signup Alert</span>
        </div>
      </td></tr>
      <tr><td style="height:3px;background:#C9A84C;"></td></tr>
      <tr><td style="background:#ffffff;padding:32px;">
        <p style="font-family:Georgia,serif;font-size:22px;color:#3D2B1A;margin:0 0 24px;">Founding Member #${foundingNum} just joined!</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(61,43,26,0.1);border-radius:4px;overflow:hidden;">
          <tr style="background:#F5F0E8;"><td style="padding:10px 16px;font-size:11px;text-transform:uppercase;color:#6B4C32;font-weight:600;width:120px;">Name</td><td style="padding:10px 16px;font-size:14px;color:#3D2B1A;">${firstName} ${lastName}</td></tr>
          <tr style="border-top:1px solid rgba(61,43,26,0.08);"><td style="padding:10px 16px;font-size:11px;text-transform:uppercase;color:#6B4C32;font-weight:600;">Email</td><td style="padding:10px 16px;font-size:14px;color:#3D2B1A;">${email}</td></tr>
          <tr style="border-top:1px solid rgba(61,43,26,0.08);background:#F5F0E8;"><td style="padding:10px 16px;font-size:11px;text-transform:uppercase;color:#6B4C32;font-weight:600;">Location</td><td style="padding:10px 16px;font-size:14px;color:#3D2B1A;">${location || '-'}</td></tr>
          <tr style="border-top:1px solid rgba(61,43,26,0.08);"><td style="padding:10px 16px;font-size:11px;text-transform:uppercase;color:#6B4C32;font-weight:600;">Gender</td><td style="padding:10px 16px;font-size:14px;color:#3D2B1A;">${gender || '-'}</td></tr>
          <tr style="border-top:1px solid rgba(61,43,26,0.08);background:#F5F0E8;"><td style="padding:10px 16px;font-size:11px;text-transform:uppercase;color:#6B4C32;font-weight:600;">Ref Code</td><td style="padding:10px 16px;font-size:14px;color:#C9A84C;font-family:'Courier New',monospace;font-weight:700;">${foundingRef}</td></tr>
          <tr style="border-top:1px solid rgba(61,43,26,0.08);"><td style="padding:10px 16px;font-size:11px;text-transform:uppercase;color:#6B4C32;font-weight:600;">Spots Left</td><td style="padding:10px 16px;font-size:14px;color:#3D2B1A;font-weight:600;">${200 - foundingNum} of 200 remaining</td></tr>
        </table>
      </td></tr>
      <tr><td style="background:#2A1E10;padding:16px 32px;border-radius:0 0 6px 6px;text-align:center;">
        <p style="font-size:11px;color:rgba(245,240,232,0.3);margin:0;">matchMor &middot; matchmor.com</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
            }),
          }),
        ])
      } catch (emailErr) {
        console.error('Email send error:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      foundingNum,
      foundingRef,
    })

  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
