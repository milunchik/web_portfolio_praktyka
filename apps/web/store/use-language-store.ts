import { create } from 'zustand';
import { languageService } from '../services/language.service';
import type {
  CreateLanguageRequest,
  Language,
  UpdateLanguageRequest,
} from '../types';

interface LanguageState {
  languages: Language[];
  loading: boolean;
  error: string | null;

  fetchMyLanguages: () => Promise<void>;
  fetchUserLanguages: (userId: number) => Promise<Language[]>;
  createLanguage: (data: CreateLanguageRequest) => Promise<Language | null>;
  updateLanguage: (id: number, data: UpdateLanguageRequest) => Promise<Language | null>;
  deleteLanguage: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  languages: [],
  loading: false,
  error: null,

  fetchMyLanguages: async () => {
    set({ loading: true, error: null });
    try {
      const languages = await languageService.getMy();
      set({ languages, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch languages',
        loading: false,
      });
    }
  },

  fetchUserLanguages: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const list = await languageService.getByUserId(userId);
      set({ loading: false });
      return list;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch languages',
        loading: false,
      });
      return [];
    }
  },

  createLanguage: async (data: CreateLanguageRequest) => {
    set({ loading: true, error: null });
    try {
      const newLang = await languageService.create(data);
      set({
        languages: [newLang, ...get().languages],
        loading: false,
      });
      return newLang;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to create language',
        loading: false,
      });
      return null;
    }
  },

  updateLanguage: async (id: number, data: UpdateLanguageRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await languageService.update(id, data);
      set({
        languages: get().languages.map((lang) => (lang.id === id ? updated : lang)),
        loading: false,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to update language',
        loading: false,
      });
      return null;
    }
  },

  deleteLanguage: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await languageService.delete(id);
      set({
        languages: get().languages.filter((lang) => lang.id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to delete language',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
