"use client"

import { motion } from "framer-motion"
import { TransactionHistory } from "@/components/transactions/TransactionHistory"
import { FadeUp } from "@/components/ui/motion"

export default function TransactionsPage() {
  return (
    <motion.div
      className="container mx-auto px-4 md:px-6 py-8 space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <FadeUp className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">Recent contract interactions and their status</p>
      </FadeUp>

      <TransactionHistory />
    </motion.div>
  )
}
