"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/hooks/useWallet"
import { useGetClientProjects, useGetFreelancerProjects, useDeleteProject } from "@/hooks/useContract"
import { ProjectCard } from "@/components/projects/ProjectCard"
import { CreateProjectModal } from "@/components/projects/CreateProjectModal"
import { MilestoneTracker } from "@/components/projects/MilestoneTracker"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Plus, ListChecks, Briefcase, User } from "lucide-react"
import { StaggerContainer, StaggerItem, FadeUp } from "@/components/ui/motion"
import type { Project } from "@/types"

export default function AppPage() {
  const { address, isConnected } = useWallet()
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectDialogOpen, setProjectDialogOpen] = useState(false)

  const { data: clientProjectIds, isLoading: clientLoading } = useGetClientProjects()
  const { data: freelancerProjectIds, isLoading: freelancerLoading } = useGetFreelancerProjects()
  const deleteMutation = useDeleteProject()

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project)
    setProjectDialogOpen(true)
  }

  const handleDelete = async (project: Project) => {
    if (!address || project.client !== address) return
    if (!window.confirm(`Delete project #${project.id}? This cannot be undone.`)) return
    deleteMutation.mutate({ projectId: project.id, client: address })
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          className="flex flex-col items-center justify-center py-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            <ListChecks className="h-16 w-16 text-muted-foreground/40 mb-4" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-6">
            Connect a Stellar wallet to create and manage projects
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button>Connect Wallet</Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
        <FadeUp className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">Projects</h1>
            <p className="text-muted-foreground">Manage your freelance projects and milestones</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button variant="gradient" onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </motion.div>
        </FadeUp>

        <Tabs defaultValue="client" className="space-y-6">
          <FadeUp>
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
          </FadeUp>

          <TabsContent value="client" className="space-y-4">
            {clientLoading ? (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <StaggerItem key={i}>
                    <Skeleton className="h-48 w-full rounded-2xl" />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : clientProjectIds && clientProjectIds.length > 0 ? (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientProjectIds.map((id) => (
                  <StaggerItem key={id}>
                    <ProjectCard
                      project={{ id, client: address ?? "", freelancer: null, title: `Project #${id}`, description: "", totalMilestones: 0, status: "Open", createdAt: 0, updatedAt: 0 }}
                      onViewDetails={handleViewDetails}
                      onDelete={handleDelete}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <motion.div
                className="text-center py-12 rounded-2xl glass-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <User className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No projects as client yet</p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" className="mt-4 gap-2" onClick={() => setCreateOpen(true)}>
                    <Plus className="h-4 w-4" />
                    Create Your First Project
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="freelancer" className="space-y-4">
            {freelancerLoading ? (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <StaggerItem key={i}>
                    <Skeleton className="h-48 w-full rounded-2xl" />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : freelancerProjectIds && freelancerProjectIds.length > 0 ? (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {freelancerProjectIds.map((id) => (
                  <StaggerItem key={id}>
                    <ProjectCard
                      project={{ id, client: "", freelancer: address ?? "", title: `Project #${id}`, description: "", totalMilestones: 0, status: "InProgress", createdAt: 0, updatedAt: 0 }}
                      onViewDetails={handleViewDetails}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <motion.div
                className="text-center py-12 rounded-2xl glass-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Briefcase className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No projects as freelancer yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Accept projects from clients to get started
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>

        <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />

        <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedProject?.title ?? "Project Details"}</DialogTitle>
              <DialogDescription>
                {selectedProject?.description}
              </DialogDescription>
            </DialogHeader>
            {selectedProject && <MilestoneTracker project={selectedProject} />}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
