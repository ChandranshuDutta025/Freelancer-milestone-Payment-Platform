"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useGetProjectMilestones } from "@/hooks/useContract"
import { useDepositMilestone, useSubmitMilestone, useApproveMilestone, useReleasePayment } from "@/hooks/useContract"
import { useWallet } from "@/hooks/useWallet"
import { formatXlm } from "@/lib/utils"
import { Loader2, CheckCircle, Circle, DollarSign, ThumbsUp, Send } from "lucide-react"
import { toast } from "sonner"

import type { Milestone, Project } from "@/types"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" | "success" | "warning"; icon: React.ReactNode }> = {
  Pending: { label: "Pending", variant: "secondary", icon: <Circle className="h-3 w-3" /> },
  InProgress: { label: "Funded", variant: "warning", icon: <DollarSign className="h-3 w-3" /> },
  Submitted: { label: "Submitted", variant: "default", icon: <Send className="h-3 w-3" /> },
  Approved: { label: "Approved", variant: "default", icon: <ThumbsUp className="h-3 w-3" /> },
  Paid: { label: "Paid", variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
}

interface MilestoneTrackerProps {
  project: Project
}

export function MilestoneTracker({ project }: MilestoneTrackerProps) {
  const { address } = useWallet()
  const { data: milestones, isLoading } = useGetProjectMilestones(project.id)
  const depositMilestone = useDepositMilestone()
  const submitMilestone = useSubmitMilestone()
  const approveMilestone = useApproveMilestone()
  const releasePayment = useReleasePayment()

  const isClient = address?.toLowerCase() === project.client.toLowerCase()
  const isFreelancer = address?.toLowerCase() === project.freelancer?.toLowerCase()

  const handleDeposit = async (milestone: Milestone) => {
    try {
      await depositMilestone.mutateAsync({
        client: project.client,
        projectId: project.id,
        milestoneId: milestone.id,
      })
      toast.success(`Deposited ${formatXlm(milestone.amount)} XLM for milestone ${milestone.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Deposit failed")
    }
  }

  const handleSubmit = async (milestone: Milestone) => {
    try {
      await submitMilestone.mutateAsync({
        projectId: project.id,
        milestoneId: milestone.id,
        deliveryHash: "0".repeat(64),
      })
      toast.success(`Milestone ${milestone.id} submitted`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submit failed")
    }
  }

  const handleApprove = async (milestone: Milestone) => {
    try {
      await approveMilestone.mutateAsync({
        projectId: project.id,
        milestoneId: milestone.id,
      })
      toast.success(`Milestone ${milestone.id} approved`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Approval failed")
    }
  }

  const handleRelease = async (milestone: Milestone) => {
    try {
      await releasePayment.mutateAsync({
        projectId: project.id,
        milestoneId: milestone.id,
      })
      toast.success(`Payment released for milestone ${milestone.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Release failed")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Skeleton className="h-12 w-full rounded-xl" />
          </motion.div>
        ))}
      </div>
    )
  }

  if (!milestones || milestones.length === 0) {
    return <p className="text-sm text-muted-foreground">No milestones defined.</p>
  }

  const progress = milestones.filter((m) => m.status === "Paid").length
  const total = milestones.length
  const progressPct = total > 0 ? Math.round((progress / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <motion.span
            className="font-medium text-white"
            key={`${progress}-${total}`}
            initial={{ scale: 1.2, color: "hsl(210 100% 66%)" }}
            animate={{ scale: 1, color: "rgb(248 250 252)" }}
            transition={{ duration: 0.3 }}
          >
            {progress}/{total} paid ({progressPct}%)
          </motion.span>
        </div>
        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-primary rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${progressPct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {milestones.map((milestone, idx) => {
          const cfg = statusConfig[milestone.status] ?? statusConfig.Pending
          const isPending = depositMilestone.isPending || submitMilestone.isPending ||
            approveMilestone.isPending || releasePayment.isPending

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
            >
              <AccordionItem value={`m-${milestone.id}`} className="border-white/[0.06]">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <Badge variant={cfg.variant} className="gap-1">
                      {cfg.icon}
                      {cfg.label}
                    </Badge>
                    <span className="text-sm font-medium text-white">{milestone.title}</span>
                    <span className="text-sm text-muted-foreground ml-auto">{formatXlm(milestone.amount)} XLM</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>

                  <motion.div
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {milestone.status === "Pending" && isClient && (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button size="sm" variant="gradient" onClick={() => handleDeposit(milestone)} disabled={isPending} className="gap-1">
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <DollarSign className="h-3 w-3" />}
                          Deposit {formatXlm(milestone.amount)} XLM
                        </Button>
                      </motion.div>
                    )}

                    {milestone.status === "InProgress" && isFreelancer && (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button size="sm" variant="gradient" onClick={() => handleSubmit(milestone)} disabled={isPending} className="gap-1">
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          Submit Work
                        </Button>
                      </motion.div>
                    )}

                    {milestone.status === "Submitted" && isClient && (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button size="sm" variant="gradient" onClick={() => handleApprove(milestone)} disabled={isPending} className="gap-1">
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                          Approve
                        </Button>
                      </motion.div>
                    )}

                    {milestone.status === "Approved" && (
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button size="sm" variant="gradient" onClick={() => handleRelease(milestone)} disabled={isPending} className="gap-1">
                          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <DollarSign className="h-3 w-3" />}
                          Release Payment
                        </Button>
                      </motion.div>
                    )}

                    {milestone.status === "Paid" && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Badge variant="success" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Payment Released
                        </Badge>
                      </motion.div>
                    )}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          )
        })}
      </Accordion>
    </div>
  )
}
