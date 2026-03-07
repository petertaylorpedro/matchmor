import { NextResponse } from 'next/server'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Contact — matchMor</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root { --gold: #C9A84C; --gold2: #E8C96A; --brown: #3D2B1A; --brown2: #2A1E10; --brown3: #6B4C32; --cream: #F5F0E8; --cream2: #FAF6EE; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--cream); color: var(--brown); font-family: "DM Sans", sans-serif; font-weight: 300; min-height: 100vh; display: flex; flex-direction: column; }
nav { padding: 20px 60px; border-bottom: 1px solid rgba(61,43,26,0.08); display: flex; align-items: center; justify-content: space-between; background: var(--cream); }
.nav-logo { font-family: "Cormorant Garamond", serif; font-size: 26px; text-decoration: none; color: var(--brown); }
.nav-logo .Mor { font-weight: 700; font-style: italic; color: var(--gold); }
.back-link { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--brown3); text-decoration: none; transition: color 0.2s; }
.back-link:hover { color: var(--gold); }
.main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 24px; }
.card { background: white; border-radius: 8px; padding: 56px; max-width: 560px; width: 100%; border: 1px solid rgba(61,43,26,0.08); box-shadow: 0 8px 48px rgba(61,43,26,0.07); }
.card-eyebrow { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
.card-title { font-family: "Cormorant Garamond", serif; font-size: 38px; font-weight: 300; color: var(--brown2); margin-bottom: 10px; line-height: 1.15; }
.card-title em { font-style: italic; color: var(--gold); }
.card-sub { font-size: 14px; color: var(--brown3); line-height: 1.75; margin-bottom: 36px; padding-bottom: 32px; border-bottom: 1px solid rgba(61,43,26,0.08); }
.form-group { margin-bottom: 18px; }
.form-row { display: flex; gap: 14px; margin-bottom: 18px; }
.form-row .form-group { flex: 1; margin-bottom: 0; }
label { display: block; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--brown3); margin-bottom: 7px; font-weight: 500; }
input, select, textarea {
  width: 100%; padding: 13px 16px;
  border: 1.5px solid rgba(61,43,26,0.13); border-radius: 3px;
  font-family: "DM Sans", sans-serif; font-size: 14px; font-weight: 300;
  color: var(--brown); background: var(--cream2); outline: none;
  transition: border-color 0.2s, background 0.2s;
}
input:focus, select:focus, textarea:focus { border-color: var(--gold); background: white; }
input::placeholder, textarea::placeholder { color: rgba(61,43,26,0.3); }
select { appearance: none; cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B4C32' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 14px center; }
textarea { resize: vertical; min-height: 130px; line-height: 1.65; }
.submit-btn {
  width: 100%; padding: 15px;
  background: var(--brown2); color: var(--cream);
  border: none; border-radius: 3px; cursor: pointer;
  font-family: "DM Sans", sans-serif; font-size: 12px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.2s; margin-top: 8px;
}
.submit-btn:hover:not(:disabled) { background: var(--gold); color: var(--brown2); }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.success { display: none; text-align: center; padding: 20px 0; }
.success.visible { display: block; }
.success-icon { font-size: 40px; margin-bottom: 16px; }
.success-heading { font-family: "Cormorant Garamond", serif; font-size: 30px; font-weight: 400; color: var(--brown); margin-bottom: 10px; }
.success-body { font-size: 14px; color: var(--brown3); line-height: 1.75; }
.error-msg { font-size: 12px; color: #c0392b; margin-top: 10px; display: none; }
.error-msg.visible { display: block; }
footer { text-align: center; padding: 28px; font-size: 11px; color: rgba(61,43,26,0.3); border-top: 1px solid rgba(61,43,26,0.06); }
footer a { color: inherit; text-decoration: none; }
footer a:hover { color: var(--gold); }
@media (max-width: 600px) {
  nav { padding: 16px 20px; }
  .card { padding: 36px 24px; }
  .form-row { flex-direction: column; gap: 18px; }
}
</style>
</head>
<body>

<nav>
  <a href="/" class="nav-logo"><span>match</span><span class="Mor">Mor</span></a>
  <a href="/" class="back-link">← Back to matchMor</a>
</nav>

<div class="main">
  <div class="card">

    <div id="formWrap">
      <div class="card-eyebrow">Get in Touch</div>
      <h1 class="card-title">We'd love to<br><em>hear from you.</em></h1>
      <p class="card-sub">Questions about matchMor, founding membership, or how it all works? Send us a note and we'll get back to you personally — usually within one business day.</p>

      <form id="contactForm">
        <div class="form-row">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="Rachel" required>
          </div>
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" placeholder="Hansen" required>
          </div>
        </div>
        <div class="form-group">
          <label for="email">Email Address</label>
          <input type="email" id="email" placeholder="you@email.com" required>
        </div>
        <div class="form-group">
          <label for="subject">Subject</label>
          <select id="subject" required>
            <option value="" disabled selected>What's this about?</option>
            <option>Question about founding membership</option>
            <option>How matchMor works</option>
            <option>Pricing and billing</option>
            <option>Privacy or data question</option>
            <option>Partnership or press inquiry</option>
            <option>Something else</option>
          </select>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" placeholder="Tell us what's on your mind..." required></textarea>
        </div>
        <button type="submit" class="submit-btn" id="submitBtn">Send Message →</button>
        <div class="error-msg" id="errorMsg">Something went wrong. Please try again or email us directly at info@matchmor.com.</div>
      </form>
    </div>

    <div class="success" id="successState">
      <div class="success-icon">✦</div>
      <div class="success-heading">Message received.</div>
      <div class="success-body">Thank you for reaching out. We'll get back to you at your email address within one business day.</div>
    </div>

  </div>
</div>

<footer>
  © 2026 matchMor · <a href="/api/privacy">Privacy Policy</a> · <a href="/api/terms">Terms of Service</a>
</footer>

<script>
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const errMsg = document.getElementById('errorMsg');
  errMsg.classList.remove('visible');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const payload = {
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value.trim(),
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('formWrap').style.display = 'none';
      document.getElementById('successState').classList.add('visible');
    } else {
      throw new Error(data.error || 'Unknown error');
    }
  } catch (err) {
    btn.textContent = 'Send Message →';
    btn.disabled = false;
    errMsg.classList.add('visible');
  }
});
</script>
</body>
</html>`

export async function GET() {
  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
