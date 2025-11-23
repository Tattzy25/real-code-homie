"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NewsletterForm } from "@/components/newsletter-form"
import { HelperHomieWidget } from "@/components/helper-homie-widget"
import { AnimatedBackground } from "@/components/animated-background"
import { AnimatedLogo } from "@/components/animated-logo"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialCard } from "@/components/testimonial-card"
import { TrustBadge } from "@/components/trust-badge"
import { PricingPreview } from "@/components/pricing-preview"
import { Code, Zap, Shield, Sparkles, Cpu, Eye, Clock, Lock } from "lucide-react"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-purple-900/30" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <AnimatedLogo size={40} />
              <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Code Homie
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
              Testimonials
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Your coding homie.{" "}
              <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                AI that codes, builds, and previews — live.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Get instant code solutions, real-time previews, and AI-powered assistance for any programming challenge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 shadow-lg shadow-purple-500/20"
                >
                  Try Code Homie Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-purple-500 text-purple-300 hover:bg-purple-950/30"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>

          {/* Code Preview Animation */}
          <div className="mt-16 w-full max-w-4xl mx-auto relative">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden">
              <div className="border-b border-purple-900/50 px-4 py-2 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="ml-2 text-sm text-gray-400">code-homie-terminal</div>
              </div>
              <div className="p-4 font-mono text-sm text-left overflow-hidden h-64">
                <div className="flex">
                  <span className="text-purple-500 mr-2">$</span>
                  <span className="typing-animation">Ask Code Homie to create a React component</span>
                </div>
                <div className="mt-2 text-green-400">
                  <span className="typing-animation-delayed">
                    Creating a responsive navbar component with dropdown menu...
                  </span>
                </div>
                <div className="mt-4 text-blue-300">
                  <pre className="typing-animation-delayed-more overflow-x-auto">
                    {`import React, { useState } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Logo</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:text-gray-300">Home</a>
            <a href="#" className="hover:text-gray-300">Features</a>
            <a href="#" className="hover:text-gray-300">Pricing</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Home</a>
            <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Features</a>
            <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Pricing</a>
            <a href="#" className="block hover:bg-gray-700 px-3 py-2 rounded-md">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};`}
                  </pre>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
              Live Preview Available
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-gray-400 text-sm mb-2">Scroll to explore</span>
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Supercharge Your Coding
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Code Homie combines powerful AI models with real-time previews to help you code faster and smarter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="h-6 w-6 text-purple-400" />}
              title="AI Code Generation"
              description="Generate high-quality code snippets, functions, and entire components with simple prompts."
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6 text-blue-400" />}
              title="Live Preview"
              description="See your code in action instantly with our real-time preview environment."
            />
            <FeatureCard
              icon={<Cpu className="h-6 w-6 text-green-400" />}
              title="Multiple AI Models"
              description="Choose from various AI models including Llama 4, DeepSeek, and GPT-4o for different tasks."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-yellow-400" />}
              title="Instant Debugging"
              description="Identify and fix bugs quickly with AI-powered debugging suggestions."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-pink-400" />}
              title="Custom Personas"
              description="Switch between specialized AI personas like Debugger, Architect, or Speed Coder."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6 text-orange-400" />}
              title="Conversation History"
              description="Save and revisit your coding conversations to pick up where you left off."
            />
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Why Code Homie Is Different
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Not just another AI coding assistant. Code Homie brings unique features that make coding faster and more
              enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden p-6">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Real-Time Output
              </h3>
              <p className="text-gray-300 mb-4">
                Watch as Code Homie generates solutions in real-time, character by character. No more waiting for
                responses.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Stream-based generation</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Instant feedback loop</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Stop generation at any time</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden p-6">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Live Preview Environment
              </h3>
              <p className="text-gray-300 mb-4">
                See your code running in a sandboxed environment instantly. Test and iterate without leaving the
                platform.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>React, Next.js, and vanilla JS support</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Real browser rendering</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Edit and see changes instantly</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden p-6">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Multiple AI Models
              </h3>
              <p className="text-gray-300 mb-4">
                Choose the right AI model for your specific task. From fast responses to deep code understanding.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Llama 4 for fast responses</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>DeepSeek for complex code understanding</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>GPT-4o for advanced problem-solving</span>
                </li>
              </ul>
            </div>

            <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden p-6">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Specialized Personas
              </h3>
              <p className="text-gray-300 mb-4">
                Switch between different AI personas optimized for specific coding tasks and styles.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Debugger for fixing issues</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Architect for system design</span>
                </li>
                <li className="flex items-start">
                  <div className="text-green-400 mr-2">✓</div>
                  <span>Speed Coder for rapid prototyping</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 px-4 bg-zinc-900 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Choose Your Code Homie
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the plan that fits your coding needs and budget
            </p>
          </div>

          <PricingPreview />

          <div className="text-center mt-10">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              >
                View Full Pricing Details
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-black relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                What Developers Say
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who are already using Code Homie to boost their productivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Code Homie has cut my development time in half. The live preview feature is a game-changer for rapid prototyping."
              author="Alex Chen"
              role="Frontend Developer"
              avatarUrl="/diverse-group.png"
            />
            <TestimonialCard
              quote="I've tried many AI coding assistants, but Code Homie's specialized personas and multiple models make it stand out from the rest."
              author="Sarah Johnson"
              role="Full Stack Engineer"
              avatarUrl="/diverse-group.png"
            />
            <TestimonialCard
              quote="The debugging capabilities are incredible. It found an edge case in my code that I had been struggling with for days."
              author="Michael Rodriguez"
              role="Software Architect"
              avatarUrl="/diverse-group.png"
            />
          </div>
        </div>
      </section>

      {/* Trust & Privacy Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-900 to-black relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Security & Privacy First
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your code and data are always protected with enterprise-grade security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TrustBadge
              icon={<Lock className="h-6 w-6 text-purple-400" />}
              title="No API Keys Required"
              description="Use Code Homie without sharing your personal API keys. We handle all the AI model access for you."
            />
            <TrustBadge
              icon={<Shield className="h-6 w-6 text-blue-400" />}
              title="Secure Backend"
              description="All your code and conversations are encrypted and securely stored on our protected servers."
            />
            <TrustBadge
              icon={<Eye className="h-6 w-6 text-green-400" stroke="currentColor" />}
              title="Privacy Focused"
              description="Your code is never used to train models or shared with third parties. What's yours stays yours."
            />
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-950 relative z-10">
        <div className="container mx-auto max-w-xl">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-purple-900/50 rounded-lg shadow-2xl shadow-purple-500/10 overflow-hidden p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                  Stay in the Loop
                </span>
              </h2>
              <p className="text-gray-300">
                Get the latest updates, coding tips, and exclusive offers directly to your inbox
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900 to-blue-900 relative z-10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to code smarter, not harder?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of developers who are already using Code Homie to boost their productivity
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 text-lg px-8 py-6">
              Try Code Homie Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4 bg-black relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <AnimatedLogo size={32} />
              <span className="font-bold bg-gradient-to-r from-purple-500 to-green-400 bg-clip-text text-transparent">
                Code Homie
              </span>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Code Homie. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Helper Homie Chat Widget */}
      <HelperHomieWidget />
    </div>
  )
}
