"use client"

// Prevent BigInt JSON.stringify crashes (Soroban SDK decodes u64/i128 as BigInt)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof BigInt !== "undefined" && !(BigInt.prototype as any).toJSON) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (BigInt.prototype as any).toJSON = function () {
    return Number(this)
  }
}

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5000,
            retry: 2,
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
