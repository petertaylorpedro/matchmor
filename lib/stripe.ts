// ============================================================
// lib/stripe.ts
// Stripe client + subscription helpers
// ============================================================

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
})

export const PRICE_ID = process.env.STRIPE_PRICE_ID!

// ── CREATE CUSTOMER ──
// Called when a member completes profile and is ready to subscribe
export async function createStripeCustomer(params: {
  email: string
  name: string
  profileId: string
  foundingMember: boolean
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      profile_id: params.profileId,
      founding_member: params.foundingMember ? 'true' : 'false',
    },
  })
  return customer
}

// ── CREATE CHECKOUT SESSION ──
// Redirects member to Stripe-hosted checkout page
// Founding members get 6-month trial automatically
export async function createCheckoutSession(params: {
  customerId: string
  profileId: string
  isFoundingMember: boolean
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: PRICE_ID, quantity: 1 }],

    // Founding members: 6 months free (180 days trial)
    subscription_data: params.isFoundingMember
      ? { trial_period_days: 180,
          metadata: { profile_id: params.profileId, founding_member: 'true' } }
      : { metadata: { profile_id: params.profileId } },

    success_url: params.successUrl,
    cancel_url: params.cancelUrl,

    // Collect billing address for tax purposes
    billing_address_collection: 'auto',

    metadata: {
      profile_id: params.profileId,
    },
  })
  return session
}

// ── CREATE BILLING PORTAL SESSION ──
// Lets members manage their subscription, update card, cancel, etc.
export async function createPortalSession(params: {
  customerId: string
  returnUrl: string
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  })
  return session
}

// ── GET SUBSCRIPTION STATUS ──
export async function getSubscriptionStatus(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return {
    status: subscription.status,
    currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    trialEnd: (subscription as any).trial_end
  ? new Date((subscription as any).trial_end * 1000)
  : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  }
}
