import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, X, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TierComparisonPage() {
  const tiers = [
    {
      name: "Free Homie",
      price: "$0",
      image: "/images/free-homie.png",
      description: "Perfect for occasional coding help",
      features: {
        "Daily Generations": "3 per day",
        "AI Models": "Llama 4 Scout",
        "Code Assistance": "Basic",
        "Conversation History": true,
        "Code Explanations": "Basic",
        "Priority Support": false,
        "Custom AI Personas": false,
        "Advanced Debugging": false,
        "Priority Processing": false,
      },
    },
    {
      name: "Pro Builder Homie",
      price: "$12",
      image: "/images/pro-builder-homie.png",
      description: "For regular coding projects",
      features: {
        "Daily Generations": "100 per month",
        "AI Models": "Llama 4 Scout & Maverick",
        "Code Assistance": "Advanced",
        "Conversation History": true,
        "Code Explanations": "Detailed",
        "Priority Support": true,
        "Custom AI Personas": true,
        "Advanced Debugging": false,
        "Priority Processing": false,
      },
      popular: true,
    },
    {
      name: "Pro Engineer Homie",
      price: "$29",
      image: "/images/pro-engineer-homie.png",
      description: "For professional developers",
      features: {
        "Daily Generations": "Unlimited",
        "AI Models": "All Models (incl. GPT-4o)",
        "Code Assistance": "Premium",
        "Conversation History": true,
        "Code Explanations": "Expert-level",
        "Priority Support": true,
        "Custom AI Personas": true,
        "Advanced Debugging": true,
        "Priority Processing": true,
      },
    },
  ]

  const featureLabels = [
    "Daily Generations",
    "AI Models",
    "Code Assistance",
    "Conversation History",
    "Code Explanations",
    "Priority Support",
    "Custom AI Personas",
    "Advanced Debugging",
    "Priority Processing",
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/pricing" className="flex items-center text-zinc-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pricing
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Plan Comparison</h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Compare our plans to find the perfect Code Homie for your coding needs
            </p>
          </div>

          {/* Mobile view - Cards */}
          <div className="md:hidden space-y-8">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`bg-zinc-900 border ${tier.popular ? "border-blue-600" : "border-zinc-800"}`}
              >
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Image
                      src={tier.image || "/placeholder.svg"}
                      alt={tier.name}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    />
                  </div>
                  <CardTitle className="text-center">{tier.name}</CardTitle>
                  <CardDescription className="text-center">{tier.description}</CardDescription>
                  <div className="text-3xl font-bold text-center mt-2">
                    {tier.price}
                    <span className="text-zinc-500 text-lg font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featureLabels.map((label) => {
                      const value = tier.features[label as keyof typeof tier.features]
                      return (
                        <div key={label} className="flex justify-between items-center border-b border-zinc-800 pb-2">
                          <span className="font-medium">{label}</span>
                          <span>
                            {typeof value === "boolean" ? (
                              value ? (
                                <Check className="h-5 w-5 text-green-500" />
                              ) : (
                                <X className="h-5 w-5 text-red-500" />
                              )
                            ) : (
                              value
                            )}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/signup${tier.name !== "Free Homie" ? `?plan=${tier.name === "Pro Builder Homie" ? "pro" : "engineer"}` : ""}`}
                    >
                      <Button className="w-full">
                        {tier.name === "Free Homie" ? "Get Started" : `Choose ${tier.name.split(" ")[0]}`}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop view - Table */}
          <div className="hidden md:block overflow-x-auto">
            <div className="min-w-full bg-zinc-900 rounded-lg border border-zinc-800">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-4 px-6 text-left border-b border-zinc-800 w-1/4"></th>
                    {tiers.map((tier) => (
                      <th
                        key={tier.name}
                        className={`py-4 px-6 text-center border-b border-zinc-800 ${
                          tier.popular ? "bg-blue-600/10 border-blue-600" : ""
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <Image
                            src={tier.image || "/placeholder.svg"}
                            alt={tier.name}
                            width={80}
                            height={80}
                            className="rounded-lg mb-3"
                          />
                          <span className="text-xl font-bold">{tier.name}</span>
                          <span className="text-zinc-400 text-sm">{tier.description}</span>
                          <span className="text-2xl font-bold mt-2">
                            {tier.price}
                            <span className="text-zinc-500 text-sm font-normal">/month</span>
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureLabels.map((label, index) => (
                    <tr key={label} className={index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-900/50"}>
                      <td className="py-4 px-6 font-medium border-b border-zinc-800">{label}</td>
                      {tiers.map((tier) => {
                        const value = tier.features[label as keyof typeof tier.features]
                        return (
                          <td
                            key={`${tier.name}-${label}`}
                            className={`py-4 px-6 text-center border-b border-zinc-800 ${
                              tier.popular ? "bg-blue-600/10" : ""
                            }`}
                          >
                            {typeof value === "boolean" ? (
                              value ? (
                                <div className="flex justify-center">
                                  <Check className="h-5 w-5 text-green-500" />
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <X className="h-5 w-5 text-red-500" />
                                </div>
                              )
                            ) : (
                              value
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  <tr>
                    <td className="py-6 px-6"></td>
                    {tiers.map((tier) => (
                      <td
                        key={`${tier.name}-action`}
                        className={`py-6 px-6 text-center ${tier.popular ? "bg-blue-600/10" : ""}`}
                      >
                        <Link
                          href={`/signup${tier.name !== "Free Homie" ? `?plan=${tier.name === "Pro Builder Homie" ? "pro" : "engineer"}` : ""}`}
                        >
                          <Button className={`w-full ${tier.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
                            {tier.name === "Free Homie" ? "Get Started" : `Choose ${tier.name.split(" ")[0]}`}
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
