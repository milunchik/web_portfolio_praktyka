import { create } from 'zustand';
import { userService } from '../services/user.service';
import { useAuthStore } from './use-auth-store';
import type { SafeUser, UpdateUserRequest } from '../types';

interface UserState {
  profile: SafeUser | null;
  publicProfile: SafeUser | null;
  loading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateUserRequest) => Promise<SafeUser | null>;
  fetchPublicProfile: (publicUrl: string) => Promise<SafeUser | null>;
  fetchUserById: (id: number) => Promise<SafeUser | null>;
  downloadCvMe: () => Promise<void>;
  downloadCvByPublicUrl: (publicUrl: string) => Promise<void>;
  downloadCvById: (id: number, fullName?: string) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  publicProfile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const profile = await userService.getMe();
      set({ profile, loading: false });
      if (profile) {
        useAuthStore.getState().setUser(profile);
      }
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to fetch profile',
        loading: false,
      });
    }
  },

  updateProfile: async (data: UpdateUserRequest) => {
    set({ loading: true, error: null });
    try {
      const profile = await userService.updateMe(data);
      set({ profile, loading: false });
      if (profile) {
        useAuthStore.getState().setUser(profile);
      }
      return profile;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'Failed to update profile',
        loading: false,
      });
      return null;
    }
  },

  fetchPublicProfile: async (publicUrl: string) => {
    set({ loading: true, error: null });
    try {
      const publicProfile = await userService.getByPublicUrl(publicUrl);
      set({ publicProfile, loading: false });
      return publicProfile;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'User not found',
        loading: false,
      });
      return null;
    }
  },

  fetchUserById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const profile = await userService.getById(id);
      set({ loading: false });
      return profile;
    } catch (err: any) {
      set({
        error: err?.message ? (Array.isArray(err.message) ? err.message.join(', ') : err.message) : 'User not found',
        loading: false,
      });
      return null;
    }
  },

  downloadCvMe: async () => {
    try {
      const blob = await userService.getCvBlobMe();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'My_CV.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({ error: 'Failed to download CV' });
    }
  },

  downloadCvByPublicUrl: async (publicUrl: string) => {
    try {
      const blob = await userService.getCvBlobByPublicUrl(publicUrl);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${publicUrl}_CV.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({ error: 'Failed to download CV' });
    }
  },

  downloadCvById: async (id: number, fullName?: string) => {
    try {
      const blob = await userService.getCvBlobById(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fullName ? fullName.replace(/\s+/g, '_') : `User_${id}`}_CV.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      set({ error: 'Failed to download CV' });
    }
  },

  clearError: () => set({ error: null }),
}));
