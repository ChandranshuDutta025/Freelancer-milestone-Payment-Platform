"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ListChecks, ArrowRight } from "lucide-react"
import { truncateAddress, formatTimestamp } from "@/lib/utils"
import type { Project } from "@/types"
import { HoverCard } from "@/components/ui/motion"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Open: "default",
  InProgress: "secondary",
  Completed: "outline",
  Cancelled: "destructive",
}

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  onDelete?: (project: Project) => void
}

export function ProjectCard({ project, onViewDetails, onDelete }: ProjectCardProps) {
  return (
    <HoverCard>
      <Card className="transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
            </div>
            <Badge variant={statusColors[project.status] ?? "outline"}>{project.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3 space-y-2 text-sm">
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
          >
            <User className="h-3.5 w-3.5" />
            <span>Client: {truncateAddress(project.client)}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <User className="h-3.5 w-3.5" />
            <span>
              Freelancer: {project.freelancer ? truncateAddress(project.freelancer) : "Not assigned"}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <ListChecks className="h-3.5 w-3.5" />
            <span>{project.totalMilestones} milestone{project.totalMilestones !== 1 ? "s" : ""}</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-2 text-muted-foreground"
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatTimestamp(project.createdAt)}</span>
          </motion.div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="w-full gap-2"
              onClick={() => onViewDetails(project)}
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          {onDelete && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                onClick={() => onDelete(project)}
              >
                Delete
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </HoverCard>
  )
}
