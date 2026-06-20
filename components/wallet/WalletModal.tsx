"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/useWallet"
import { Wallet, ExternalLink, AlertCircle } from "lucide-react"
import { useState } from "react"

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
      // Error is handled by store
    } finally {
      setConnecting(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a Stellar wallet to connect with
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          {wallets.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-4 border rounded-lg">
              <AlertCircle className="h-4 w-4" />
              No wallets detected. Please install a Stellar wallet extension.
            </div>
          ) : (
            wallets.map((wallet) => {
              const id = wallet.id?.toLowerCase() ?? ""
              const isConnecting = connecting === id
              return (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="w-full justify-start gap-3 h-14"
                  onClick={() => handleConnect(id)}
                  disabled={isConnecting}
                >
                  <span className="text-xl">{walletIcons[id] ?? "💳"}</span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {walletNames[id] ?? wallet.name ?? "Unknown Wallet"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {isConnecting ? "Connecting..." : "Connect via browser extension"}
                    </span>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                </Button>
              )
            })
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
