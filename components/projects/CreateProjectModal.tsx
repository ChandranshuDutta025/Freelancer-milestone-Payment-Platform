"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useCreateProject } from "@/hooks/useContract"
import { useWallet } from "@/hooks/useWallet"
import { toast } from "sonner"
import type { MilestoneInput } from "@/types"

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const { address } = useWallet()
  const createProject = useCreateProject()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [milestones, setMilestones] = useState<MilestoneInput[]>([
    { title: "", description: "", amount: 0 },
  ])

  const isSubmitting = createProject.isPending

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", description: "", amount: 0 }])
  }

  const removeMilestone = (index: number) => {
    if (milestones.length <= 1) return
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const updateMilestone = (index: number, field: keyof MilestoneInput, value: string | number) => {
    const updated = [...milestones]
    updated[index] = { ...updated[index], [field]: value }
    setMilestones(updated)
  }

  const handleSubmit = async () => {
    if (!title.trim() || !address) return
    if (milestones.some((m) => !m.title.trim() || m.amount <= 0)) {
      toast.error("All milestones must have a title and amount greater than 0")
      return
    }

    try {
      await createProject.mutateAsync({
        client: address,
        title: title.trim(),
        description: description.trim(),
        milestones: milestones.map((m) => ({
          ...m,
          amount: m.amount,
        })),
      })
      toast.success("Project created successfully!")
      onOpenChange(false)
      setTitle("")
      setDescription("")
      setMilestones([{ title: "", description: "", amount: 0 }])
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create project")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Define your project milestones and budget
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Build a React Dashboard"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Milestones</Label>
              <Button variant="outline" size="sm" onClick={addMilestone} className="gap-1">
                <Plus className="h-3 w-3" />
                Add Milestone
              </Button>
            </div>

            {milestones.map((milestone, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Milestone {index + 1}</span>
                  {milestones.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMilestone(index)}>
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  )}
                </div>
                <Input
                  placeholder="Milestone title"
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, "title", e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, "description", e.target.value)}
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Amount (XLM)"
                  value={milestone.amount || ""}
                  onChange={(e) => updateMilestone(index, "amount", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
