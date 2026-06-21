"use client"

import { motion, AnimatePresence } from "framer-motion"
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

  return (
    <AnimatePresence mode="wait">
      {isConnecting ? (
        <motion.div
          key="connecting"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button disabled variant="outline" size="sm" className="gap-2 rounded-xl border-blue-500/30">
            <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
            Connecting...
          </Button>
        </motion.div>
      ) : isConnected && address ? (
        <motion.div
          key="connected"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 rounded-xl border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 text-blue-300 hover:text-blue-200 transition-all duration-200"
              >
                <motion.div
                  className="h-2 w-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Wallet className="h-3.5 w-3.5" />
                {truncateAddress(address)}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem className="text-xs text-muted-foreground font-mono cursor-default" disabled>
                {address.slice(0, 16)}...{address.slice(-8)}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(address); toast.success("Address copied!") }} className="gap-2 cursor-pointer">
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
              <DropdownMenuItem onClick={disconnect} className="text-red-400 gap-2 cursor-pointer focus:text-red-400">
                <LogOut className="h-3.5 w-3.5" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      ) : (
        <motion.div
          key="disconnected"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setModalOpen(true)}
              size="sm"
              variant="gradient"
              className="gap-2"
            >
              <Wallet className="h-3.5 w-3.5" />
              Connect Wallet
            </Button>
          </motion.div>
          <WalletModal open={modalOpen} onOpenChange={setModalOpen} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
