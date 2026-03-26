import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, subject, message } = body

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 })
    }

    // Email to info@matchmor.com with the contact details
    const inboundHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <tr>
        <td style="background:#3D2B1A;padding:28px 36px;border-radius:6px 6px 0 0;">
          <div style="font-family:Georgia,serif;font-size:24px;color:#F5F0E8;">
            <span style="font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:30px;letter-spacing:-1px;"><span style="color:#2BB0D9;">match</span><span style="color:#E94B7B;">m&#9825;r</span></span>
          </div>
          <div style="font-size:11px;color:rgba(245,240,232,0.4);letter-spacing:0.15em;text-transform:uppercase;margin-top:6px;">New Contact Form Submission</div>
        </td>
      </tr>
      <tr><td style="height:3px;background:#C9A84C;"></td></tr>
      <tr>
        <td style="background:#ffffff;padding:36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid rgba(61,43,26,0.1);border-radius:4px;overflow:hidden;">
            <tr style="background:#F5F0E8;">
              <td style="padding:12px 18px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B4C32;font-weight:600;border-bottom:1px solid rgba(61,43,26,0.08);">From</td>
              <td style="padding:12px 18px;font-size:14px;color:#3D2B1A;border-bottom:1px solid rgba(61,43,26,0.08);">${firstName} ${lastName} &lt;${email}&gt;</td>
            </tr>
            <tr>
              <td style="padding:12px 18px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6B4C32;font-weight:600;">Subject</td>
              <td style="padding:12px 18px;font-size:14px;color:#3D2B1A;">${subject}</td>
            </tr>
          </table>
          <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C9A84C;margin-bottom:10px;font-weight:600;">Message</div>
          <div style="font-size:14px;color:#3D2B1A;line-height:1.75;background:#F5F0E8;padding:20px;border-radius:4px;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <div style="margin-top:24px;padding-top:20px;border-top:1px solid rgba(61,43,26,0.08);">
            <a href="mailto:${email}" style="display:inline-block;background:#C9A84C;color:#2A1E10;padding:11px 28px;border-radius:3px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;">Reply to ${firstName} →</a>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background:#2A1E10;padding:18px 36px;border-radius:0 0 6px 6px;text-align:center;">
          <p style="font-size:11px;color:rgba(245,240,232,0.3);margin:0;">matchMor · matchmor.com</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

    // Auto-reply to the sender
    const autoReplyHtml = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <tr>
        <td style="background:#3D2B1A;padding:32px 36px;border-radius:6px 6px 0 0;text-align:center;">
          <div style="font-family:Georgia,serif;font-size:28px;color:#F5F0E8;">
            <span style="font-family:'Poppins',Arial,sans-serif;font-weight:700;font-size:30px;letter-spacing:-1px;"><span style="color:#2BB0D9;">match</span><span style="color:#E94B7B;">m&#9825;r</span></span>
          </div>
        </td>
      </tr>
      <tr><td style="height:3px;background:#C9A84C;"></td></tr>
      <tr>
        <td style="background:#ffffff;padding:40px 36px;">
          <p style="font-family:Georgia,serif;font-size:22px;color:#3D2B1A;margin:0 0 12px;">Thanks for reaching out, ${firstName}.</p>
          <p style="font-size:14px;color:#6B4C32;line-height:1.75;margin:0 0 24px;">We received your message and will get back to you within one business day. We read every note personally.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border:1px solid rgba(201,168,76,0.2);border-radius:4px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#C9A84C;margin-bottom:8px;">Your message</div>
              <div style="font-size:13px;color:#6B4C32;line-height:1.7;font-style:italic;">"${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 200)}${message.length > 200 ? '...' : ''}"</div>
            </td></tr>
          </table>
          <p style="font-family:Georgia,serif;font-size:14px;color:#3D2B1A;margin:0 0 6px;">We're honored to be part of your journey.</p>
          <p style="font-family:Georgia,serif;font-size:14px;color:#3D2B1A;font-style:italic;margin:0;">— The matchMor Team</p>
        </td>
      </tr>
      <tr>
        <td style="background:#2A1E10;padding:18px 36px;border-radius:0 0 6px 6px;text-align:center;">
          <p style="font-size:11px;color:rgba(245,240,232,0.3);margin:0 0 4px;">© 2026 matchMor · Provo, Utah</p>
          <p style="font-size:11px;color:rgba(245,240,232,0.3);margin:0;">
            <a href="https://matchmor.com/api/privacy" style="color:rgba(245,240,232,0.3);text-decoration:underline;">Privacy Policy</a>
            &nbsp;·&nbsp;
            <a href="https://matchmor.com/api/terms" style="color:rgba(245,240,232,0.3);text-decoration:underline;">Terms</a>
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`

    // Send both emails in parallel
    await Promise.all([
      // Inbound to info@matchmor.com
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'matchMor Contact <hello@matchmor.com>',
          to: ['info@matchmor.com'],
          reply_to: email,
          subject: `[matchMor Contact] ${subject} — ${firstName} ${lastName}`,
          html: inboundHtml,
        }),
      }),
      // Auto-reply to sender
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'matchMor <hello@matchmor.com>',
          to: [email],
          subject: `We got your message, ${firstName} — matchMor`,
          html: autoReplyHtml,
        }),
      }),
    ])

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
