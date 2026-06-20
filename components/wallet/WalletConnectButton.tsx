"use client"

import { Wallet, Loader2, ChevronDown, LogOut, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWallet } from "@/hooks/useWallet"
import { truncateAddress } from "@/lib/utils"
import { WalletModal } from "./WalletModal"
import { useState } from "react"
import { toast } from "sonner"

export function WalletConnectButton() {
  const { address, isConnected, isConnecting, disconnect } = useWallet()
  const [modalOpen, setModalOpen] = useState(false)

  if (isConnecting) {
    return (
      <Button disabled variant="outline" size="sm" className="gap-2 rounded-xl border-blue-500/30">
        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
        Connecting...
      </Button>
    )
  }

  if (isConnected && address) {
    const copyAddress = () => {
      navigator.clipboard.writeText(address)
      toast.success("Address copied!")
    }
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 transition-all"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <Wallet className="h-3.5 w-3.5" />
            {truncateAddress(address)}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card border-border/60 w-52">
          <DropdownMenuItem className="text-xs text-muted-foreground font-mono cursor-default" disabled>
            {address.slice(0, 16)}...{address.slice(-8)}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress} className="gap-2 cursor-pointer">
            <Copy className="h-3.5 w-3.5" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`https://stellar.expert/explorer/testnet/account/${address}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View on Explorer
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect} className="text-destructive gap-2 cursor-pointer focus:text-destructive">
            <LogOut className="h-3.5 w-3.5" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        size="sm"
        className="gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-medium transition-all hover:scale-105"
      >
        <Wallet className="h-3.5 w-3.5" />
        Connect Wallet
      </Button>
      <WalletModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
