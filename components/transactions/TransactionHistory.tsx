"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTransactions } from "@/hooks/useTransactions"
import { formatTimestamp, truncateAddress } from "@/lib/utils"
import { History, ExternalLink, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

const statusConfig: Record<string, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  idle: { label: "Idle", icon: <Clock className="h-3 w-3" />, variant: "secondary" },
  pending: { label: "Pending", icon: <Loader2 className="h-3 w-3 animate-spin" />, variant: "warning" },
  success: { label: "Success", icon: <CheckCircle className="h-3 w-3" />, variant: "success" },
  failed: { label: "Failed", icon: <XCircle className="h-3 w-3" />, variant: "destructive" },
}

export function TransactionHistory() {
  const { transactions, getExplorerUrl } = useTransactions()
  console.log("[TransactionHistory] render, transactions.length:", transactions.length)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <History className="h-5 w-5 text-blue-400" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <History className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Contract interactions will appear here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const cfg = statusConfig[tx.status] ?? statusConfig.idle
              return (
                <motion.div
                  key={tx.hash}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <Badge variant={cfg.variant} className="gap-1 shrink-0">
                    {cfg.icon}
                    {cfg.label}
                  </Badge>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs font-mono text-white/70">{truncateAddress(tx.hash, 8)}</code>
                      <span className="text-xs text-muted-foreground">{tx.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimestamp(tx.timestamp)}
                      {tx.projectId ? ` · Project #${tx.projectId}` : ""}
                      {tx.milestoneId ? ` · Milestone #${tx.milestoneId}` : ""}
                    </p>
                    {tx.errorMessage && (
                      <p className="text-xs text-red-400 mt-1">
                        {tx.errorMessage}
                      </p>
                    )}
                  </div>

                  <a
                    href={getExplorerUrl(tx.hash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
