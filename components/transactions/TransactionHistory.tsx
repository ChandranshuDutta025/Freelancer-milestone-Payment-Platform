"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTransactions } from "@/hooks/useTransactions"
import { formatTimestamp, truncateAddress } from "@/lib/utils"
import { History, ExternalLink, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react"

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: "default" | "secondary" | "destructive" | "outline" }> = {
  idle: { label: "Idle", icon: <Clock className="h-3 w-3" />, color: "outline" },
  pending: { label: "Pending", icon: <Loader2 className="h-3 w-3 animate-spin" />, color: "secondary" },
  success: { label: "Success", icon: <CheckCircle className="h-3 w-3" />, color: "default" },
  failed: { label: "Failed", icon: <XCircle className="h-3 w-3" />, color: "destructive" },
}

export function TransactionHistory() {
  const { transactions, getExplorerUrl } = useTransactions()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Contract interactions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const cfg = statusConfig[tx.status] ?? statusConfig.idle
              return (
                <div
                  key={tx.hash}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Badge variant={cfg.color} className="gap-1 shrink-0">
                    {cfg.icon}
                    {cfg.label}
                  </Badge>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <code className="text-xs font-mono">{truncateAddress(tx.hash, 8)}</code>
                      <span className="text-xs text-muted-foreground">{tx.type}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatTimestamp(tx.timestamp)}
                      {tx.projectId ? ` · Project #${tx.projectId}` : ""}
                      {tx.milestoneId ? ` · Milestone #${tx.milestoneId}` : ""}
                    </p>
                    {tx.errorMessage && (
                      <p className="text-xs text-destructive mt-1">{tx.errorMessage}</p>
                    )}
                  </div>

                  <a
                    href={getExplorerUrl(tx.hash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
