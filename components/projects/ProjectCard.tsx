"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, ListChecks, ArrowRight } from "lucide-react"
import { truncateAddress, formatTimestamp } from "@/lib/utils"
import type { Project } from "@/types"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Open: "default",
  InProgress: "secondary",
  Completed: "outline",
  Cancelled: "destructive",
}

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
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
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>Client: {truncateAddress(project.client)}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>
            Freelancer: {project.freelancer ? truncateAddress(project.freelancer) : "Not assigned"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <ListChecks className="h-3.5 w-3.5" />
          <span>{project.totalMilestones} milestone{project.totalMilestones !== 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatTimestamp(project.createdAt)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2"
          onClick={() => onViewDetails(project)}
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
