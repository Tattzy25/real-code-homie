"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "What is Code Homie?",
    answer:
      "Code Homie is an AI-powered coding assistant that helps developers write, debug, and understand code. It uses advanced AI models to provide intelligent code suggestions, explanations, and solutions to coding problems.",
  },
  {
    question: "How does the free tier work?",
    answer:
      "The free tier gives you access to 3 AI generations per day using our Llama 4 Scout model. You can save your conversation history and access basic code assistance features. It's perfect for trying out the platform or for occasional use.",
  },
  {
    question: "What's included in the Pro Builder plan?",
    answer:
      "The Pro Builder plan gives you 100 AI generations per month, advanced code assistance, detailed breakdowns, priority support, and access to Llama 4 Scout and Maverick models. You also get access to all AI personas including Debugger, Architect, Speed Coder, and Teacher.",
  },
  {
    question: "What AI models does Code Homie use?",
    answer:
      "Code Homie uses a variety of AI models including Llama 4, DeepSeek, and GPT-4o. Different subscription tiers give you access to different models, with our Pro Engineer tier providing access to all available models.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period, after which it will not renew.",
  },
  {
    question: "How does Code Homie handle my code data?",
    answer:
      "We take your privacy seriously. Your code is only used to generate responses and is not stored or used to train our models. We implement strict security measures to protect your data.",
  },
  {
    question: "Can I use Code Homie for commercial projects?",
    answer:
      "Code Homie can be used for personal, educational, or commercial projects. Our Pro tiers are designed for professional developers working on commercial applications.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee if you're not satisfied with your subscription. Contact our support team to request a refund within this period.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-zinc-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-zinc-400" />
                )}
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <p className="text-zinc-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
