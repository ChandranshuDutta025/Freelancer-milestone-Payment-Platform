"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/useWallet"
import { Wallet, ExternalLink, AlertCircle } from "lucide-react"
import { useState } from "react"
import { StaggerContainer, StaggerItemFast } from "@/components/ui/motion"

const walletIcons: Record<string, string> = {
  freighter: "🔵",
  xbull: "🔴",
  albedo: "🟢",
  lobstr: "🟠",
  rabet: "🟣",
  hana: "🟡",
}

const walletNames: Record<string, string> = {
  freighter: "Freighter",
  xbull: "xBull",
  albedo: "Albedo",
  lobstr: "LOBSTR",
  rabet: "Rabet",
  hana: "Hana",
}

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletModal({ open, onOpenChange }: WalletModalProps) {
  const { wallets, connect, error, setError } = useWallet()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId)
    setError(null)
    try {
      await connect()
      onOpenChange(false)
    } catch {
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-blue-400" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a Stellar wallet to connect with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {wallets.length === 0 ? (
            <motion.div
              className="flex items-center gap-2 text-sm text-muted-foreground p-4 rounded-xl border border-white/10 bg-white/[0.04]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <AlertCircle className="h-4 w-4" />
              No wallets detected. Please install a Stellar wallet extension.
            </motion.div>
          ) : (
            <StaggerContainer className="space-y-2">
              {wallets.map((wallet) => {
                const id = wallet.id?.toLowerCase() ?? ""
                const isConnecting = connecting === id
                return (
                  <StaggerItemFast key={wallet.id}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 h-14 border-white/10 hover:border-blue-400/30 hover:bg-blue-500/10"
                        onClick={() => handleConnect(id)}
                        disabled={isConnecting}
                      >
                        <motion.span
                          className="text-xl"
                          animate={isConnecting ? { rotate: [0, 360] } : {}}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          {walletIcons[id] ?? "💳"}
                        </motion.span>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-white">
                            {walletNames[id] ?? wallet.name ?? "Unknown Wallet"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {isConnecting ? "Connecting..." : "Connect via browser extension"}
                          </span>
                        </div>
                        <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                      </Button>
                    </motion.div>
                  </StaggerItemFast>
                )
              })}
            </StaggerContainer>
          )}

          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-xl"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
