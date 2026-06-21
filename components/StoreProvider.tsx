"use client"

import { useTransactionStore } from "@/store/transactionStore"
import { useEventStore } from "@/store/eventStore"

/**
 * Forces zustand store modules into the shared client bundle.
 * Without this, Turbopack can create separate store instances per page,
 * making mutations invisible across navigations.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Subscribe to both stores so their modules are loaded in the shared bundle
  useTransactionStore((s) => s.transactions.length)
  useEventStore((s) => s.events.length)

  return <>{children}</>
}
