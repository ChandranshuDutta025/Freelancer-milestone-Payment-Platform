import { create } from 'zustand';
import type { Project } from '@/types';

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;

  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, updates: Partial<Project>) => void;
  setSelectedProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  getProjectById: (id: number) => Project | undefined;
  getClientProjects: (clientAddress: string) => Project[];
  getFreelancerProjects: (freelancerAddress: string) => Project[];
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,

  setProjects: (projects: Project[]) => {
    set({ projects });
  },

  addProject: (project: Project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },

  updateProject: (id: number, updates: Partial<Project>) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
      selectedProject:
        state.selectedProject?.id === id
          ? { ...state.selectedProject, ...updates }
          : state.selectedProject,
    }));
  },

  setSelectedProject: (project: Project | null) => {
    set({ selectedProject: project });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  getProjectById: (id: number) => {
    return get().projects.find((p) => p.id === id);
  },

  getClientProjects: (clientAddress: string) => {
    return get().projects.filter(
      (p) => p.client.toLowerCase() === clientAddress.toLowerCase(),
    );
  },

  getFreelancerProjects: (freelancerAddress: string) => {
    return get().projects.filter(
      (p) =>
        p.freelancer !== null &&
        p.freelancer.toLowerCase() === freelancerAddress.toLowerCase(),
    );
  },
}));
