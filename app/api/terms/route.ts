import { NextResponse } from 'next/server'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Terms of Service — matchMor</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root { --gold: #C9A84C; --brown: #3D2B1A; --cream: #F5F0E8; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--cream); color: var(--brown); font-family: "DM Sans", sans-serif; font-weight: 300; }
nav { padding: 20px 60px; border-bottom: 1px solid rgba(61,43,26,0.1); display: flex; align-items: center; justify-content: space-between; }
.nav-logo { text-decoration: none; }
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap');
    .logo-wordmark { font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 26px; letter-spacing: -1px; line-height: 1; display: inline-flex; align-items: baseline; white-space: nowrap; text-decoration: none; }
    .logo-blue { color: #2BB0D9; } .logo-pink { color: #E94B7B; }
    .logo-t { display: inline-block; width: 0.38em; height: 0.72em; vertical-align: baseline; margin: 0 -0.02em; }
    .logo-t svg { display: block; width: 100%; height: 100%; }
    .logo-c { display: inline-block; width: 0.56em; height: 0.53em; vertical-align: baseline; margin: 0 -0.01em; }
    .logo-c svg { display: block; width: 100%; height: 100%; overflow: visible; }
    .logo-heart { display: inline-block; width: 0.68em; height: 0.62em; vertical-align: baseline; margin: 0 0.03em; transform: translateY(0.04em); }
    .logo-heart svg { display: block; width: 100%; height: 100%; overflow: visible; }
.back-link { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brown); text-decoration: none; opacity: 0.6; }
.back-link:hover { opacity: 1; color: var(--gold); }
.container { max-width: 760px; margin: 60px auto; padding: 0 40px 120px; }
.doc-title { font-family: "Cormorant Garamond", serif; font-size: 42px; font-weight: 300; margin-bottom: 8px; }
.doc-meta { font-size: 13px; opacity: 0.5; margin-bottom: 48px; padding-bottom: 24px; border-bottom: 1px solid rgba(61,43,26,0.1); }
h2 { font-family: "Cormorant Garamond", serif; font-size: 24px; font-weight: 600; color: var(--brown); margin: 40px 0 12px; }
h3 { font-size: 15px; font-weight: 500; color: var(--gold); margin: 28px 0 8px; letter-spacing: 0.03em; }
p { font-size: 15px; line-height: 1.8; margin-bottom: 16px; opacity: 0.85; }
ul { margin: 0 0 16px 20px; }
li { font-size: 15px; line-height: 1.8; opacity: 0.85; margin-bottom: 4px; }
.caps { font-size: 13px; line-height: 1.7; }
footer { text-align: center; padding: 40px; font-size: 12px; opacity: 0.4; border-top: 1px solid rgba(61,43,26,0.1); }
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo"><span class="logo-wordmark"><span class="logo-blue">ma</span><span class="logo-t"><svg viewBox="0 0 30 58" xmlns="http://www.w3.org/2000/svg"><rect x="8.5" y="0" width="13" height="58" fill="#2BB0D9"/><rect x="0" y="14" width="30" height="12" fill="#2BB0D9"/></svg></span><span class="logo-c"><svg viewBox="0 0 46 44" xmlns="http://www.w3.org/2000/svg"><path d="M 38 9 A 18 18 0 1 0 38 35" fill="none" stroke="#2BB0D9" stroke-width="12" stroke-linecap="square"/></svg></span><span class="logo-blue">h</span><span class="logo-pink">m</span><span class="logo-heart"><svg viewBox="-2 -2 68 64" xmlns="http://www.w3.org/2000/svg"><path d="M 32 12 C 26 6, 16 0, 6 6 C -2 12, 0 24, 4 30 L 32 58 L 60 30 C 64 24, 66 12, 58 6 C 48 0, 38 6, 32 12 Z" fill="none" stroke="#E94B7B" stroke-width="11" stroke-linejoin="miter" stroke-miterlimit="5"/></svg></span><span class="logo-pink">r</span></span></a>
  <a href="/" class="back-link">← Back to matchmor</a>
</nav>
<div class="container">
  <h1 class="doc-title">Terms of Service</h1>
  <div class="doc-meta">Effective Date: March 6, 2026 &nbsp;·&nbsp; Last Updated: March 6, 2026</div>

  <p>Please read these Terms of Service ("Terms") carefully before using matchMor. By accessing or using matchmor.com or any matchMor service, you agree to be bound by these Terms. If you do not agree, do not use our service.</p>

  <h2>1. About matchMor</h2>
  <p>matchMor is an AI-assisted matchmaking service designed for members of The Church of Jesus Christ of Latter-day Saints and the broader LDS community. matchMor facilitates introductions between compatible individuals based on shared values, faith, personality, and relationship goals. matchMor is a platform service and does not guarantee romantic outcomes, relationships, or marriage.</p>

  <h2>2. Eligibility</h2>
  <p>To use matchMor, you must:</p>
  <ul>
    <li>Be at least 18 years of age</li>
    <li>Be legally able to enter into a binding contract</li>
    <li>Be a member of or affiliate with the LDS faith community</li>
    <li>Provide accurate and truthful information in your profile and survey</li>
    <li>Not be legally prohibited from using dating or matchmaking services in your jurisdiction</li>
  </ul>

  <h2>3. Waitlist and Membership</h2>
  <h3>3.1 Founding Member Waitlist</h3>
  <p>Joining the matchMor waitlist is free and does not create a paid membership or contractual obligation. Waitlist members will be notified when matchMor launches in their area and given priority access to founding member pricing.</p>

  <h3>3.2 Paid Membership</h3>
  <p>When paid memberships become available, the current pricing is $18.30 per month. Memberships renew automatically unless cancelled. You may cancel at any time through your account settings. Cancellation takes effect at the end of the current billing period. We do not offer refunds for partial billing periods except where required by law.</p>

  <h3>3.3 Free Trial Period</h3>
  <p>Founding members may receive a complimentary membership period as described at the time of launch. The terms of any trial period will be communicated clearly before any charges begin.</p>

  <h2>4. User Conduct</h2>
  <p>By using matchMor you agree to:</p>
  <ul>
    <li>Provide honest, accurate information in your profile and survey responses</li>
    <li>Treat other members with respect, dignity, and Christlike kindness</li>
    <li>Not harass, threaten, or demean any other member</li>
    <li>Not use matchMor for any commercial purpose or to solicit other members</li>
    <li>Not impersonate another person or create a false identity</li>
    <li>Not attempt to circumvent or manipulate the matching process</li>
    <li>Report concerns about other members' conduct to matchMor promptly</li>
  </ul>
  <p>matchMor reserves the right to suspend or terminate any account that violates these standards without refund.</p>

  <h2>5. The Matching Process</h2>
  <p>matchMor uses AI-assisted technology combined with human review to generate compatibility assessments and facilitate introductions. You acknowledge and agree that:</p>
  <ul>
    <li>Matching is based on information you provide; inaccurate information will result in poor matches</li>
    <li>matchMor does not guarantee the accuracy, suitability, or safety of any introduction</li>
    <li>matchMor is a facilitator, not a guarantee of romantic compatibility or relationship success</li>
    <li>You are solely responsible for your safety when meeting any person introduced through matchMor</li>
    <li>matchMor strongly recommends meeting in public places and exercising personal judgment</li>
  </ul>

  <h2>6. Disclaimer of Warranties</h2>
  <p class="caps">MATCHMOR IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT ANY PARTICULAR RESULT WILL BE ACHIEVED. TO THE FULLEST EXTENT PERMITTED BY LAW, MATCHMOR DISCLAIMS ALL WARRANTIES INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>

  <h2>7. Limitation of Liability</h2>
  <p class="caps">TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, MATCHMOR AND ITS OWNERS, OFFICERS, AND EMPLOYEES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR PERSONAL INJURY, EMOTIONAL DISTRESS, LOSS OF REVENUE, OR LOSS OF DATA, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE OR ANY INTRODUCTION MADE THROUGH THE SERVICE.</p>
  <p>Our total liability to you for any claim arising out of or relating to these Terms or our service shall not exceed the amount you paid to matchMor in the three months preceding the claim.</p>

  <h2>8. Faith Community and Non-Discrimination</h2>
  <p>matchMor is designed as a faith-community service for members of the LDS community. Our service is specifically tailored to shared religious values and practices. matchMor does not discriminate on the basis of race, national origin, disability, or any other characteristic protected by applicable law beyond the faith-community focus of our service.</p>

  <h2>9. Privacy</h2>
  <p>Your use of matchMor is also governed by our <a href="/api/privacy" style="color:var(--gold)">Privacy Policy</a>, which is incorporated into these Terms by reference.</p>

  <h2>10. Termination</h2>
  <p>You may close your account at any time by contacting us at <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="0c7f797c7c637e784c616d786f6461637e226f6361">[email&#160;protected]</a>. matchMor may suspend or terminate your account at any time for violation of these Terms, harmful conduct toward other members, or for any reason with reasonable notice. Upon termination, your right to use the service ceases immediately.</p>

  <h2>11. Governing Law</h2>
  <p>These Terms are governed by the laws of the State of Utah, without regard to conflict of law principles. Any dispute arising from these Terms or your use of matchMor shall be resolved in the state or federal courts located in Utah County, Utah, and you consent to personal jurisdiction in those courts.</p>

  <h2>12. Changes to These Terms</h2>
  <p>We may update these Terms from time to time. We will notify you of material changes by email or by posting notice on matchmor.com. Your continued use of matchMor after changes are posted constitutes acceptance of the updated Terms.</p>

  <h2>13. Contact</h2>
  <p>Questions about these Terms? Contact us at:</p>
  <p><strong>matchMor</strong><br>
  Email: <a href="/cdn-cgi/l/email-protection#ef9c9a9f9f809d9baf828e9b8c8782809dc18c8082" style="color:var(--gold)"><span class="__cf_email__" data-cfemail="4e3d3b3e3e213c3a0e232f3a2d2623213c602d2123">[email&#160;protected]</span></a><br>
  Website: `

export async function GET() {
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
