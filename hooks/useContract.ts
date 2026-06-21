"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useWallet } from "./useWallet"
import { useTransactionStore } from "@/store/transactionStore"
import { useEventStore } from "@/store/eventStore"
import {
  STELLAR_RPC_URL,
  STELLAR_NETWORK_PASSPHRASE,
  CONTRACT_ID,
} from "@/lib/constants"
import {
  rpc,
  Contract,
  TransactionBuilder,
  BASE_FEE,
  nativeToScVal,
  scValToNative,
  xdr,
} from "@stellar/stellar-sdk"
import type { Project, Milestone, MilestoneInput } from "@/types"

const FALLBACK_SOURCE = "GBUBVSW6QMR2LYVE4NL34P5Q3RIXXMA2WTR3NOIFPPAHOTD4QJBAPD7P"

function getServer(): rpc.Server {
  return new rpc.Server(STELLAR_RPC_URL)
}

function getContract(): Contract {
  return new Contract(CONTRACT_ID)
}

function isSimSuccess(
  res: rpc.Api.SimulateTransactionResponse,
): res is rpc.Api.SimulateTransactionSuccessResponse {
  return rpc.Api.isSimulationSuccess(res)
}

async function getSourceAccount(server: rpc.Server, sourceKey: string) {
  try {
    return await server.getAccount(sourceKey)
  } catch {
    const fallback = await server.getAccount(FALLBACK_SOURCE)
    return fallback
  }
}

// --- Read Hooks ---

export function useGetProject(projectId: number | null) {
  const { address } = useWallet()

  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("No project ID")
      const server = getServer()
      const contract = getContract()
      const source = await getSourceAccount(server, address ?? FALLBACK_SOURCE)

      const res = await server.simulateTransaction(
        new TransactionBuilder(source, {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(
            contract.call(
              "get_project",
              nativeToScVal(projectId, { type: "u64" }),
            ),
          )
          .setTimeout(30)
          .build(),
      )

      if (!isSimSuccess(res) || !res.result) {
        throw new Error("Failed to get project")
      }
      return parseProject(res.result.retval)
    },
    enabled: !!projectId,
  })
}

export function useGetMilestone(
  projectId: number | null,
  milestoneId: number | null,
) {
  const { address } = useWallet()

  return useQuery({
    queryKey: ["milestone", projectId, milestoneId],
    queryFn: async () => {
      if (!projectId || !milestoneId) throw new Error("Missing IDs")
      const server = getServer()
      const contract = getContract()
      const source = await getSourceAccount(server, address ?? FALLBACK_SOURCE)

      const res = await server.simulateTransaction(
        new TransactionBuilder(source, {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(
            contract.call(
              "get_milestone",
              nativeToScVal(projectId, { type: "u64" }),
              nativeToScVal(milestoneId, { type: "u64" }),
            ),
          )
          .setTimeout(30)
          .build(),
      )

      if (!isSimSuccess(res) || !res.result) {
        throw new Error("Failed to get milestone")
      }
      return parseMilestone(res.result.retval)
    },
    enabled: !!projectId && !!milestoneId,
  })
}

export function useGetClientProjects() {
  const { address, isConnected } = useWallet()

  return useQuery({
    queryKey: ["clientProjects", address],
    queryFn: async () => {
      if (!address) return []
      const server = getServer()
      const contract = getContract()
      const source = await getSourceAccount(server, address)

      const res = await server.simulateTransaction(
        new TransactionBuilder(source, {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(
            contract.call(
              "get_client_projects",
              nativeToScVal(address, { type: "address" }),
            ),
          )
          .setTimeout(30)
          .build(),
      )

      if (!isSimSuccess(res) || !res.result) return []
      return scValToNative(res.result.retval) as number[]
    },
    enabled: isConnected && !!address,
  })
}

export function useGetFreelancerProjects() {
  const { address, isConnected } = useWallet()

  return useQuery({
    queryKey: ["freelancerProjects", address],
    queryFn: async () => {
      if (!address) return []
      const server = getServer()
      const contract = getContract()
      const source = await getSourceAccount(server, address)

      const res = await server.simulateTransaction(
        new TransactionBuilder(source, {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(
            contract.call(
              "get_freelancer_projects",
              nativeToScVal(address, { type: "address" }),
            ),
          )
          .setTimeout(30)
          .build(),
      )

      if (!isSimSuccess(res) || !res.result) return []
      return scValToNative(res.result.retval) as number[]
    },
    enabled: isConnected && !!address,
  })
}

export function useGetProjectMilestones(projectId: number | null) {
  const { address } = useWallet()

  return useQuery({
    queryKey: ["projectMilestones", projectId],
    queryFn: async () => {
      if (!projectId) return []
      const server = getServer()
      const contract = getContract()
      const source = await getSourceAccount(server, address ?? FALLBACK_SOURCE)

      const res = await server.simulateTransaction(
        new TransactionBuilder(source, {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(
            contract.call(
              "get_project_milestones",
              nativeToScVal(projectId, { type: "u64" }),
            ),
          )
          .setTimeout(30)
          .build(),
      )

      if (!isSimSuccess(res) || !res.result) return []
      const raw = scValToNative(res.result.retval) as any[]
      return raw.map(parseMilestone)
    },
    enabled: !!projectId,
  })
}

export function useGetProjectCount() {
  const { address } = useWallet()

  return useQuery({
    queryKey: ["projectCount"],
    queryFn: async () => {
      const server = getServer()
      const contract = getContract()
      const source = await getSourceAccount(server, address ?? FALLBACK_SOURCE)

      const res = await server.simulateTransaction(
        new TransactionBuilder(source, {
          fee: BASE_FEE,
          networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
        })
          .addOperation(contract.call("get_project_count"))
          .setTimeout(30)
          .build(),
      )

      if (!isSimSuccess(res) || !res.result) return 0
      return Number(scValToNative(res.result.retval))
    },
    refetchInterval: 15000,
  })
}

// --- Write Hooks (Mutations) ---

function useContractMutation<TData = unknown>(options: {
  contractFn: string
  buildArgs: (vars: TData) => xdr.ScVal[]
}) {
  const queryClient = useQueryClient()
  const { address, isConnected, setError, signTransaction } = useWallet()
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const updateTransaction = useTransactionStore((s) => s.updateTransaction)

  return useMutation({
    mutationFn: async (vars: TData) => {
      if (!isConnected || !address) throw new Error("Wallet not connected")

      const server = getServer()
      const contract = getContract()
      const source = await server.getAccount(address)
      const args = options.buildArgs(vars)

      const tx = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: STELLAR_NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(options.contractFn, ...args))
        .setTimeout(30)
        .build()

      const simulated = await server.simulateTransaction(tx)
      if (!isSimSuccess(simulated)) {
        const msg =
          simulated.error?.replace("HostError: ", "") ?? "Simulation failed"
        throw new Error(`Simulation failed: ${msg}`)
      }

      const txXdr = simulated.transactionData
        ? (rpc.assembleTransaction(tx, simulated) as any).build().toXDR()
        : (tx as any).toXDR()

      const signedXdr = await signTransaction(txXdr)

      const raw = await fetch(STELLAR_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: { transaction: signedXdr },
        }),
      })
      const sendJson: {
        result?: { status: string; hash: string; errorResult?: unknown }
        error?: { message: string }
      } = await raw.json()
      if (sendJson.error)
        throw new Error(sendJson.error.message)
      if (!sendJson.result?.hash)
        throw new Error("sendTransaction failed: missing hash")
      if (sendJson.result.status === "ERROR")
        throw new Error("sendTransaction returned ERROR")
      const txHash = sendJson.result.hash

      addTransaction({
        hash: txHash,
        status: "pending",
        type: options.contractFn,
        timestamp: Date.now(),
      })

      let attempts = 0
      while (attempts < 30) {
        await new Promise((r) => setTimeout(r, 1000))

        const raw = await fetch(STELLAR_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getTransaction",
            params: { hash: txHash },
          }),
        })
        const json: {
          result?: {
            status: string
            txHash: string
            envelopeXdr?: string
            resultXdr?: string
          }
          error?: { message: string }
        } = await raw.json()

        if (json.error) {
          attempts++
          continue
        }

        const txResult = json.result!
        if (txResult.status === "SUCCESS") {
          updateTransaction(txHash, { status: "success" })
          return { result: txResult, transactionHash: txHash }
        }
        if (txResult.status === "FAILED") {
          updateTransaction(txHash, { status: "failed" })
          throw new Error("Transaction failed on network")
        }
        attempts++
      }

      updateTransaction(txHash, { status: "failed", errorMessage: "Timeout" })
      throw new Error("Transaction timed out")
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
    onError: (err: Error) => {
      setError(err.message)
    },
  })
}

export function useCreateProject() {
  const addEvent = useEventStore((s) => s.addEvent)
  const { address } = useWallet()

  const mutation = useContractMutation<{
    title: string
    description: string
    milestones: MilestoneInput[]
    client: string
  }>({
    contractFn: "create_project",
    buildArgs: (vars) => [
      nativeToScVal(vars.client, { type: "address" }),
      nativeToScVal(vars.title, { type: "string" }),
      nativeToScVal(vars.description, { type: "string" }),
      xdr.ScVal.scvVec(
        vars.milestones.map((m) =>
          xdr.scvSortedMap([
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvSymbol("amount"),
              val: nativeToScVal(BigInt(Math.round(m.amount * 10_000_000)), { type: "i128" }),
            }),
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvSymbol("description"),
              val: nativeToScVal(m.description, { type: "string" }),
            }),
            new xdr.ScMapEntry({
              key: xdr.ScVal.scvSymbol("title"),
              val: nativeToScVal(m.title, { type: "string" }),
            }),
          ]),
        ),
      ),
    ],
  })

  return {
    ...mutation,
    mutateAsync: async (
      vars: {
        title: string
        description: string
        milestones: MilestoneInput[]
        client: string
      },
    ) => {
      const result = await mutation.mutateAsync(vars)
      addEvent({
        id: `evt-${Date.now()}`,
        type: "project_created",
        projectId: 0,
        walletAddress: address ?? "",
        title: vars.title,
        timestamp: Math.floor(Date.now() / 1000),
        txHash: result.transactionHash,
      })
      return result
    },
  }
}

export function useAcceptProject() {
  return useContractMutation<{
    projectId: number
    freelancer: string
  }>({
    contractFn: "accept_project",
    buildArgs: (vars) => [
      nativeToScVal(vars.projectId, { type: "u64" }),
      nativeToScVal(vars.freelancer, { type: "address" }),
    ],
  })
}

export function useDepositMilestone() {
  return useContractMutation<{
    client: string
    projectId: number
    milestoneId: number
  }>({
    contractFn: "deposit_milestone",
    buildArgs: (vars) => [
      nativeToScVal(vars.client, { type: "address" }),
      nativeToScVal(vars.projectId, { type: "u64" }),
      nativeToScVal(vars.milestoneId, { type: "u64" }),
    ],
  })
}

export function useSubmitMilestone() {
  return useContractMutation<{
    projectId: number
    milestoneId: number
    deliveryHash: string
  }>({
    contractFn: "submit_milestone",
    buildArgs: (vars) => [
      nativeToScVal(vars.projectId, { type: "u64" }),
      nativeToScVal(vars.milestoneId, { type: "u64" }),
      nativeToScVal(Buffer.from(vars.deliveryHash, "hex"), { type: "bytes" }),
    ],
  })
}

export function useApproveMilestone() {
  return useContractMutation<{
    projectId: number
    milestoneId: number
  }>({
    contractFn: "approve_milestone",
    buildArgs: (vars) => [
      nativeToScVal(vars.projectId, { type: "u64" }),
      nativeToScVal(vars.milestoneId, { type: "u64" }),
    ],
  })
}

export function useReleasePayment() {
  return useContractMutation<{
    projectId: number
    milestoneId: number
  }>({
    contractFn: "release_payment",
    buildArgs: (vars) => [
      nativeToScVal(vars.projectId, { type: "u64" }),
      nativeToScVal(vars.milestoneId, { type: "u64" }),
    ],
  })
}

export function useCancelProject() {
  return useContractMutation<{ projectId: number }>({
    contractFn: "cancel_project",
    buildArgs: (vars) => [
      nativeToScVal(vars.projectId, { type: "u64" }),
    ],
  })
}

export function useDeleteProject() {
  return useContractMutation<{ projectId: number; client: string }>({
    contractFn: "delete_project",
    buildArgs: (vars) => [
      nativeToScVal(vars.client, { type: "address" }),
      nativeToScVal(vars.projectId, { type: "u64" }),
    ],
  })
}

// --- Helper Parsers ---

function parseProject(val: xdr.ScVal): Project {
  const native = scValToNative(val) as Record<string, any>
  return {
    id: Number(native.id),
    client: String(native.client),
    freelancer: native.freelancer ? String(native.freelancer) : null,
    title: String(native.title),
    description: String(native.description),
    totalMilestones: Number(native.total_milestones),
    status: String(native.status) as Project["status"],
    createdAt: Number(native.created_at),
    updatedAt: Number(native.updated_at),
  }
}

function parseMilestone(val: xdr.ScVal): Milestone {
  const native = scValToNative(val) as Record<string, any>
  return {
    id: Number(native.id),
    projectId: Number(native.project_id),
    title: String(native.title),
    description: String(native.description),
    amount: Number(native.amount) / 10_000_000,
    status: String(native.status) as Milestone["status"],
    deliveryHash: native.delivery_hash ? String(native.delivery_hash) : null,
    createdAt: Number(native.created_at),
    updatedAt: Number(native.updated_at),
  }
}
