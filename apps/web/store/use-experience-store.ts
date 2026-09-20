import { create } from 'zustand';
import { experienceService } from '../services/experience.service';
import type {
  CreateExperienceRequest,
  Experience,
  UpdateExperienceRequest,
} from '../types';

interface ExperienceState {
  experiences: Experience[];
  loading: boolean;
  error: string | null;

  fetchMyExperiences: () => Promise<void>;
  fetchUserExperiences: (userId: number) => Promise<Experience[]>;
  createExperience: (data: CreateExperienceRequest) => Promise<Experience | null>;
  updateExperience: (id: number, data: UpdateExperienceRequest) => Promise<Experience | null>;
  deleteExperience: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  experiences: [],
  loading: false,
  error: null,

  fetchMyExperiences: async () => {
    set({ loading: true, error: null });
    try {
      const experiences = await experienceService.getMy();
      set({ experiences, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch experiences',
        loading: false,
      });
    }
  },

  fetchUserExperiences: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const list = await experienceService.getByUserId(userId);
      set({ loading: false });
      return list;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch experiences',
        loading: false,
      });
      return [];
    }
  },

  createExperience: async (data: CreateExperienceRequest) => {
    set({ loading: true, error: null });
    try {
      const newExp = await experienceService.create(data);
      set({
        experiences: [newExp, ...get().experiences],
        loading: false,
      });
      return newExp;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to create experience',
        loading: false,
      });
      return null;
    }
  },

  updateExperience: async (id: number, data: UpdateExperienceRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await experienceService.update(id, data);
      set({
        experiences: get().experiences.map((exp) => (exp.id === id ? updated : exp)),
        loading: false,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to update experience',
        loading: false,
      });
      return null;
    }
  },

  deleteExperience: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await experienceService.delete(id);
      set({
        experiences: get().experiences.filter((exp) => exp.id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to delete experience',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
