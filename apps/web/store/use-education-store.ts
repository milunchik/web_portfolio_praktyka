import { create } from 'zustand';
import { educationService } from '../services/education.service';
import type {
  CreateEducationRequest,
  Education,
  UpdateEducationRequest,
} from '../types';

interface EducationState {
  educations: Education[];
  loading: boolean;
  error: string | null;

  fetchMyEducations: () => Promise<void>;
  fetchUserEducations: (userId: number) => Promise<Education[]>;
  createEducation: (data: CreateEducationRequest) => Promise<Education | null>;
  updateEducation: (id: number, data: UpdateEducationRequest) => Promise<Education | null>;
  deleteEducation: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useEducationStore = create<EducationState>((set, get) => ({
  educations: [],
  loading: false,
  error: null,

  fetchMyEducations: async () => {
    set({ loading: true, error: null });
    try {
      const educations = await educationService.getMy();
      set({ educations, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch educations',
        loading: false,
      });
    }
  },

  fetchUserEducations: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const list = await educationService.getByUserId(userId);
      set({ loading: false });
      return list;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch educations',
        loading: false,
      });
      return [];
    }
  },

  createEducation: async (data: CreateEducationRequest) => {
    set({ loading: true, error: null });
    try {
      const newEdu = await educationService.create(data);
      set({
        educations: [newEdu, ...get().educations],
        loading: false,
      });
      return newEdu;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to create education',
        loading: false,
      });
      return null;
    }
  },

  updateEducation: async (id: number, data: UpdateEducationRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await educationService.update(id, data);
      set({
        educations: get().educations.map((edu) => (edu.id === id ? updated : edu)),
        loading: false,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to update education',
        loading: false,
      });
      return null;
    }
  },

  deleteEducation: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await educationService.delete(id);
      set({
        educations: get().educations.filter((edu) => edu.id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to delete education',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
