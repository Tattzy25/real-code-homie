import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function PricingPreview() {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex justify-center mb-4">
          <Image src="/images/free-homie.png" alt="Free Homie" width={120} height={120} className="rounded-lg" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">Free Homie</h3>
        <p className="text-3xl font-bold mb-4 text-center">
          $0<span className="text-gray-500 text-lg font-normal">/mo</span>
        </p>
        <p className="text-gray-400 mb-6 text-center">Perfect for occasional coding help</p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>5 generations per day</span>
          </li>
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>Basic models</span>
          </li>
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>No live preview</span>
          </li>
        </ul>
        <Link href="/signup">
          <Button className="w-full">Get Started</Button>
        </Link>
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-sm border-2 border-purple-500 rounded-lg p-6 transform md:scale-105 shadow-lg shadow-purple-500/10 relative">
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </div>
        <div className="flex justify-center mb-4">
          <Image
            src="/images/pro-builder-homie.png"
            alt="Pro Builder Homie"
            width={120}
            height={120}
            className="rounded-lg"
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">Pro Builder Homie</h3>
        <p className="text-3xl font-bold mb-4 text-center">
          $12<span className="text-gray-500 text-lg font-normal">/mo</span>
        </p>
        <p className="text-gray-400 mb-6 text-center">For regular coding projects</p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>100 generations</span>
          </li>
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>Scout + Maverick models</span>
          </li>
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>Prompt templates</span>
          </li>
        </ul>
        <Link href="/signup?plan=pro">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
            Choose Pro
          </Button>
        </Link>
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/pro-engineer-homie.png"
            alt="Pro Engineer Homie"
            width={120}
            height={120}
            className="rounded-lg"
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">Pro Engineer Homie</h3>
        <p className="text-3xl font-bold mb-4 text-center">
          $29<span className="text-gray-500 text-lg font-normal">/mo</span>
        </p>
        <p className="text-gray-400 mb-6 text-center">For professional developers</p>
        <ul className="space-y-3 mb-8">
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>Unlimited generations</span>
          </li>
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>All models (GPT-4o, DeepSeek)</span>
          </li>
          <li className="flex items-start">
            <div className="text-green-500 mr-2">✓</div>
            <span>Custom personas</span>
          </li>
        </ul>
        <Link href="/signup?plan=engineer">
          <Button className="w-full">Choose Engineer</Button>
        </Link>
      </div>
    </div>
  )
}
