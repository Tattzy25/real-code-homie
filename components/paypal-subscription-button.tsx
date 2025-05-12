"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"

type PayPalSubscriptionButtonProps = {
  planKey: "pro" | "engineer"
  userId: string
}

// Plan IDs from PayPal Developer Dashboard
const PLAN_IDS = {
  pro: process.env.NEXT_PUBLIC_PAYPAL_PRO_PLAN_ID || "P-5Y909709B3733863MNAQOXJA",
  engineer: process.env.NEXT_PUBLIC_PAYPAL_ENGINEER_PLAN_ID || "P-0ER58640224801542NAQOUUA",
}

export function PayPalSubscriptionButton({ planKey, userId }: PayPalSubscriptionButtonProps) {
  const [{ isPending, isResolved, isRejected }, dispatch] = usePayPalScriptReducer()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { session } = useSupabaseAuth()

  // Load PayPal script when component mounts
  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "subscription",
        vault: true,
        components: "buttons",
      },
    })
  }, [dispatch])

  const createSubscription = async (data: any) => {
    try {
      // Call our API to record the subscription
      const response = await fetch("/api/subscriptions/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: data.subscriptionID,
          planId: PLAN_IDS[planKey],
          userId: userId,
          planKey: planKey,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription record")
      }

      return true
    } catch (error) {
      console.error("Error creating subscription record:", error)
      return false
    }
  }

  if (isRejected) {
    return (
      <div className="w-full p-4 bg-red-900/20 border border-red-900 rounded-md text-center">
        <p className="text-red-300 mb-2">Failed to load PayPal</p>
        <Button
          onClick={() =>
            dispatch({
              type: "resetOptions",
              value: {
                "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
                currency: "USD",
                intent: "subscription",
                vault: true,
                components: "buttons",
              },
            })
          }
          className="bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {isPending || isLoading ? (
        <Button disabled className="w-full py-3 bg-[#0070ba] hover:bg-[#003087] text-white">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading PayPal...
        </Button>
      ) : (
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "subscribe",
          }}
          createSubscription={(data, actions) => {
            return actions.subscription
              .create({
                plan_id: PLAN_IDS[planKey],
                application_context: {
                  shipping_preference: "NO_SHIPPING",
                },
              })
              .then((orderId) => {
                return orderId
              })
          }}
          onApprove={async (data, actions) => {
            setIsLoading(true)

            // Record subscription in our database
            const success = await createSubscription(data)

            if (success) {
              toast({
                title: "Subscription successful!",
                description: `You are now subscribed to the ${planKey === "pro" ? "Pro Builder" : "Pro Engineer"} plan.`,
              })

              // Redirect to dashboard
              router.push("/dashboard")
            } else {
              toast({
                title: "Error",
                description: "There was a problem with your subscription. Please contact support.",
                variant: "destructive",
              })
            }

            setIsLoading(false)
          }}
          onError={(err) => {
            console.error("PayPal error:", err)
            toast({
              title: "Payment Error",
              description: "There was a problem processing your payment. Please try again.",
              variant: "destructive",
            })
          }}
        />
      )}
    </div>
  )
}
