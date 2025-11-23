import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Code Homie - AI Coding Assistant",
  description: "Your AI coding and brainstorming partner",
  icons: {
    icon: "/favicon.ico",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
