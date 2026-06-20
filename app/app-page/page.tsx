"use client"

import { useState } from "react"
import { useWallet } from "@/hooks/useWallet"
import { useGetClientProjects, useGetFreelancerProjects } from "@/hooks/useContract"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { MilestoneTracker } from "@/components/projects/MilestoneTracker"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, ListChecks, Briefcase, User } from "lucide-react"
import type { Project } from "@/types"

export default function AppPage() {
  const { address, isConnected } = useWallet()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)

  const { data: clientProjectIds, isLoading: clientLoading } = useGetClientProjects()
  const { data: freelancerProjectIds, isLoading: freelancerLoading } = useGetFreelancerProjects()

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setProjectDialogOpen(true)
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ListChecks className="h-16 w-16 text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Connect a Stellar wallet to create and manage projects
          </p>
          <Button>
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your freelance projects and milestones</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="client" className="space-y-6">
        <TabsList>
          <TabsTrigger value="client" className="gap-2">
            <User className="h-4 w-4" />
            As Client
          </TabsTrigger>
          <TabsTrigger value="freelancer" className="gap-2">
            <Briefcase className="h-4 w-4" />
            As Freelancer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="client" className="space-y-4">
          {clientLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : clientProjectIds && clientProjectIds.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientProjectIds.map((id) => (
                <ProjectCard
                  key={id}
                  project={{ id, client: address ?? "", freelancer: null, title: `Project #${id}`, description: "", totalMilestones: 0, status: "Open", createdAt: 0, updatedAt: 0 }}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl">
              <User className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No projects as client yet</p>
              <Button variant="outline" className="mt-4 gap-2" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" />
                Create Your First Project
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="freelancer" className="space-y-4">
          {freelancerLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          ) : freelancerProjectIds && freelancerProjectIds.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {freelancerProjectIds.map((id) => (
                <ProjectCard
                  key={id}
                  project={{ id, client: "", freelancer: address ?? "", title: `Project #${id}`, description: "", totalMilestones: 0, status: "InProgress", createdAt: 0, updatedAt: 0 }}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-xl">
              <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-muted-foreground">No projects as freelancer yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Accept projects from clients to get started
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />

      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title ?? "Project Details"}</DialogTitle>
            <DialogDescription>
              {selectedProject?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedProject && <MilestoneTracker project={selectedProject} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
