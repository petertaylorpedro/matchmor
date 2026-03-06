export const dynamic = 'force-dynamic'

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>matchMor — Founding Members · Be Among the First 200</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap" rel="stylesheet">
<style>
:root {
  --gold: #C9A84C;
  --gold2: #E8C96A;
  --gold3: #F5D980;
  --brown: #3D2B1A;
  --brown2: #2A1E10;
  --brown3: #6B4C32;
  --cream: #F5F0E8;
  --cream2: #FAF6EE;
  --cream3: #EDE4D4;
  --sage: #7A8C6E;
  --terra: #C4714A;
}

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

html { scroll-behavior: smooth; font-size: 16px; }

body {
  background: var(--cream);
  color: var(--brown);
  font-family: 'DM Sans', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  cursor: default;
}

/* ── GRAIN OVERLAY ── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
  opacity: 0.4;
}

/* ── NAV ── */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 60px;
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(to bottom, rgba(245,240,232,0.95), rgba(245,240,232,0));
  backdrop-filter: blur(2px);
  transition: all 0.4s;
}
nav.scrolled {
  background: rgba(245,240,232,0.97);
  border-bottom: 1px solid rgba(61,43,26,0.08);
  padding: 14px 60px;
  backdrop-filter: blur(12px);
}
.nav-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px; font-weight: 400; color: var(--brown);
  text-decoration: none; letter-spacing: 0.01em;
}
.nav-logo .Mor { font-weight: 700; font-style: italic; color: var(--gold); }
.nav-links { display: flex; align-items: center; gap: 32px; }
.nav-link {
  font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--brown3); text-decoration: none;
  transition: color 0.2s;
}
.nav-link:hover { color: var(--gold); }
.nav-cta {
  background: var(--brown); color: var(--cream);
  padding: 9px 22px; border-radius: 3px;
  font-size: 12px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
  text-decoration: none; transition: all 0.2s; border: none; cursor: pointer;
}
.nav-cta:hover { background: var(--gold); color: var(--brown2); }

/* ── HERO ── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 120px 60px 80px;
  position: relative; overflow: hidden;
  text-align: center;
}

/* Radial glow behind text */
.hero::after {
  content: '';
  position: absolute; top: 30%; left: 50%; transform: translate(-50%,-50%);
  width: 800px; height: 500px;
  background: radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%);
  pointer-events: none;
}

/* Decorative star mark */
.hero-star {
  width: 64px; height: 64px; margin-bottom: 32px;
  opacity: 0;
  animation: fadeUp 1s 0.2s ease forwards;
}

.hero-eyebrow {
  font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 20px;
  opacity: 0; animation: fadeUp 1s 0.4s ease forwards;
}

.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(48px, 7vw, 88px);
  font-weight: 300; line-height: 1.05;
  color: var(--brown2); letter-spacing: -0.01em;
  max-width: 900px;
  opacity: 0; animation: fadeUp 1s 0.55s ease forwards;
}
.hero-title em {
  font-style: italic; color: var(--gold);
}
.hero-title strong {
  font-weight: 600;
}

.hero-sub {
  font-size: clamp(15px, 1.5vw, 18px);
  color: var(--brown3); line-height: 1.75;
  max-width: 580px; margin-top: 24px;
  opacity: 0; animation: fadeUp 1s 0.7s ease forwards;
}

.hero-badges {
  display: flex; align-items: center; gap: 12px;
  margin-top: 32px; flex-wrap: wrap; justify-content: center;
  opacity: 0; animation: fadeUp 1s 0.85s ease forwards;
}
.badge {
  display: flex; align-items: center; gap: 7px;
  background: rgba(61,43,26,0.06); border: 1px solid rgba(61,43,26,0.1);
  border-radius: 20px; padding: 6px 16px;
  font-size: 12px; color: var(--brown3);
}
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink:0; }

/* COUNTER */
.counter-wrap {
  margin-top: 48px;
  opacity: 0; animation: fadeUp 1s 1s ease forwards;
}
.counter-track {
  width: 320px; height: 6px;
  background: rgba(61,43,26,0.1);
  border-radius: 3px; overflow: hidden;
  margin: 0 auto 10px;
}
.counter-fill {
  height: 100%; border-radius: 3px;
  background: linear-gradient(to right, var(--gold), var(--gold2));
  width: 0%;
  transition: width 2s 1.2s cubic-bezier(0.4,0,0.2,1);
}
.counter-label {
  font-size: 12px; color: var(--brown3); letter-spacing: 0.05em;
}
.counter-label strong { color: var(--gold); font-weight: 600; }

/* HERO FORM */
.hero-form-wrap {
  margin-top: 40px; width: 100%; max-width: 520px;
  opacity: 0; animation: fadeUp 1s 0.9s ease forwards;
}
.hero-form {
  display: flex; gap: 0;
  background: white;
  border: 1.5px solid rgba(61,43,26,0.15);
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(61,43,26,0.1);
  transition: box-shadow 0.3s, border-color 0.3s;
}
.hero-form:focus-within {
  border-color: var(--gold);
  box-shadow: 0 8px 40px rgba(201,168,76,0.2);
}
.hero-form input {
  flex: 1; padding: 16px 20px;
  border: none; outline: none;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 300;
  color: var(--brown); background: transparent;
}
.hero-form input::placeholder { color: rgba(61,43,26,0.35); }
.hero-form button {
  padding: 16px 28px;
  background: var(--gold); color: var(--brown2);
  border: none; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  transition: background 0.2s; white-space: nowrap;
  flex-shrink: 0;
}
.hero-form button:hover { background: var(--gold2); }

.form-note {
  font-size: 11px; color: rgba(61,43,26,0.4);
  margin-top: 10px; letter-spacing: 0.02em;
}

/* ── DIVIDER ── */
.color-bar {
  height: 3px;
  background: linear-gradient(to right, var(--brown2), var(--brown), var(--gold), var(--gold2), var(--sage), var(--cream3));
}

/* ── SECTIONS ── */
section {
  padding: 96px 60px;
  max-width: 1200px; margin: 0 auto;
}

.section-eyebrow {
  font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 16px;
}
.section-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 4vw, 54px);
  font-weight: 300; line-height: 1.15;
  color: var(--brown2); margin-bottom: 20px;
}
.section-heading em { font-style: italic; color: var(--gold); }
.section-body {
  font-size: 16px; color: var(--brown3); line-height: 1.8;
  max-width: 580px;
}

/* ── THE DIFFERENCE ── */
.difference-section {
  background: var(--brown2);
  padding: 96px 0; max-width: 100%;
}
.difference-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 60px;
}
.difference-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
  margin-top: 56px; border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; overflow: hidden;
}
.diff-col-header {
  padding: 20px 32px;
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  font-weight: 500;
}
.diff-col-header.left {
  background: rgba(255,255,255,0.04); color: rgba(245,240,232,0.4);
  border-right: 1px solid rgba(255,255,255,0.06);
}
.diff-col-header.right {
  background: rgba(201,168,76,0.12); color: var(--gold2);
}
.diff-row {
  display: grid; grid-template-columns: 1fr 1fr;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.diff-cell {
  padding: 20px 32px;
  font-size: 14px; line-height: 1.6;
  display: flex; align-items: flex-start; gap: 12px;
}
.diff-cell.left {
  color: rgba(245,240,232,0.4);
  border-right: 1px solid rgba(255,255,255,0.05);
  background: rgba(255,255,255,0.02);
}
.diff-cell.right {
  color: var(--cream);
  background: rgba(201,168,76,0.05);
}
.diff-cell .icon { font-size: 14px; margin-top: 2px; flex-shrink: 0; }

.difference-section .section-heading { color: var(--cream); }
.difference-section .section-eyebrow { color: var(--gold); }
.difference-section .section-body { color: rgba(245,240,232,0.55); }

/* ── EXPERIENCE FLOW ── */
.flow-section { background: var(--cream2); padding: 96px 0; max-width: 100%; }
.flow-inner { max-width: 1200px; margin: 0 auto; padding: 0 60px; }

.flow-steps {
  margin-top: 60px;
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 0;
  position: relative;
}
.flow-steps::before {
  content: '';
  position: absolute; top: 36px; left: 10%; right: 10%;
  height: 1px; background: linear-gradient(to right, transparent, var(--gold), transparent);
  pointer-events: none;
}
.flow-step {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 0 16px;
  position: relative;
}
.flow-num {
  width: 72px; height: 72px; border-radius: 50%;
  background: white; border: 1.5px solid var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 300; color: var(--gold);
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(201,168,76,0.15);
  position: relative; z-index: 2; background: var(--cream2);
  transition: all 0.3s;
}
.flow-step:hover .flow-num {
  background: var(--gold); color: var(--brown2);
  box-shadow: 0 8px 32px rgba(201,168,76,0.3);
}
.flow-step-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 19px; font-weight: 600; color: var(--brown);
  margin-bottom: 10px;
}
.flow-step-body {
  font-size: 12px; color: var(--brown3); line-height: 1.7;
}
.flow-step-tag {
  display: inline-block; margin-top: 12px;
  background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2);
  border-radius: 20px; padding: 3px 12px;
  font-size: 10px; color: var(--gold); letter-spacing: 0.08em;
}

/* ── FOUNDING BENEFITS ── */
.benefits-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-top: 56px;
}
.benefit-card {
  background: white; border-radius: 6px; padding: 32px;
  border: 1px solid rgba(61,43,26,0.08);
  transition: all 0.25s;
  position: relative; overflow: hidden;
}
.benefit-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(to right, var(--gold), var(--gold2));
}
.benefit-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(61,43,26,0.1);
  border-color: rgba(201,168,76,0.2);
}
.benefit-icon {
  font-size: 28px; margin-bottom: 16px;
}
.benefit-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 600; color: var(--brown);
  margin-bottom: 10px;
}
.benefit-body {
  font-size: 13px; color: var(--brown3); line-height: 1.75;
}
.benefit-value {
  display: inline-block; margin-top: 16px;
  background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2);
  border-radius: 3px; padding: 4px 12px;
  font-size: 11px; font-weight: 600; color: var(--gold);
  letter-spacing: 0.08em;
}

/* ── HONEST SECTION ── */
.honest-section {
  background: linear-gradient(135deg, #2A1E10 0%, #3D2B1A 100%);
  padding: 96px 0; max-width: 100%;
  position: relative; overflow: hidden;
}
.honest-section::before {
  content: '';
  position: absolute; top: -50%; right: -10%;
  width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%);
  pointer-events: none;
}
.honest-inner { max-width: 800px; margin: 0 auto; padding: 0 60px; text-align: center; }
.honest-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 300; font-style: italic;
  color: var(--cream); line-height: 1.45;
  margin-bottom: 32px;
}
.honest-quote em { color: var(--gold2); font-style: normal; font-weight: 600; }
.honest-attr {
  font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(245,240,232,0.35);
}

/* ── PROMISE CARDS ── */
.promise-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  margin-top: 56px;
}
.promise-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; padding: 28px 32px;
  display: flex; gap: 20px; align-items: flex-start;
}
.promise-check {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0; margin-top: 2px;
}
.promise-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 600; color: var(--cream);
  margin-bottom: 6px;
}
.promise-body { font-size: 13px; color: rgba(245,240,232,0.5); line-height: 1.7; }

/* ── TESTIMONIALS ── */
.testimonials-section {
  padding: 96px 0; max-width: 100%;
  background: var(--cream3);
}
.testimonials-inner { max-width: 1200px; margin: 0 auto; padding: 0 60px; }
.testimonials-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-top: 48px;
}
.testimonial {
  background: white; border-radius: 6px; padding: 32px;
  border: 1px solid rgba(61,43,26,0.06);
}
.testimonial-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 19px; font-style: italic; color: var(--brown);
  line-height: 1.6; margin-bottom: 20px;
}
.testimonial-quote::before { content: '\\201C'; color: var(--gold); font-size: 28px; line-height: 0; vertical-align: -6px; margin-right: 2px; }
.testimonial-person {
  display: flex; align-items: center; gap: 12px;
}
.testimonial-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; font-weight: 600; color: white;
  flex-shrink: 0;
}
.testimonial-name { font-size: 13px; font-weight: 500; color: var(--brown); }
.testimonial-detail { font-size: 11px; color: var(--brown3); margin-top: 2px; }
.testimonial-stars { color: var(--gold); font-size: 12px; margin-bottom: 4px; }

/* ── WAITLIST CTA ── */
.cta-section {
  padding: 96px 0; max-width: 100%; background: var(--cream);
  text-align: center;
}
.cta-inner { max-width: 660px; margin: 0 auto; padding: 0 60px; }
.cta-star {
  width: 56px; height: 56px; margin: 0 auto 28px;
}
.cta-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 4vw, 52px);
  font-weight: 300; line-height: 1.15;
  color: var(--brown2); margin-bottom: 16px;
}
.cta-heading em { font-style: italic; color: var(--gold); }
.cta-sub {
  font-size: 15px; color: var(--brown3); line-height: 1.75; margin-bottom: 40px;
}
.cta-form {
  display: flex; flex-direction: column; gap: 12px;
  max-width: 480px; margin: 0 auto;
}
.cta-input-row { display: flex; gap: 12px; }
.cta-input {
  flex: 1; padding: 14px 18px;
  border: 1.5px solid rgba(61,43,26,0.15); border-radius: 3px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300;
  color: var(--brown); background: white; outline: none;
  transition: border-color 0.2s;
}
.cta-input:focus { border-color: var(--gold); }
.cta-input::placeholder { color: rgba(61,43,26,0.35); }
.cta-select {
  padding: 14px 18px;
  border: 1.5px solid rgba(61,43,26,0.15); border-radius: 3px;
  font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 300;
  color: var(--brown); background: white; outline: none;
  transition: border-color 0.2s; cursor: pointer; width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%236B4C32' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 16px center;
}
.cta-select:focus { border-color: var(--gold); }
.cta-btn {
  padding: 16px 32px;
  background: var(--brown2); color: var(--cream);
  border: none; border-radius: 3px; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  transition: all 0.25s;
}
.cta-btn:hover { background: var(--gold); color: var(--brown2); }
.cta-privacy {
  font-size: 11px; color: rgba(61,43,26,0.35); margin-top: 8px; line-height: 1.6;
}
.spots-left {
  display: inline-flex; align-items: center; gap: 8px;
  margin-bottom: 28px;
  background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.25);
  border-radius: 20px; padding: 8px 20px;
  font-size: 12px; color: var(--brown3);
}
.spots-left strong { color: var(--gold); font-weight: 600; }
.pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--gold);
  animation: pulseDot 1.8s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulseDot {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* ── SUCCESS STATE ── */
.success-state {
  display: none; text-align: center; padding: 40px 20px;
}
.success-state.visible { display: block; }
.success-icon {
  width: 64px; height: 64px; border-radius: 50%;
  background: rgba(201,168,76,0.15); border: 1.5px solid var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 28px; margin: 0 auto 20px;
}
.success-heading {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-weight: 400; color: var(--brown); margin-bottom: 12px;
}
.success-body { font-size: 14px; color: var(--brown3); line-height: 1.75; max-width: 400px; margin: 0 auto; }
.success-ref { font-family: 'DM Sans', sans-serif; font-size: 12px; color: var(--gold); font-weight: 600; margin-top: 12px; }

/* ── FOOTER ── */
footer {
  background: var(--brown2);
  padding: 48px 60px;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 20px;
}
.footer-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; color: var(--cream); font-weight: 400;
}
.footer-logo .Mor { font-weight: 700; font-style: italic; color: var(--gold2); }
.footer-links {
  display: flex; gap: 24px; flex-wrap: wrap;
}
.footer-link {
  font-size: 11px; color: rgba(245,240,232,0.4);
  text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;
  transition: color 0.2s;
}
.footer-link:hover { color: var(--gold2); }
.footer-copy {
  font-size: 11px; color: rgba(245,240,232,0.25);
  letter-spacing: 0.05em;
}

/* ── ANIMATIONS ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  nav { padding: 16px 24px; }
  nav.scrolled { padding: 12px 24px; }
  .nav-links { display: none; }
  .hero { padding: 100px 24px 60px; }
  section, .difference-inner, .flow-inner, .honest-inner,
  .testimonials-inner, .cta-inner { padding: 60px 24px; }
  .difference-grid { grid-template-columns: 1fr; }
  .diff-row { grid-template-columns: 1fr; }
  .diff-cell.left { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .flow-steps { grid-template-columns: 1fr; gap: 24px; }
  .flow-steps::before { display: none; }
  .benefits-grid { grid-template-columns: 1fr; }
  .promise-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .cta-input-row { flex-direction: column; }
  footer { padding: 32px 24px; flex-direction: column; align-items: flex-start; }
}
</style>
</head>
<body>

<!-- NAV -->
<nav id="nav">
  <a href="#" class="nav-logo"><span>match</span><span class="Mor">Mor</span></a>
  <div class="nav-links">
    <a href="#how-it-works" class="nav-link">How It Works</a>
    <a href="#founding" class="nav-link">Founding Benefits</a>
    <a href="#our-promise" class="nav-link">Our Promise</a>
    <a href="#join" class="nav-cta">Claim Your Spot</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero">

  <!-- Temple Star SVG -->
  <svg class="hero-star" viewBox="0 0 60 60" fill="none">
    <g transform="translate(30,30)">
      <polygon points="0,-26 6,-6 26,0 6,6 0,26 -6,6 -26,0 -6,-6" fill="#C9A84C" opacity="0.15"/>
      <polygon points="0,-26 6,-6 26,0 6,6 0,26 -6,6 -26,0 -6,-6" fill="none" stroke="#C9A84C" stroke-width="1.2"/>
      <polygon points="0,-17 4,-4 17,0 4,4 0,17 -4,4 -17,0 -4,-4" fill="#C9A84C" opacity="0.2"/>
      <circle cx="0" cy="0" r="3" fill="#C9A84C"/>
      <circle cx="0" cy="-28" r="1.5" fill="#C9A84C" opacity="0.5"/>
      <circle cx="28" cy="0" r="1.5" fill="#C9A84C" opacity="0.5"/>
      <circle cx="0" cy="28" r="1.5" fill="#C9A84C" opacity="0.5"/>
      <circle cx="-28" cy="0" r="1.5" fill="#C9A84C" opacity="0.5"/>
    </g>
  </svg>

  <div class="hero-eyebrow">Founding Member Invitation · Utah Valley · Spring 2026</div>

  <h1 class="hero-title">
    Be Among the<br>
    <em>First 200</em> Latter-day Saints<br>
    to Experience <strong>matchMor</strong>
  </h1>

  <p class="hero-sub">
    Not a dating app. Not a swipe pool. A guided, AI-powered journey toward your eternal companion — one intentional introduction at a time.
  </p>

  <div class="hero-badges">
    <div class="badge"><div class="badge-dot"></div> 6 Months Free for Founding Members</div>
    <div class="badge"><div class="badge-dot"></div> Utah Valley Launch · Spring 2026</div>
    <div class="badge"><div class="badge-dot"></div> Curated · Not Swiped</div>
  </div>

  <div class="counter-wrap">
    <div class="counter-track"><div class="counter-fill" id="counterFill"></div></div>
    <div class="counter-label"><strong id="spotsLeft">143</strong> of 200 founding spots claimed</div>
  </div>

  <div class="hero-form-wrap">
    <form class="hero-form" id="heroForm" onsubmit="handleHeroSubmit(event)">
      <input type="email" placeholder="your@email.com" required id="heroEmail">
      <button type="submit">Claim My Spot →</button>
    </form>
    <div class="form-note">No credit card · No commitment · Founding members notified first when introductions begin</div>
  </div>

</section>

<div class="color-bar"></div>

<!-- THE DIFFERENCE -->
<div class="difference-section">
  <div class="difference-inner">
    <div class="section-eyebrow reveal">Why matchMor is Different</div>
    <h2 class="section-heading reveal reveal-delay-1">This isn't a dating app.<br><em>It's a guided journey.</em></h2>
    <p class="section-body reveal reveal-delay-2">Dating apps sell you a pool and leave you to swim in it alone. matchMor walks with you — one prepared introduction at a time, with context, structure, and coaching at every step.</p>

    <div class="difference-grid reveal reveal-delay-2">
      <div class="diff-col-header left">Dating Apps</div>
      <div class="diff-col-header right">matchMor</div>

      <div class="diff-row">
        <div class="diff-cell left"><span class="icon">✗</span> Hundreds of profiles to browse alone</div>
        <div class="diff-cell right"><span class="icon" style="color:var(--gold)">✦</span> One curated introduction, fully prepared</div>
      </div>
      <div class="diff-row">
        <div class="diff-cell left"><span class="icon">✗</span> Swipe and hope for the best</div>
        <div class="diff-cell right"><span class="icon" style="color:var(--gold)">✦</span> AI compatibility brief delivered before you message</div>
      </div>
      <div class="diff-row">
        <div class="diff-cell left"><span class="icon">✗</span> Zero structure — figure out the date yourself</div>
        <div class="diff-cell right"><span class="icon" style="color:var(--gold)">✦</span> Date ideas curated to your shared values and location</div>
      </div>
      <div class="diff-row">
        <div class="diff-cell left"><span class="icon">✗</span> No support after the match</div>
        <div class="diff-cell right"><span class="icon" style="color:var(--gold)">✦</span> Post-date reflection + personalized coaching</div>
      </div>
      <div class="diff-row">
        <div class="diff-cell left"><span class="icon">✗</span> Faith is a checkbox, not a foundation</div>
        <div class="diff-cell right"><span class="icon" style="color:var(--gold)">✦</span> Temple goals, mission service, testimony — the whole person</div>
      </div>
      <div class="diff-row">
        <div class="diff-cell left"><span class="icon">✗</span> You're a product. Your data is sold.</div>
        <div class="diff-cell right"><span class="icon" style="color:var(--gold)">✦</span> Your faith journey is sacred. Full stop.</div>
      </div>
    </div>
  </div>
</div>

<!-- HOW IT WORKS -->
<div class="flow-section" id="how-it-works">
  <div class="flow-inner">
    <div class="section-eyebrow reveal">The matchMor Experience</div>
    <h2 class="section-heading reveal reveal-delay-1" style="color:var(--brown2)">Five steps, <em>one introduction at a time.</em></h2>
    <p class="section-body reveal reveal-delay-2" style="color:var(--brown3)">Every week, a single curated introduction. Not a list — one door, opened with intention and supported at every step.</p>

    <div class="flow-steps">
      <div class="flow-step reveal reveal-delay-1">
        <div class="flow-num">1</div>
        <div class="flow-step-title">The Brief</div>
        <div class="flow-step-body">Before you exchange a single word, your AI compatibility brief arrives — shared values, conversation starters, one thing to be aware of.</div>
        <span class="flow-step-tag">Preparation</span>
      </div>
      <div class="flow-step reveal reveal-delay-2">
        <div class="flow-num">2</div>
        <div class="flow-step-title">The Conversation</div>
        <div class="flow-step-body">A seven-day guided messaging window. Enough time to connect. Enough structure to stay intentional. The AI gently prompts depth over small talk.</div>
        <span class="flow-step-tag">Connection</span>
      </div>
      <div class="flow-step reveal reveal-delay-3">
        <div class="flow-num">3</div>
        <div class="flow-step-title">The Date</div>
        <div class="flow-step-body">When you're ready, matchMor suggests 3–5 date ideas aligned to your shared interests, location, and LDS values — temple grounds, service projects, Sunday dessert.</div>
        <span class="flow-step-tag">Experience</span>
      </div>
      <div class="flow-step reveal reveal-delay-4">
        <div class="flow-num">4</div>
        <div class="flow-step-title">The Reflection</div>
        <div class="flow-step-body">24 hours after your date, a brief structured reflection arrives — not just "did you like them?" but "did you feel spiritually at ease? What surprised you?"</div>
        <span class="flow-step-tag">Insight</span>
      </div>
      <div class="flow-step reveal reveal-delay-5">
        <div class="flow-num">5</div>
        <div class="flow-step-title">The Coaching</div>
        <div class="flow-step-body">Your feedback feeds personalized guidance — patterns noticed, growth offered, the next introduction refined. You're never navigating this alone.</div>
        <span class="flow-step-tag">Growth</span>
      </div>
    </div>
  </div>
</div>

<!-- FOUNDING BENEFITS -->
<section id="founding">
  <div class="section-eyebrow reveal">Founding Member Benefits</div>
  <h2 class="section-heading reveal reveal-delay-1">What you get as one<br>of the <em>first 200.</em></h2>
  <p class="section-body reveal reveal-delay-2">Founding members are not beta testers. You are the founding community of something that doesn't exist yet — and you'll be treated accordingly.</p>

  <div class="benefits-grid">
    <div class="benefit-card reveal reveal-delay-1">
      <div class="benefit-icon">🏛️</div>
      <div class="benefit-title">Six Months Free</div>
      <div class="benefit-body">Full matchMor membership — introductions, date ideas, post-date coaching, the complete experience — at no cost for your first six months. Our commitment to you while we build together.</div>
      <span class="benefit-value">$109.80 value</span>
    </div>
    <div class="benefit-card reveal reveal-delay-2">
      <div class="benefit-icon">✦</div>
      <div class="benefit-title">White-Glove Onboarding</div>
      <div class="benefit-body">Every founding member profile is reviewed by a human — not just the AI — before your first introduction. At this scale, we know you by name. That kind of attention doesn't last forever.</div>
      <span class="benefit-value">Founding Only</span>
    </div>
    <div class="benefit-card reveal reveal-delay-3">
      <div class="benefit-icon">🎙️</div>
      <div class="benefit-title">Direct Voice</div>
      <div class="benefit-body">Monthly founding member calls with the matchMor team. Your feedback shapes the product — the questions we ask, the date ideas we suggest, the coaching we offer. You build this with us.</div>
      <span class="benefit-value">Founding Only</span>
    </div>
    <div class="benefit-card reveal reveal-delay-1">
      <div class="benefit-icon">🔒</div>
      <div class="benefit-title">Founding Rate Lock</div>
      <div class="benefit-body">$18.30/month for as long as you remain an active member — guaranteed. When matchMor eventually raises pricing, your founding rate is locked in permanently.</div>
      <span class="benefit-value">Forever Locked</span>
    </div>
    <div class="benefit-card reveal reveal-delay-2">
      <div class="benefit-icon">⏸️</div>
      <div class="benefit-title">Generous Pause Policy</div>
      <div class="benefit-body">Life doesn't pause — missions, family, moves. Founding members can pause up to 4 months per year without losing their place, their profile, or their founding rate.</div>
      <span class="benefit-value">4 Months/Year</span>
    </div>
    <div class="benefit-card reveal reveal-delay-3">
      <div class="benefit-icon">💛</div>
      <div class="benefit-title">Founding Badge</div>
      <div class="benefit-body">Your profile carries a permanent Founding Member badge — a quiet signal to future matches that you were here from the beginning, invested in building something meaningful.</div>
      <span class="benefit-value">Permanent</span>
    </div>
  </div>
</section>

<!-- HONEST SECTION -->
<div class="honest-section" id="our-promise">
  <div class="honest-inner">
    <div class="section-eyebrow reveal" style="color:var(--gold)">Our Promise to You</div>
    <div class="honest-quote reveal reveal-delay-1">
      "We don't give you a pool to swim in alone.<br>
      We give you <em>one door at a time</em> —<br>
      and we walk with you through it."
    </div>
    <div class="honest-attr reveal reveal-delay-2">The matchMor Commitment</div>

    <div class="promise-grid reveal reveal-delay-2">
      <div class="promise-card">
        <div class="promise-check">✓</div>
        <div>
          <div class="promise-title">We will always present matches</div>
          <div class="promise-body">As long as you're an active member, you will receive curated introductions. We don't promise a match by Tuesday — we promise you will never be forgotten or left waiting without reason.</div>
        </div>
      </div>
      <div class="promise-card">
        <div class="promise-check">✓</div>
        <div>
          <div class="promise-title">We will never rush you</div>
          <div class="promise-body">Courtship is not a race. matchMor is designed around your pace — not the app's engagement metrics. We succeed when you find an eternal companion, not when you open the app daily.</div>
        </div>
      </div>
      <div class="promise-card">
        <div class="promise-check">✓</div>
        <div>
          <div class="promise-title">Your faith is the foundation</div>
          <div class="promise-body">Temple readiness, mission service, testimony, family vision — these are not filter checkboxes. They are the core dimensions our AI was built to understand and honor.</div>
        </div>
      </div>
      <div class="promise-card">
        <div class="promise-check">✓</div>
        <div>
          <div class="promise-title">We will be honest about our stage</div>
          <div class="promise-body">matchMor is launching now in Utah Valley. The pool is small and intentional. That is a feature — not a bug. Every founding member receives more personal attention than any app can offer at scale.</div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- TESTIMONIALS -->
<div class="testimonials-section">
  <div class="testimonials-inner">
    <div class="section-eyebrow reveal">Early Feedback</div>
    <h2 class="section-heading reveal reveal-delay-1" style="color:var(--brown2)">What <em>founding members</em> are saying.</h2>

    <div class="testimonials-grid">
      <div class="testimonial reveal reveal-delay-1">
        <div class="testimonial-stars">★★★★★</div>
        <div class="testimonial-quote">I've been on every LDS dating app. This is the first one that actually felt like someone was paying attention to who I am — not just what I look like.</div>
        <div class="testimonial-person">
          <div class="testimonial-avatar" style="background:#7A8C6E">R</div>
          <div>
            <div class="testimonial-name">Rachel H.</div>
            <div class="testimonial-detail">Founding Member · Provo, UT</div>
          </div>
        </div>
      </div>
      <div class="testimonial reveal reveal-delay-2">
        <div class="testimonial-stars">★★★★★</div>
        <div class="testimonial-quote">The compatibility brief before our first conversation was remarkable. We knew we had real things in common before we said hello. It changed the whole dynamic.</div>
        <div class="testimonial-person">
          <div class="testimonial-avatar" style="background:#B8923A">C</div>
          <div>
            <div class="testimonial-name">Caleb S.</div>
            <div class="testimonial-detail">Founding Member · Salt Lake City, UT</div>
          </div>
        </div>
      </div>
      <div class="testimonial reveal reveal-delay-3">
        <div class="testimonial-stars">★★★★★</div>
        <div class="testimonial-quote">The post-date reflection questions were things I'd never thought to ask myself. They helped me understand what I actually felt — not just what I thought I should feel.</div>
        <div class="testimonial-person">
          <div class="testimonial-avatar" style="background:#C4714A">H</div>
          <div>
            <div class="testimonial-name">Hannah W.</div>
            <div class="testimonial-detail">Founding Member · Provo, UT</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- CTA -->
<div class="cta-section" id="join">
  <div class="cta-inner">

    <svg class="cta-star" viewBox="0 0 60 60" fill="none">
      <g transform="translate(30,30)">
        <polygon points="0,-26 6,-6 26,0 6,6 0,26 -6,6 -26,0 -6,-6" fill="#C9A84C" opacity="0.15"/>
        <polygon points="0,-26 6,-6 26,0 6,6 0,26 -6,6 -26,0 -6,-6" fill="none" stroke="#C9A84C" stroke-width="1.2"/>
        <circle cx="0" cy="0" r="3" fill="#C9A84C"/>
      </g>
    </svg>

    <div class="spots-left reveal">
      <div class="pulse"></div>
      <span>Only <strong id="spotsLeftCta">57</strong> founding spots remaining</span>
    </div>

    <h2 class="cta-heading reveal reveal-delay-1">
      Your eternal companion<br>is looking for you <em>too.</em>
    </h2>
    <p class="cta-sub reveal reveal-delay-2">
      Join the founding cohort. Six months free. White-glove onboarding. A rate locked forever. And the quiet knowledge that you were here when matchMor began.
    </p>

    <!-- FORM -->
    <div id="ctaFormWrap" class="reveal reveal-delay-3">
      <form class="cta-form" id="ctaForm" onsubmit="handleCtaSubmit(event)">
        <div class="cta-input-row">
          <input class="cta-input" type="text" placeholder="First name" required id="ctaFirst">
          <input class="cta-input" type="text" placeholder="Last name" required id="ctaLast">
        </div>
        <input class="cta-input" type="email" placeholder="Email address" required id="ctaEmail">
        <select class="cta-select" id="ctaLocation" required>
          <option value="" disabled selected>Where are you located?</option>
          <option>Provo / Orem, UT</option>
          <option>Salt Lake City, UT</option>
          <option>Logan / Cache Valley, UT</option>
          <option>St. George, UT</option>
          <option>Boise / Meridian, ID</option>
          <option>Mesa / Phoenix, AZ</option>
          <option>Other Utah County</option>
          <option>Other — Notify me when my area launches</option>
        </select>
        <select class="cta-select" id="ctaGender" required>
          <option value="" disabled selected>I am a...</option>
          <option>Latter-day Saint woman seeking a man</option>
          <option>Latter-day Saint man seeking a woman</option>
        </select>
        <button type="submit" class="cta-btn">Claim My Founding Spot — It's Free →</button>
        <div class="cta-privacy">No credit card required. No spam. We will contact you when matchMor launches in your area. Your information is never sold or shared. <a href="#" style="color:var(--gold);text-decoration:none">Privacy Policy</a></div>
      </form>
    </div>

    <div class="success-state" id="successState">
      <div class="success-icon">✦</div>
      <div class="success-heading">You're on the list.</div>
      <div class="success-body">Welcome to the matchMor founding cohort. We'll be in touch soon with next steps — and your first introduction when we launch in your area this spring.</div>
      <div class="success-ref" id="successRef"></div>
    </div>

  </div>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-logo"><span>match</span><span class="Mor">Mor</span></div>
  <div class="footer-links">
    <a href="#" class="footer-link">How It Works</a>
    <a href="#" class="footer-link">Our Promise</a>
    <a href="#" class="footer-link">Privacy Policy</a>
    <a href="#" class="footer-link">Terms</a>
    <a href="/cdn-cgi/l/email-protection#cba3aea7a7a48ba6aabfa8a3a6a4b9e5a8a4a6" class="footer-link">Contact</a>
  </div>
  <div class="footer-copy">© 2026 matchMor, LLC · Provo, Utah · Eternal Connections, Intelligently Made.</div>
</footer>

<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script>
// ── NAV SCROLL ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 40);
});

// ── LIVE COUNTER ──
async function loadWaitlistCount() {
  try {
    const res = await fetch('/api/waitlist/count');
    const data = await res.json();
    const count = Math.min(data.count, 200);
    const pct = (count / 200 * 100).toFixed(1);

    document.getElementById('spotsLeft').textContent = count;
    document.getElementById('spotsLeftCta').textContent = 200 - count;
    setTimeout(() => {
      document.getElementById('counterFill').style.width = pct + '%';
    }, 300);
  } catch (err) {
    // Fallback — keep the hardcoded values
    setTimeout(() => {
      document.getElementById('counterFill').style.width = '71.5%';
    }, 300);
  }
}

window.addEventListener('load', loadWaitlistCount);

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── REFERRAL CODE ──
function genRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = 'FM-';
  for (let i = 0; i < 6; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

// ── HERO FORM ──
function handleHeroSubmit(e) {
  e.preventDefault();
  const email = document.getElementById('heroEmail').value;
  if (!email) return;
  // Scroll to full form with email pre-filled
  document.getElementById('ctaEmail').value = email;
  document.getElementById('join').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => document.getElementById('ctaFirst').focus(), 600);
}

// ── CTA FORM ──
async function handleCtaSubmit(e) {
  e.preventDefault();

  const first   = document.getElementById('ctaFirst').value.trim();
  const last    = document.getElementById('ctaLast').value.trim();
  const email   = document.getElementById('ctaEmail').value.trim();
  const location = document.getElementById('ctaLocation').value;
  const gender  = document.getElementById('ctaGender').value;

  if (!first || !last || !email || !location || !gender) return;

  // Disable button while submitting
  const btn = document.querySelector('.cta-btn');
  const origText = btn.textContent;
  btn.textContent = 'Claiming your spot...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, firstName: first, lastName: last, location, gender })
    });

    const data = await res.json();

    if (data.success) {
      // Show success state
      document.getElementById('ctaFormWrap').style.display = 'none';
      const ss = document.getElementById('successState');
      ss.classList.add('visible');
      document.getElementById('successRef').textContent = 'Your Founding Member Reference: ' + data.foundingRef;

      // Update counter
      const current = parseInt(document.getElementById('spotsLeft').textContent);
      const newCount = Math.min(current + 1, 200);
      document.getElementById('spotsLeft').textContent = newCount;
      document.getElementById('spotsLeftCta').textContent = 200 - newCount;
      document.getElementById('counterFill').style.width = (newCount / 200 * 100) + '%';
    } else {
      btn.textContent = origText;
      btn.disabled = false;
      btn.style.opacity = '1';
      alert(data.error || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    btn.textContent = origText;
    btn.disabled = false;
    btn.style.opacity = '1';
    alert('Connection error. Please check your internet and try again.');
  }
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector`

export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
