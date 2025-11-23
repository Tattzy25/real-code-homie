import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/code-homie-logo.png" alt="Code Homie" width={48} height={48} className="rounded-md" />
              <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Code Homie
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
            Choose Your Code Homie
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Select the plan that fits your coding needs and budget
          </p>
        </div>

        {/* Pricing Table */}
        <div className="max-w-6xl mx-auto mb-16 overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Compare Plans</h2>
                <p className="text-gray-400">Choose the perfect plan for your development needs</p>
              </div>

              {/* Free Tier */}
              <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <Image src="/images/free-homie.png" alt="Free Homie" width={80} height={80} className="rounded-lg" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Free Homie</h3>
                <p className="text-3xl font-bold mb-4 text-center">
                  $0<span className="text-gray-500 text-lg font-normal">/mo</span>
                </p>
                <p className="text-gray-400 mb-6 text-center">Limited access for casual use</p>
                <Link href="/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>

              {/* Pro Builder Tier */}
              <div className="bg-zinc-900/80 backdrop-blur-sm border-2 border-purple-500 rounded-lg p-6 shadow-lg shadow-purple-500/10 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/pro-builder-homie.png"
                    alt="Pro Builder Homie"
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Pro Builder Homie</h3>
                <p className="text-3xl font-bold mb-4 text-center">
                  $12<span className="text-gray-500 text-lg font-normal">/mo</span>
                </p>
                <p className="text-gray-400 mb-6 text-center">For regular coding projects</p>
                <Link href="/signup?plan=pro">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                    Choose Pro
                  </Button>
                </Link>
              </div>

              {/* Pro Engineer Tier */}
              <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg p-6">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/pro-engineer-homie.png"
                    alt="Pro Engineer Homie"
                    width={80}
                    height={80}
                    className="rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Pro Engineer Homie</h3>
                <p className="text-3xl font-bold mb-4 text-center">
                  $29<span className="text-gray-500 text-lg font-normal">/mo</span>
                </p>
                <p className="text-gray-400 mb-6 text-center">For professional developers</p>
                <Link href="/signup?plan=engineer">
                  <Button className="w-full">Choose Engineer</Button>
                </Link>
              </div>
            </div>

            {/* Feature Comparison */}
            <div className="border-t border-zinc-800 pt-8">
              <h3 className="text-xl font-bold mb-6 px-6">Usage</h3>

              {/* Daily Generations */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-6 flex items-center">
                  <span>Daily Generations</span>
                </div>
                <div className="p-6 text-center">5 per day</div>
                <div className="p-6 text-center">100 per month</div>
                <div className="p-6 text-center">Unlimited</div>
              </div>

              {/* Code Preview */}
              <div className="grid grid-cols-4 gap-4 mb-4 bg-zinc-900/30">
                <div className="p-6 flex items-center">
                  <span>Live Code Preview</span>
                </div>
                <div className="p-6 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* Response Speed */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-6 flex items-center">
                  <span>Response Speed</span>
                </div>
                <div className="p-6 text-center">Standard</div>
                <div className="p-6 text-center">Fast</div>
                <div className="p-6 text-center">Priority</div>
              </div>

              <h3 className="text-xl font-bold mb-6 mt-8 px-6">AI Models</h3>

              {/* Scout Model */}
              <div className="grid grid-cols-4 gap-4 mb-4 bg-zinc-900/30">
                <div className="p-6 flex items-center">
                  <span>Llama 4 Scout</span>
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* Maverick Model */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-6 flex items-center">
                  <span>Llama 4 Maverick</span>
                </div>
                <div className="p-6 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* DeepSeek Model */}
              <div className="grid grid-cols-4 gap-4 mb-4 bg-zinc-900/30">
                <div className="p-6 flex items-center">
                  <span>DeepSeek Coder</span>
                </div>
                <div className="p-6 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              {/* GPT-4o Model */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-6 flex items-center">
                  <span>GPT-4o</span>
                </div>
                <div className="p-6 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <X className="h-5 w-5 text-red-500 mx-auto" />
                </div>
                <div className="p-6 text-center">
                  <Check className="h-5 w-5 text-green-500 mx-auto" />
                </div>
              </div>

              <h3 className="text-xl font-bold mb-6 mt-8 px-6">Features</h3>

              {/* Personas */}
              <div className="grid grid-cols-4 gap-4 mb-4 bg-zinc-900/30">
                <div className="p-6 flex items-center">
                  <span>AI Personas</span>
                </div>
                <div className="p-6 text-center">Basic</div>
                <div className="p-6 text-center">All Personas</div>
                <div className="p-6 text-center">Custom Personas</div>
              </div>

              {/* Conversation History */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-6 flex items-center">
                  <span>Conversation History</span>
                </div>
                <div className="p-6 text-center">7 days</div>
                <div className="p-6 text-center">30 days</div>
                <div className="p-6 text-center">Unlimited</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Code Homie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
