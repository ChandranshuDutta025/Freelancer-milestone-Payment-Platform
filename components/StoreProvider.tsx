"use client"

import { AppStoreProvider } from "@/store/context"

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <AppStoreProvider>{children}</AppStoreProvider>
}
