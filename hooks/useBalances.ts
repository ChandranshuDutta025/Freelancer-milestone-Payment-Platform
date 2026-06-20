"use client"

import { useQuery } from "@tanstack/react-query"
import { useWallet } from "./useWallet"
import { Horizon } from "@stellar/stellar-sdk"
import { STELLAR_RPC_URL } from "@/lib/constants"

const HORIZON_URL = "https://horizon-testnet.stellar.org"

export function useBalances() {
  const { address, isConnected } = useWallet()

  const { data: balance, isLoading } = useQuery({
    queryKey: ["balance", address],
    queryFn: async () => {
      if (!address) return "0"

      try {
        const server = new Horizon.Server(HORIZON_URL)
        const account = await server.loadAccount(address)
        const nativeBalance = account.balances.find(
          (b: any) => b.asset_type === "native",
        )
        return nativeBalance ? Number(nativeBalance.balance).toFixed(7) : "0"
      } catch {
        return "0"
      }
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000,
  })

  return {
    balance: balance ?? "0",
    isLoading,
  }
}
