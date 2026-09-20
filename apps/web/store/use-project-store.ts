import { create } from 'zustand';
import { projectService } from '../services/project.service';
import type {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
} from '../types';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;

  fetchMyProjects: () => Promise<void>;
  fetchUserProjects: (userId: number) => Promise<Project[]>;
  createProject: (data: CreateProjectRequest) => Promise<Project | null>;
  updateProject: (id: number, data: UpdateProjectRequest) => Promise<Project | null>;
  deleteProject: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchMyProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectService.getMy();
      set({ projects, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch projects',
        loading: false,
      });
    }
  },

  fetchUserProjects: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const list = await projectService.getByUserId(userId);
      set({ loading: false });
      return list;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch projects',
        loading: false,
      });
      return [];
    }
  },

  createProject: async (data: CreateProjectRequest) => {
    set({ loading: true, error: null });
    try {
      const newProj = await projectService.create(data);
      set({
        projects: [newProj, ...get().projects],
        loading: false,
      });
      return newProj;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to create project',
        loading: false,
      });
      return null;
    }
  },

  updateProject: async (id: number, data: UpdateProjectRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await projectService.update(id, data);
      set({
        projects: get().projects.map((proj) => (proj.id === id ? updated : proj)),
        loading: false,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to update project',
        loading: false,
      });
      return null;
    }
  },

  deleteProject: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await projectService.delete(id);
      set({
        projects: get().projects.filter((proj) => proj.id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to delete project',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
