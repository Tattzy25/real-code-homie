"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Zap, Clock, CreditCard } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

type UserData = {
  email: string
  subscription_tier: "free" | "pro" | "engineer"
  subscription_status: string
  usage_count: number
  daily_limit: number
  created_at: string
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [todayUsage, setTodayUsage] = useState(0)
  const { session, loading } = useSupabaseAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login")
    }
  }, [session, loading, router])

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)
        const supabase = (window as any).supabase

        // Get user data
        const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (error) throw error

        setUserData(data)

        // Get today's usage count for free tier
        if (data.subscription_tier === "free") {
          const today = new Date().toISOString().split("T")[0]
          const { count, error: countError } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("role", "user")
            .gte("created_at", `${today}T00:00:00Z`)
            .lt("created_at", `${today}T23:59:59Z`)
            .filter("conversation_id", "in", `(select id from conversations where user_id = '${session.user.id}')`)

          if (countError) throw countError

          setTodayUsage(count || 0)
        }
        // Get monthly usage count for pro tier
        else if (data.subscription_tier === "pro") {
          const firstDayOfMonth = new Date()
          firstDayOfMonth.setDate(1)
          firstDayOfMonth.setHours(0, 0, 0, 0)

          const { count, error: countError } = await supabase
            .from("messages")
            .select("id", { count: "exact" })
            .eq("role", "user")
            .gte("created_at", firstDayOfMonth.toISOString())
            .filter("conversation_id", "in", `(select id from conversations where user_id = '${session.user.id}')`)

          if (countError) throw countError

          setTodayUsage(count || 0) // Reusing todayUsage state for monthly usage
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your account data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session, toast])

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session || !userData) {
    return null // Will redirect to login
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Get the appropriate tier image
  const getTierImage = (tier: string) => {
    switch (tier) {
      case "free":
        return "/images/free-homie.png"
      case "pro":
        return "/images/pro-builder-homie.png"
      case "engineer":
        return "/images/pro-engineer-homie.png"
      default:
        return "/images/code-homie-logo.png"
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/code-homie-logo.png" alt="Code Homie" width={32} height={32} className="rounded-md" />
              <span className="font-bold">Code Homie</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <Button variant="ghost">Chat</Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost">Settings</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-6">
                <Image
                  src={getTierImage(userData.subscription_tier) || "/placeholder.svg"}
                  alt={`${userData.subscription_tier} tier`}
                  width={120}
                  height={120}
                  className="rounded-lg"
                />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Email</p>
                <p className="font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Member Since</p>
                <p className="font-medium">{formatDate(userData.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Current Plan</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      userData.subscription_tier === "free"
                        ? "bg-zinc-500"
                        : userData.subscription_tier === "pro"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                    }`}
                  ></span>
                  <span className="font-medium">
                    {userData.subscription_tier === "free"
                      ? "Free Tier"
                      : userData.subscription_tier === "pro"
                        ? "Pro Builder"
                        : "Pro Engineer"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-zinc-400">Subscription Status</p>
                <p className="font-medium capitalize">{userData.subscription_status || "Active"}</p>
              </div>
            </CardContent>
            <CardFooter>
              {userData.subscription_tier === "free" ? (
                <Link href="/subscription" className="w-full">
                  <Button className="w-full">Upgrade Your Plan</Button>
                </Link>
              ) : (
                <Link href="/settings/subscription" className="w-full">
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your current usage and limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-zinc-400">
                    {userData.subscription_tier === "free"
                      ? "Today's Usage"
                      : userData.subscription_tier === "pro"
                        ? "Monthly Usage"
                        : "Usage"}
                  </p>
                  <p className="text-sm font-medium">
                    {todayUsage} /{" "}
                    {userData.subscription_tier === "free"
                      ? userData.daily_limit
                      : userData.subscription_tier === "pro"
                        ? "100"
                        : "∞"}
                  </p>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      userData.subscription_tier === "free" || userData.subscription_tier === "pro"
                        ? "bg-blue-600"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${
                        userData.subscription_tier === "free"
                          ? Math.min((todayUsage / userData.daily_limit) * 100, 100)
                          : userData.subscription_tier === "pro"
                            ? Math.min((todayUsage / 100) * 100, 100)
                            : 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">Total Messages</p>
                  </div>
                  <p className="text-2xl font-bold">{userData.usage_count}</p>
                </div>
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <p className="font-medium">Available Models</p>
                  </div>
                  <p className="text-lg font-medium">
                    {userData.subscription_tier === "free"
                      ? "Llama 4 Scout"
                      : userData.subscription_tier === "pro"
                        ? "Llama 4 Models"
                        : "All Models"}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/chat">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Go to Chat
                </Button>
              </Link>
              <Link href="/usage-history">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  View History
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/chat" className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-center py-6">
                    <MessageSquare className="h-5 w-5" />
                    New Chat
                  </Button>
                </Link>
                <Link href="/subscription" className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-center py-6">
                    <CreditCard className="h-5 w-5" />
                    Manage Subscription
                  </Button>
                </Link>
                <Link href="/settings" className="w-full">
                  <Button variant="outline" className="w-full flex items-center gap-2 justify-center py-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    Account Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
