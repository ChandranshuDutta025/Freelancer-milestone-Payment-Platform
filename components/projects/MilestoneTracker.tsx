"use client"

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

const statusConfig: Record<string, { label: string; color: "default" | "secondary" | "outline" | "destructive"; icon: React.ReactNode }> = {
  Pending: { label: "Pending", color: "outline", icon: <Circle className="h-3 w-3" /> },
  InProgress: { label: "Funded", color: "secondary", icon: <DollarSign className="h-3 w-3" /> },
  Submitted: { label: "Submitted", color: "default", icon: <Send className="h-3 w-3" /> },
  Approved: { label: "Approved", color: "default", icon: <ThumbsUp className="h-3 w-3" /> },
  Paid: { label: "Paid", color: "outline", icon: <CheckCircle className="h-3 w-3 text-green-500" /> },
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
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
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
          <span className="font-medium">{progress}/{total} paid ({progressPct}%)</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {milestones.map((milestone) => {
          const cfg = statusConfig[milestone.status] ?? statusConfig.Pending
          const isPending = depositMilestone.isPending || submitMilestone.isPending ||
            approveMilestone.isPending || releasePayment.isPending

          return (
            <AccordionItem key={milestone.id} value={`m-${milestone.id}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1">
                  <Badge variant={cfg.color} className="gap-1">
                    {cfg.icon}
                    {cfg.label}
                  </Badge>
                  <span className="text-sm font-medium">{milestone.title}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{formatXlm(milestone.amount)} XLM</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{milestone.description}</p>

                <div className="flex flex-wrap gap-2">
                  {milestone.status === "Pending" && isClient && (
                    <Button size="sm" onClick={() => handleDeposit(milestone)} disabled={isPending} className="gap-1">
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <DollarSign className="h-3 w-3" />}
                      Deposit {formatXlm(milestone.amount)} XLM
                    </Button>
                  )}

                  {milestone.status === "InProgress" && isFreelancer && (
                    <Button size="sm" onClick={() => handleSubmit(milestone)} disabled={isPending} className="gap-1">
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                      Submit Work
                    </Button>
                  )}

                  {milestone.status === "Submitted" && isClient && (
                    <>
                      <Button size="sm" onClick={() => handleApprove(milestone)} disabled={isPending} className="gap-1">
                        {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <ThumbsUp className="h-3 w-3" />}
                        Approve
                      </Button>
                    </>
                  )}

                  {milestone.status === "Approved" && (
                    <Button size="sm" onClick={() => handleRelease(milestone)} disabled={isPending} className="gap-1">
                      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <DollarSign className="h-3 w-3" />}
                      Release Payment
                    </Button>
                  )}

                  {milestone.status === "Paid" && (
                    <Badge variant="outline" className="gap-1 text-green-500">
                      <CheckCircle className="h-3 w-3" />
                      Payment Released
                    </Badge>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
