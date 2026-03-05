// updated
//============================================================
// app/api/webhooks/stripe/route.ts
// Stripe webhook handler
// Keeps subscription status in sync with Supabase
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

// Required: raw body for Stripe signature verification
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  // ── VERIFY WEBHOOK SIGNATURE ──
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('[stripe-webhook] Invalid signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`[stripe-webhook] ${event.type}`)

  try {
    switch (event.type) {

      // ── CHECKOUT COMPLETED ──
      // Member just subscribed (or started free trial)
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const profileId = session.metadata?.profile_id
        if (!profileId) break

        await supabaseAdmin
          .from('profiles')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_sub_id: session.subscription as string,
            subscription_status: 'active',
            status: 'active',
          })
          .eq('id', profileId)

        console.log(`[stripe-webhook] Member ${profileId} subscribed`)
        break
      }

      // ── TRIAL WILL END ──
      // Send a heads-up email 3 days before trial ends
      case 'customer.subscription.trial_will_end': {
        const sub = event.data.object as Stripe.Subscription
        const profileId = sub.metadata?.profile_id
        if (!profileId) break

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('email, first_name')
          .eq('id', profileId)
          .single()

        if (profile) {
          // Send trial ending reminder email here
          console.log(`[stripe-webhook] Trial ending soon for ${profile.email}`)
        }
        break
      }

      // ── SUBSCRIPTION UPDATED ──
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const profileId = sub.metadata?.profile_id
        if (!profileId) break

        const statusMap: Record<string, string> = {
          active: 'active',
          trialing: 'trialing',
          past_due: 'past_due',
          canceled: 'cancelled',
          unpaid: 'past_due',
          paused: 'paused',
        }

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: statusMap[sub.status] || 'inactive',
            subscription_ends_at: new Date((sub as any).current_period_end * 1000).toISOString(),
          })
          .eq('id', profileId)

        break
      }

      // ── SUBSCRIPTION CANCELLED ──
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const profileId = sub.metadata?.profile_id
        if (!profileId) break

        await supabaseAdmin
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            status: 'cancelled',
          })
          .eq('id', profileId)

        console.log(`[stripe-webhook] Member ${profileId} cancelled`)
        break
      }

      // ── PAYMENT FAILED ──
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, email, first_name')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabaseAdmin
            .from('profiles')
            .update({ subscription_status: 'past_due' })
            .eq('id', profile.id)

          // Send payment failed email here
          console.log(`[stripe-webhook] Payment failed for ${profile.email}`)
        }
        break
      }

      default:
        console.log(`[stripe-webhook] Unhandled event: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (err) {
    console.error('[stripe-webhook] Handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }
}
