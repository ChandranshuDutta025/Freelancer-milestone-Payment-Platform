"use client"

import { motion } from "framer-motion"
import { ActivityFeed } from "@/components/activity/ActivityFeed"
import { FadeUp } from "@/components/ui/motion"

export default function ActivityPage() {
  return (
    <motion.div
      className="min-h-screen bg-[#030712]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 space-y-6">
        <FadeUp className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-white">Activity</h1>
          <p className="text-muted-foreground">Real-time contract events and platform activity</p>
        </FadeUp>

        <ActivityFeed />
      </div>
    </motion.div>
  )
}
