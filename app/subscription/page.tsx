"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { PayPalSubscriptionButton } from "@/components/paypal-subscription-button"
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth"

type PlanType = "pro" | "engineer"

const PLANS = {
  pro: {
    name: "Pro Builder Homie",
    price: "$12",
    image: "/images/pro-builder-homie.png",
    features: [
      "100 AI generations per month",
      "Advanced code assistance",
      "Access to Llama 4 models",
      "Code explanations",
      "Priority support",
    ],
  },
  engineer: {
    name: "Pro Engineer Homie",
    price: "$29",
    image: "/images/pro-engineer-homie.png",
    features: [
      "Everything in Pro Builder",
      "Access to all models including GPT-4o",
      "Priority processing",
      "Advanced debugging",
      "Custom AI personas",
    ],
  },
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("pro")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { session } = useSupabaseAuth()
  const { toast } = useToast()

  // Get plan from URL if provided
  useEffect(() => {
    const planParam = searchParams.get("plan")
    if (planParam === "pro" || planParam === "engineer") {
      setSelectedPlan(planParam)
    }
  }, [searchParams])

  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      router.push("/login")
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Subscription</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card
              className={`bg-zinc-900 border ${
                selectedPlan === "pro" ? "border-blue-600" : "border-zinc-800"
              } cursor-pointer transition-all hover:border-blue-600/70`}
              onClick={() => setSelectedPlan("pro")}
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Image
                    src={PLANS.pro.image || "/placeholder.svg"}
                    alt="Pro Builder Homie"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
                <CardTitle className="flex items-center justify-center">
                  Pro Builder Homie
                  {selectedPlan === "pro" && <Check className="ml-2 h-5 w-5 text-blue-500" />}
                </CardTitle>
                <CardDescription>For regular coding projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4 text-center">
                  $12<span className="text-zinc-500 text-lg font-normal">/month</span>
                </p>
                <ul className="space-y-2">
                  {PLANS.pro.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="text-green-500 mr-2">✓</div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`bg-zinc-900 border ${
                selectedPlan === "engineer" ? "border-blue-600" : "border-zinc-800"
              } cursor-pointer transition-all hover:border-blue-600/70`}
              onClick={() => setSelectedPlan("engineer")}
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Image
                    src={PLANS.engineer.image || "/placeholder.svg"}
                    alt="Pro Engineer Homie"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
                <CardTitle className="flex items-center justify-center">
                  Pro Engineer Homie
                  {selectedPlan === "engineer" && <Check className="ml-2 h-5 w-5 text-blue-500" />}
                </CardTitle>
                <CardDescription>For professional developers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4 text-center">
                  $29<span className="text-zinc-500 text-lg font-normal">/month</span>
                </p>
                <ul className="space-y-2">
                  {PLANS.engineer.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="text-green-500 mr-2">✓</div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border-zinc-800 mb-8">
            <CardHeader>
              <CardTitle>Complete Your Subscription</CardTitle>
              <CardDescription>You'll be charged monthly until you cancel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-medium mb-2">Selected Plan:</h3>
                <div className="bg-zinc-800 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Image
                        src={PLANS[selectedPlan].image || "/placeholder.svg"}
                        alt={PLANS[selectedPlan].name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-medium">{PLANS[selectedPlan].name}</p>
                        <p className="text-zinc-400 text-sm">Monthly subscription</p>
                      </div>
                    </div>
                    <p className="font-bold">{PLANS[selectedPlan].price}</p>
                  </div>
                </div>
              </div>

              <PayPalSubscriptionButton planKey={selectedPlan} userId={session.user.id} />
            </CardContent>
            <CardFooter className="flex flex-col items-start text-sm text-zinc-400">
              <p className="mb-2">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
              <p>You can cancel your subscription at any time from your account dashboard.</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
