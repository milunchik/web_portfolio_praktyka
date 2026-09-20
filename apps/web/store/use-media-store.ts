import { create } from 'zustand';
import { mediaService } from '../services/media.service';
import type {
  CreateMediaRequest,
  Media,
  UpdateMediaRequest,
} from '../types';

interface MediaState {
  medias: Media[];
  loading: boolean;
  uploading: boolean;
  error: string | null;

  fetchMyMedias: () => Promise<void>;
  fetchUserMedias: (userId: number) => Promise<Media[]>;
  uploadFile: (file: File) => Promise<Media | null>;
  createMedia: (data: CreateMediaRequest) => Promise<Media | null>;
  updateMedia: (id: number, data: UpdateMediaRequest) => Promise<Media | null>;
  deleteMedia: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  medias: [],
  loading: false,
  uploading: false,
  error: null,

  fetchMyMedias: async () => {
    set({ loading: true, error: null });
    try {
      const medias = await mediaService.getMy();
      set({ medias, loading: false });
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch media files',
        loading: false,
      });
    }
  },

  fetchUserMedias: async (userId: number) => {
    set({ loading: true, error: null });
    try {
      const list = await mediaService.getByUserId(userId);
      set({ loading: false });
      return list;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch media files',
        loading: false,
      });
      return [];
    }
  },

  uploadFile: async (file: File) => {
    set({ uploading: true, error: null });
    try {
      const uploaded = await mediaService.upload(file);
      set({
        medias: [uploaded, ...get().medias],
        uploading: false,
      });
      return uploaded;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to upload file',
        uploading: false,
      });
      return null;
    }
  },

  createMedia: async (data: CreateMediaRequest) => {
    set({ loading: true, error: null });
    try {
      const newMedia = await mediaService.create(data);
      set({
        medias: [newMedia, ...get().medias],
        loading: false,
      });
      return newMedia;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to create media entry',
        loading: false,
      });
      return null;
    }
  },

  updateMedia: async (id: number, data: UpdateMediaRequest) => {
    set({ loading: true, error: null });
    try {
      const updated = await mediaService.update(id, data);
      set({
        medias: get().medias.map((m) => (m.id === id ? updated : m)),
        loading: false,
      });
      return updated;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to update media entry',
        loading: false,
      });
      return null;
    }
  },

  deleteMedia: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await mediaService.delete(id);
      set({
        medias: get().medias.filter((m) => m.id !== id),
        loading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to delete media',
        loading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
