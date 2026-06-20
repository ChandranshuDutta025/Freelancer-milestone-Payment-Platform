"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useWallet } from "@/hooks/useWallet"
import { useBalances } from "@/hooks/useBalances"
import { Copy, ExternalLink, LogOut, Wallet, Network, Coins } from "lucide-react"
import { EXPLORER_URL } from "@/lib/constants"
import { toast } from "sonner"

export function WalletDashboard() {
  const { address, isConnected, isConnecting, network, disconnect } = useWallet()
  const { balance, isLoading } = useBalances()

  if (isConnecting) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-blue-400" />
            Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
        </CardContent>
      </Card>
    )
  }

  if (!isConnected) {
    return (
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-blue-400" />
            Wallet
          </CardTitle>
          <CardDescription>Connect to manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Wallet className="h-7 w-7 text-blue-400 opacity-60" />
            </div>
            <p className="text-sm text-muted-foreground">No wallet connected</p>
            <p className="text-xs text-muted-foreground/60">Click &ldquo;Connect Wallet&rdquo; in the navbar to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  return (
    <Card className="glass-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base">
            <Wallet className="h-4 w-4 text-blue-400" />
            Wallet
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
            className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg text-xs"
          >
            <LogOut className="h-3 w-3" />
            Disconnect
          </Button>
        </CardTitle>
        <CardDescription>Connected wallet details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Network */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Network className="h-4 w-4" />
            <span>Network</span>
          </div>
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="pulse-dot" style={{ width: 6, height: 6 }} />
            {network}
          </span>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-accent/30 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" />
            <span>Balance</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span className="font-bold text-blue-400 font-mono">{balance} XLM</span>
          )}
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground px-1">Wallet Address</p>
          <div className="flex items-center gap-2 bg-accent/30 p-3 rounded-xl">
            <code className="text-xs break-all flex-1 text-muted-foreground font-mono leading-relaxed">{address}</code>
            <div className="flex flex-col gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg"
                onClick={copyAddress}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <a
                href={`${EXPLORER_URL}/account/${address}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
