"use client"

import { useEventStore } from "@/store/eventStore"
import { useEffect, useRef, useCallback } from "react"
import { xdr, scValToNative } from "@stellar/stellar-sdk"
import { STELLAR_RPC_URL, CONTRACT_ID } from "@/lib/constants"
import type { ContractEvent, EventType } from "@/types"

const POLL_INTERVAL = 10000

export function useEvents(autoPoll = true) {
  const events = useEventStore((s) => s.events)
  const unreadCount = useEventStore((s) => s.unreadCount)
  const addEvent = useEventStore((s) => s.addEvent)
  const addEvents = useEventStore((s) => s.addEvents)
  const clearEvents = useEventStore((s) => s.clearEvents)
  const markAllRead = useEventStore((s) => s.markAllRead)
  const getEventsByType = useEventStore((s) => s.getEventsByType)
  const getEventsByProject = useEventStore((s) => s.getEventsByProject)

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastLedgerRef = useRef<number>(0)
  const seenIdsRef = useRef<Set<string>>(new Set())

  const rpc = useCallback(async (method: string, params: unknown) => {
    const raw = await fetch(STELLAR_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    })
    const data = await raw.json()
    if (data.error) throw new Error(JSON.stringify(data.error))
    return data.result
  }, [])

  const pollEvents = useCallback(async () => {
    if (!CONTRACT_ID) return

    try {
      const ledger = await rpc("getLatestLedger", {})
      const latestSeq = ledger.sequence

      if (latestSeq <= lastLedgerRef.current) return
      const fromLedger = Math.max(1, lastLedgerRef.current || (latestSeq - 5000))
      lastLedgerRef.current = latestSeq

      const eventsResponse = await rpc("getEvents", {
        startLedger: fromLedger,
        filters: [{ contractIds: [CONTRACT_ID], type: "contract" }],
        limit: 100,
      })

      const newEvents: ContractEvent[] = []

      for (const event of eventsResponse.events ?? []) {
        if (seenIdsRef.current.has(event.id)) continue
        seenIdsRef.current.add(event.id)

        const parsed = parseSorobanEvent(event)
        if (parsed) {
          newEvents.push({
            id: event.id,
            type: parsed.type,
            projectId: parsed.projectId,
            milestoneId: parsed.milestoneId,
            walletAddress: parsed.walletAddress,
            amount: parsed.amount,
            title: parsed.title,
            timestamp: event.ledgerClosedAt
              ? Math.floor(new Date(event.ledgerClosedAt).getTime() / 1000)
              : Math.floor(Date.now() / 1000),
            txHash: event.txHash,
          })
        }
      }

      if (newEvents.length > 0) {
        addEvents(newEvents)
      }
    } catch {
      // silent
    }
  }, [rpc, addEvents])

  useEffect(() => {
    if (!autoPoll) return
    pollEvents()
    pollingRef.current = setInterval(pollEvents, POLL_INTERVAL)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [autoPoll, pollEvents])

  return {
    events,
    unreadCount,
    addEvent,
    addEvents,
    clearEvents,
    markAllRead,
    getEventsByType,
    getEventsByProject,
  }
}

const EVENT_TOPIC_PREFIXES: Record<string, EventType> = {
  prj_cre: "project_created",
  prj_acc: "project_accepted",
  mls_fnd: "milestone_funded",
  mls_sub: "milestone_submitted",
  mls_app: "milestone_approved",
  pay_rel: "payment_released",
  prj_can: "project_cancelled",
}

interface ParsedEvent {
  type: EventType
  projectId: number
  milestoneId?: number
  walletAddress: string
  amount?: number
  title?: string
}

/** Decode a base64-encoded ScVal topic into a native JS value. */
function decodeTopic(b64: string): unknown {
  return scValToNative(xdr.ScVal.fromXDR(Buffer.from(b64, "base64")))
}

function parseSorobanEvent(event: Record<string, unknown>): ParsedEvent | null {
  const rawTopics = event.topic as string[] | undefined
  if (!rawTopics || rawTopics.length < 2) return null

  try {
    const topic0 = String(decodeTopic(rawTopics[0]))
    const eventType = EVENT_TOPIC_PREFIXES[topic0]
    if (!eventType) return null

    let projectId = 0
    let walletAddress = ""
    let milestoneId: number | undefined
    let amount: number | undefined
    let title: string | undefined

    // topic[1] — first data field
    const t1 = decodeTopic(rawTopics[1])
    const t1s = String(t1)
    if (t1s.startsWith("G") || t1s.startsWith("C")) {
      walletAddress = t1s
    } else {
      projectId = Number(t1)
    }

    // topic[2] — second data field
    if (rawTopics.length >= 3) {
      const t2 = decodeTopic(rawTopics[2])
      const t2s = String(t2)
      if (t2s.startsWith("G") || t2s.startsWith("C")) {
        if (!walletAddress) walletAddress = t2s
      } else if (typeof t2 === "string") {
        title = t2s
      } else {
        milestoneId = Number(t2)
      }
    }

    // topic[3] — third data field (if present)
    if (rawTopics.length >= 4) {
      const t3 = decodeTopic(rawTopics[3])
      const t3s = String(t3)
      if (!walletAddress && (t3s.startsWith("G") || t3s.startsWith("C"))) {
        walletAddress = t3s
      } else if (typeof t3 !== "string") {
        milestoneId = Number(t3)
      }
    }

    // event value — usually the return value (project_id / milestone_id)
    if (event.value && typeof event.value === "string") {
      const val = decodeTopic(event.value)
      const vn = Number(val)
      if (Number.isFinite(vn)) {
        if (!projectId) projectId = vn
        else if (!milestoneId) milestoneId = vn
      }
    }

    return {
      type: eventType,
      projectId,
      milestoneId,
      walletAddress,
      amount,
      title,
    }
  } catch {
    return null
  }
}
