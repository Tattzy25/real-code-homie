"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SubscriptionData = {
  id: string
  subscription_id: string
  provider: string
  status: string
  plan_id: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export default function SubscriptionSettingsPage() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const { session, loading } = useSupabaseAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login")
    }
  }, [session, loading, router])

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)
        const supabase = (window as any).supabase

        // Get subscription data
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) throw error

        setSubscriptionData(data)
      } catch (error) {
        console.error("Error fetching subscription data:", error)
        toast({
          title: "Error",
          description: "Failed to load your subscription data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptionData()
  }, [session, toast])

  const handleCancelSubscription = async () => {
    if (!session?.user || !subscriptionData) return

    try {
      setIsCancelling(true)

      // Call API to cancel subscription
      const response = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId: subscriptionData.subscription_id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel subscription")
      }

      // Update subscription data
      const supabase = (window as any).supabase
      await supabase
        .from("subscriptions")
        .update({
          cancel_at_period_end: true,
          status: "cancelling",
        })
        .eq("id", subscriptionData.id)

      // Update local state
      setSubscriptionData({
        ...subscriptionData,
        cancel_at_period_end: true,
        status: "cancelling",
      })

      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will end at the end of the current billing period.",
      })
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to cancel your subscription. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const getPlanName = (planId: string) => {
    if (planId.includes("pro")) return "Pro Builder"
    if (planId.includes("engineer")) return "Pro Engineer"
    return "Unknown Plan"
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/settings" className="flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Settings
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Subscription Settings</h1>

        {!subscriptionData ? (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>No Active Subscription</CardTitle>
              <CardDescription>You don't have an active subscription</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400 mb-4">Upgrade to a paid plan to access more features and AI models.</p>
            </CardContent>
            <CardFooter>
              <Link href="/subscription" className="w-full">
                <Button className="w-full">Upgrade Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage your current subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-zinc-400">Plan</p>
                <p className="font-medium">{getPlanName(subscriptionData.plan_id)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Status</p>
                <p className="font-medium capitalize">{subscriptionData.status}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Current Period</p>
                <p className="font-medium">
                  {formatDate(subscriptionData.current_period_start)} to{" "}
                  {formatDate(subscriptionData.current_period_end)}
                </p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Payment Provider</p>
                <p className="font-medium capitalize">{subscriptionData.provider}</p>
              </div>

              {subscriptionData.cancel_at_period_end && (
                <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300 mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Subscription Cancelled</AlertTitle>
                  <AlertDescription>
                    Your subscription has been cancelled and will end on{" "}
                    {formatDate(subscriptionData.current_period_end)}. You can resubscribe at any time.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              {!subscriptionData.cancel_at_period_end && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                >
                  {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                </Button>
              )}
              <Link href="/subscription" className="w-full">
                <Button variant="outline" className="w-full">
                  {subscriptionData.cancel_at_period_end ? "Resubscribe" : "Change Plan"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
