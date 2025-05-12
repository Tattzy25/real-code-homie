import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 px-4 bg-zinc-950">
      <div className="container mx-auto max-w-6xl text-center">
        <div className="w-full max-w-5xl mx-auto mb-8">
          <Image
            src="/images/code-homie-hero.png"
            alt="Code Homie - Hack. Stack. Hustle."
            width={1200}
            height={675}
            className="rounded-lg shadow-2xl"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your AI Coding <span className="text-[#7d2fa1]">Homie</span>
        </h1>
        <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto">
          Code Homie helps you write better code faster with AI-powered assistance, debugging, and code generation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Try Demo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
