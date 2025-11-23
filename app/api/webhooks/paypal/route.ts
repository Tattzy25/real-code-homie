import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    // Get the webhook payload
    const payload = await request.json()

    // Verify webhook signature (in production, you should verify the webhook signature)
    // const isValid = verifyPayPalWebhook(request.headers, payload)
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    // }

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Process different event types
    const eventType = payload.event_type
    const resource = payload.resource

    if (eventType === "BILLING.SUBSCRIPTION.CREATED") {
      // Subscription created - already handled by our create endpoint
      console.log("Subscription created:", resource.id)
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
      // Subscription cancelled
      const subscriptionId = resource.id

      // Find the subscription in our database
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("subscription_id", subscriptionId)
        .single()

      if (subscriptionError || !subscriptionData) {
        console.error("Subscription not found:", subscriptionId)
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }

      // Update subscription status
      await supabase
        .from("subscriptions")
        .update({
          status: "cancelled",
          cancel_at_period_end: true,
        })
        .eq("subscription_id", subscriptionId)

      // Update user's subscription status
      await supabase
        .from("users")
        .update({
          subscription_status: "cancelled",
        })
        .eq("id", subscriptionData.user_id)
    } else if (eventType === "BILLING.SUBSCRIPTION.EXPIRED") {
      // Subscription expired
      const subscriptionId = resource.id

      // Find the subscription in our database
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("subscription_id", subscriptionId)
        .single()

      if (subscriptionError || !subscriptionData) {
        console.error("Subscription not found:", subscriptionId)
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
      }

      // Update subscription status
      await supabase
        .from("subscriptions")
        .update({
          status: "expired",
        })
        .eq("subscription_id", subscriptionId)

      // Update user's subscription tier and status
      await supabase
        .from("users")
        .update({
          subscription_tier: "free",
          subscription_status: "inactive",
        })
        .eq("id", subscriptionData.user_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}
