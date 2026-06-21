"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react"
import type { TransactionRecord, ContractEvent, EventType } from "@/types"

// Window-global keys to survive Turbopack module duplication
const TX_CTX_KEY = "__APP_TX_CTX"
const EV_CTX_KEY = "__APP_EV_CTX"

interface TxValue {
  transactions: TransactionRecord[]
  currentTx: TransactionRecord | null
  addTransaction: (tx: TransactionRecord) => void
  updateTransaction: (hash: string, updates: Partial<TransactionRecord>) => void
  setCurrentTx: (tx: TransactionRecord | null) => void
  clearTransactions: () => void
  getRecentTransactions: (limit?: number) => TransactionRecord[]
}

interface EvValue {
  events: ContractEvent[]
  unreadCount: number
  addEvent: (event: ContractEvent) => void
  addEvents: (events: ContractEvent[]) => void
  clearEvents: () => void
  markAllRead: () => void
  getEventsByType: (type: EventType) => ContractEvent[]
  getEventsByProject: (projectId: number) => ContractEvent[]
}

const TX_Ctx = (
  typeof window !== "undefined" && (window as any)[TX_CTX_KEY]
    ? (window as any)[TX_CTX_KEY]
    : (() => {
        const c = createContext<TxValue | null>(null)
        if (typeof window !== "undefined") (window as any)[TX_CTX_KEY] = c
        return c
      })()
) as React.Context<TxValue | null>

const EV_Ctx = (
  typeof window !== "undefined" && (window as any)[EV_CTX_KEY]
    ? (window as any)[EV_CTX_KEY]
    : (() => {
        const c = createContext<EvValue | null>(null)
        if (typeof window !== "undefined") (window as any)[EV_CTX_KEY] = c
        return c
      })()
) as React.Context<EvValue | null>

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<TransactionRecord[]>([])
  const [currentTx, setCurrentTx] = useState<TransactionRecord | null>(null)
  const [events, setEvents] = useState<ContractEvent[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const addTransaction = useCallback((tx: TransactionRecord) => {
    console.log("[ctx] addTransaction:", tx.hash, tx.type)
    setTransactions((prev) => [tx, ...prev])
    setCurrentTx(tx)
  }, [])

  const updateTransaction = useCallback(
    (hash: string, updates: Partial<TransactionRecord>) => {
      console.log("[ctx] updateTransaction:", hash, updates)
      setTransactions((prev) =>
        prev.map((tx) => (tx.hash === hash ? { ...tx, ...updates } : tx)),
      )
      setCurrentTx((prev) =>
        prev?.hash === hash ? { ...prev, ...updates } : prev,
      )
    },
    [],
  )

  const clearTransactions = useCallback(() => {
    setTransactions([])
    setCurrentTx(null)
  }, [])

  const getRecentTransactions = useCallback(
    (limit?: number) => {
      const sorted = [...transactions].sort(
        (a, b) => b.timestamp - a.timestamp,
      )
      return limit ? sorted.slice(0, limit) : sorted
    },
    [transactions],
  )

  const addEvent = useCallback((event: ContractEvent) => {
    console.log("[ctx] addEvent:", event.type, event.projectId)
    setEvents((prev) => [event, ...prev])
    setUnreadCount((prev) => prev + 1)
  }, [])

  const addEvents = useCallback((newEvents: ContractEvent[]) => {
    console.log("[ctx] addEvents:", newEvents.length)
    setEvents((prev) => [...newEvents, ...prev])
    setUnreadCount((prev) => prev + newEvents.length)
  }, [])

  const clearEvents = useCallback(() => {
    setEvents([])
    setUnreadCount(0)
  }, [])

  const markAllRead = useCallback(() => setUnreadCount(0), [])

  const getEventsByType = useCallback(
    (type: EventType) => events.filter((e) => e.type === type),
    [events],
  )

  const getEventsByProject = useCallback(
    (projectId: number) => events.filter((e) => e.projectId === projectId),
    [events],
  )

  const txValue = useMemo<TxValue>(
    () => ({
      transactions,
      currentTx,
      addTransaction,
      updateTransaction,
      setCurrentTx,
      clearTransactions,
      getRecentTransactions,
    }),
    [
      transactions,
      currentTx,
      addTransaction,
      updateTransaction,
      getRecentTransactions,
    ],
  )

  const evValue = useMemo<EvValue>(
    () => ({
      events,
      unreadCount,
      addEvent,
      addEvents,
      clearEvents,
      markAllRead,
      getEventsByType,
      getEventsByProject,
    }),
    [
      events,
      unreadCount,
      addEvent,
      addEvents,
      clearEvents,
      markAllRead,
      getEventsByType,
      getEventsByProject,
    ],
  )

  return (
    <TX_Ctx.Provider value={txValue}>
      <EV_Ctx.Provider value={evValue}>{children}</EV_Ctx.Provider>
    </TX_Ctx.Provider>
  )
}

export function useTransactionStore<U>(
  selector: (state: TxValue) => U,
): U {
  const ctx = useContext(TX_Ctx)
  if (!ctx) throw new Error("Missing AppStoreProvider")
  return selector(ctx)
}

export function useEventStore<U>(selector: (state: EvValue) => U): U {
  const ctx = useContext(EV_Ctx)
  if (!ctx) throw new Error("Missing AppStoreProvider")
  return selector(ctx)
}
