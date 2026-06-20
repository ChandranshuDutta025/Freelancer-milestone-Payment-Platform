"use client"

import { useWalletStore } from "@/store/walletStore"
import { useEffect } from "react"

export function useWallet() {
  const initialize = useWalletStore((s) => s.initialize)
  const address = useWalletStore((s) => s.address)
  const publicKey = useWalletStore((s) => s.publicKey)
  const isConnected = useWalletStore((s) => s.isConnected)
  const isConnecting = useWalletStore((s) => s.isConnecting)
  const network = useWalletStore((s) => s.network)
  const balance = useWalletStore((s) => s.balance)
  const error = useWalletStore((s) => s.error)
  const wallets = useWalletStore((s) => s.wallets)
  const selectedWalletId = useWalletStore((s) => s.selectedWalletId)
  const connect = useWalletStore((s) => s.connect)
  const disconnect = useWalletStore((s) => s.disconnect)
  const setBalance = useWalletStore((s) => s.setBalance)
  const setError = useWalletStore((s) => s.setError)
  const getAddress = useWalletStore((s) => s.getAddress)

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    address,
    publicKey,
    isConnected,
    isConnecting,
    network,
    balance,
    error,
    wallets,
    selectedWalletId,
    connect,
    disconnect,
    setBalance,
    setError,
    getAddress,
  }
}
