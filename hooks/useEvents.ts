"use client"

import { useEventStore } from "@/store/eventStore"
import { useEffect, useRef, useCallback } from "react"
import { STELLAR_RPC_URL, CONTRACT_ID } from "@/lib/constants"
import { rpc } from "@stellar/stellar-sdk"
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

  const pollEvents = useCallback(async () => {
    if (!CONTRACT_ID) return

    try {
      const server = new rpc.Server(STELLAR_RPC_URL)
      const ledger = await server.getLatestLedger()
      const latestSeq = ledger.sequence

      if (latestSeq <= lastLedgerRef.current) return
      lastLedgerRef.current = latestSeq

      const eventsResponse = await server.getEvents({
        startLedger: Math.max(1, latestSeq - 10),
        filters: [
          {
            contractIds: [CONTRACT_ID],
            type: "contract",
          },
        ],
        limit: 50,
      })

      const newEvents: ContractEvent[] = []

      for (const event of eventsResponse.events) {
        const txHash = event.txHash
        const topicStr = event.topic?.[0]?.toString() ?? ""

        const parsed = parseEventFromTopics(topicStr, event)
        if (parsed) {
          newEvents.push({
            id: event.id,
            type: parsed.type,
            projectId: parsed.projectId,
            milestoneId: parsed.milestoneId,
            walletAddress: parsed.walletAddress,
            amount: parsed.amount,
            title: parsed.title,
            timestamp: Math.floor(Date.now() / 1000),
            txHash,
          })
        }
      }

      if (newEvents.length > 0) {
        addEvents(newEvents)
      }
    } catch {
      // Silently fail on poll errors
    }
  }, [addEvents])

  useEffect(() => {
    if (!autoPoll) return

    pollEvents()
    pollingRef.current = setInterval(pollEvents, POLL_INTERVAL)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
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

function parseEventFromTopics(
  topic: string,
  _raw: rpc.Api.EventResponse,
): {
  type: EventType
  projectId: number
  milestoneId?: number
  walletAddress: string
  amount?: number
  title?: string
} | null {
  const topicMap: Record<string, EventType> = {
    prj_cre: "project_created",
    prj_acc: "project_accepted",
    mls_fnd: "milestone_funded",
    mls_sub: "milestone_submitted",
    mls_app: "milestone_approved",
    pay_rel: "payment_released",
    prj_can: "project_cancelled",
  }

  const eventType = topicMap[topic]
  if (!eventType) return null

  return {
    type: eventType,
    projectId: 0,
    walletAddress: "",
  }
}
