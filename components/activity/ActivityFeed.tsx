"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useEvents } from "@/hooks/useEvents"
import { truncateAddress, formatTimestamp } from "@/lib/utils"
import {
  Activity,
  UserPlus,
  FileCheck,
  DollarSign,
  Send,
  ThumbsUp,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react"
import { useState } from "react"
import type { EventType } from "@/types"

const eventConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  project_created: { label: "Project Created", icon: <FileCheck className="h-4 w-4" />, color: "text-blue-500" },
  project_accepted: { label: "Project Accepted", icon: <UserPlus className="h-4 w-4" />, color: "text-green-500" },
  milestone_funded: { label: "Milestone Funded", icon: <DollarSign className="h-4 w-4" />, color: "text-yellow-500" },
  milestone_submitted: { label: "Milestone Submitted", icon: <Send className="h-4 w-4" />, color: "text-purple-500" },
  milestone_approved: { label: "Milestone Approved", icon: <ThumbsUp className="h-4 w-4" />, color: "text-green-500" },
  payment_released: { label: "Payment Released", icon: <CheckCircle className="h-4 w-4" />, color: "text-emerald-500" },
  project_cancelled: { label: "Project Cancelled", icon: <XCircle className="h-4 w-4" />, color: "text-red-500" },
}

const eventTypes: EventType[] = [
  "project_created",
  "project_accepted",
  "milestone_funded",
  "milestone_submitted",
  "milestone_approved",
  "payment_released",
  "project_cancelled",
]

export function ActivityFeed() {
  const { events, unreadCount, markAllRead } = useEvents()
  const [filter, setFilter] = useState<EventType | "all">("all")

  const filtered = filter === "all" ? events : events.filter((e) => e.type === filter)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Feed
            {unreadCount > 0 && (
              <Badge variant="default" className="ml-2">
                {unreadCount} new
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-1 flex-wrap pt-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="gap-1"
          >
            <Filter className="h-3 w-3" />
            All
          </Button>
          {eventTypes.map((type) => (
            <Button
              key={type}
              variant={filter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(type)}
            >
              {eventConfig[type]?.label ?? type}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">No activity yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Contract interactions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((event) => {
              const cfg = eventConfig[event.type]
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`mt-0.5 ${cfg?.color ?? ""}`}>{cfg?.icon ?? <Activity className="h-4 w-4" />}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{cfg?.label ?? event.type}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Project #{event.projectId}
                      {event.milestoneId ? `, Milestone #${event.milestoneId}` : ""}
                      {" · "}
                      {truncateAddress(event.walletAddress)}
                      {event.amount ? ` · ${event.amount} XLM` : ""}
                    </p>
                  </div>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${event.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary shrink-0"
                  >
                    View
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
