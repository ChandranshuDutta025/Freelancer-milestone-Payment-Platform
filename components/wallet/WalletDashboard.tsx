"use client"

import { motion } from "framer-motion"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Wallet className="h-4 w-4 text-blue-400" />
            Wallet
          </CardTitle>
          <CardDescription>Connect to manage your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="flex flex-col items-center justify-center py-8 gap-3 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <motion.div
              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
            >
              <Wallet className="h-7 w-7 text-blue-400 opacity-60" />
            </motion.div>
            <p className="text-sm text-muted-foreground">No wallet connected</p>
            <p className="text-xs text-muted-foreground/60">Click &ldquo;Connect Wallet&rdquo; in the navbar to get started</p>
          </motion.div>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base text-white">
            <Wallet className="h-4 w-4 text-blue-400" />
            Wallet
          </span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
              className="gap-1.5 border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl text-xs"
            >
              <LogOut className="h-3 w-3" />
              Disconnect
            </Button>
          </motion.div>
        </CardTitle>
        <CardDescription>Connected wallet details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {[
          {
            icon: Network,
            label: "Network",
            value: (
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {network}
              </span>
            ),
          },
          {
            icon: Coins,
            label: "Balance",
            value: isLoading
              ? <Skeleton className="h-4 w-24" />
              : <span className="font-bold text-blue-400 font-mono">{balance} XLM</span>,
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
            {item.value}
          </motion.div>
        ))}

        <motion.div
          className="space-y-1.5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-xs text-muted-foreground px-1">Wallet Address</p>
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] p-3 rounded-xl">
            <code className="text-xs break-all flex-1 text-muted-foreground font-mono leading-relaxed">{address}</code>
            <div className="flex flex-col gap-1 shrink-0">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg"
                  onClick={copyAddress}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <a href={`${EXPLORER_URL}/account/${address}`} target="_blank" rel="noreferrer">
                  <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-500/10 hover:text-blue-400 rounded-lg">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
