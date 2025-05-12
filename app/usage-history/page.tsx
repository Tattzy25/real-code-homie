"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

type UsageLog = {
  id: string
  action_type: string
  tokens_used: number
  model: string
  created_at: string
}

export default function UsageHistoryPage() {
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { session, loading } = useSupabaseAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !session) {
      router.push("/login")
    }
  }, [session, loading, router])

  // Fetch usage logs
  useEffect(() => {
    const fetchUsageLogs = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)
        const supabase = (window as any).supabase

        // Get usage logs
        const { data, error } = await supabase
          .from("usage_logs")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(50)

        if (error) throw error

        setUsageLogs(data || [])
      } catch (error) {
        console.error("Error fetching usage logs:", error)
        toast({
          title: "Error",
          description: "Failed to load your usage history. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsageLogs()
  }, [session, toast])

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
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">Usage History</h1>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recent usage of Code Homie</CardDescription>
          </CardHeader>
          <CardContent>
            {usageLogs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>No usage history found.</p>
                <p className="text-sm mt-2">Start using Code Homie to see your activity here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="text-left py-3 px-4 font-medium text-zinc-400">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-400">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-zinc-400">Model</th>
                      <th className="text-right py-3 px-4 font-medium text-zinc-400">Tokens</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageLogs.map((log) => (
                      <tr key={log.id} className="border-b border-zinc-800">
                        <td className="py-3 px-4">{formatDate(log.created_at)}</td>
                        <td className="py-3 px-4 capitalize">{log.action_type.replace(/_/g, " ")}</td>
                        <td className="py-3 px-4">{log.model || "N/A"}</td>
                        <td className="py-3 px-4 text-right">{log.tokens_used || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
