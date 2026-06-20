"use client"

import { TransactionHistory } from "@/components/transactions/TransactionHistory"

export default function TransactionsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Recent contract interactions and their status</p>
      </div>

      <TransactionHistory />
    </div>
  )
}
