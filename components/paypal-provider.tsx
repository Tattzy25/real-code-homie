"use client"

import type React from "react"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  // Get the client ID from environment variable
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test"

  return (
    <PayPalScriptProvider
      options={{
        "client-id": clientId,
        currency: "USD",
        intent: "subscription",
        vault: true,
        components: "buttons",
      }}
      deferLoading={true} // Defer loading until needed
    >
      {children}
    </PayPalScriptProvider>
  )
}
