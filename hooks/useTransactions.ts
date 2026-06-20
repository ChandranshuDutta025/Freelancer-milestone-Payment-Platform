"use client"

import { useTransactionStore } from "@/store/transactionStore"
import { EXPLORER_URL } from "@/lib/constants"

export function useTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const currentTx = useTransactionStore((s) => s.currentTx)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)
  const setCurrentTx = useTransactionStore((s) => s.setCurrentTx)
  const clearTransactions = useTransactionStore((s) => s.clearTransactions)
  const getRecentTransactions = useTransactionStore((s) => s.getRecentTransactions)

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
