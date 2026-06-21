"use client"

import { AppStoreProvider, useTransactionStore, useEventStore } from "@/store/context"

function DebugPanel() {
  const txCount = useTransactionStore((s) => s.transactions.length)
  const evCount = useEventStore((s) => s.events.length)

  return (
    <div
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        zIndex: 99999,
        background: "rgba(0,0,0,0.9)",
        color: "#0f0",
        fontSize: 13,
        fontFamily: "monospace",
        padding: "10px 14px",
        borderRadius: 6,
        pointerEvents: "none",
        lineHeight: 1.5,
      }}
    >
      TX: {txCount} | EV: {evCount}
    </div>
  )
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppStoreProvider>
      {children}
      <DebugPanel />
    </AppStoreProvider>
  )
}
