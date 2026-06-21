"use client"

import { useEffect, useRef } from "react"
import { useTransactionStore } from "@/store/transactionStore"
import { EXPLORER_URL, STELLAR_RPC_URL } from "@/lib/constants"

const POLL_INTERVAL = 8000

export function useTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const currentTx = useTransactionStore((s) => s.currentTx)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)
  const setCurrentTx = useTransactionStore((s) => s.setCurrentTx)
  const clearTransactions = useTransactionStore((s) => s.clearTransactions)
  const getRecentTransactions = useTransactionStore((s) => s.getRecentTransactions)

  const pendingRef = useRef<Set<string>>(new Set())
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    pendingRef.current = new Set(
      transactions.filter((t) => t.status === "pending").map((t) => t.hash),
    )
  }, [transactions])

  useEffect(() => {
    async function pollPending() {
      const hashes = [...pendingRef.current]
      if (hashes.length === 0) return

      for (const hash of hashes) {
        try {
          const raw = await fetch(STELLAR_RPC_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0", id: 1, method: "getTransaction",
              params: { hash },
            }),
          })
          const data = await raw.json()
          const status = data?.result?.status

          if (status === "SUCCESS") {
            updateTransaction(hash, { status: "success" })
            pendingRef.current.delete(hash)
          } else if (status === "FAILED") {
            updateTransaction(hash, {
              status: "failed",
              errorMessage: data?.result?.resultXdr ?? "Transaction failed",
            })
            pendingRef.current.delete(hash)
          }
        } catch {
          // network error, retry next poll
        }
      }
    }

    pollingRef.current = setInterval(pollPending, POLL_INTERVAL)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [updateTransaction])

  const getExplorerUrl = (hash: string) => `${EXPLORER_URL}/tx/${hash}`

  return {
    transactions,
    currentTx,
    addTransaction,
    updateTransaction,
    setCurrentTx,
    clearTransactions,
    getRecentTransactions,
    getExplorerUrl,
  }
}
