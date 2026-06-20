"use client"

import { ActivityFeed } from "@/components/activity/ActivityFeed"

export default function ActivityPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
        <p className="text-muted-foreground">Real-time contract events and platform activity</p>
      </div>

      <ActivityFeed />
    </div>
  )
}
