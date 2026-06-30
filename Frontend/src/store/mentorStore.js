import { create } from "zustand";
import api from "@/lib/apiClient";

const useMentorStore = create((set) => ({
  profile: null,
  sessions: [],
  availability: [],
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/mentors/profile");
      set({ profile: response.data.data, loading: false });
      return { success: true, profile: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateProfile: async (payload) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put("/api/mentors/profile", payload);
      set({ profile: response.data.data, loading: false });
      return { success: true, profile: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchSessions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/sessions");
      set({ sessions: response.data.data || [], loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchAvailability: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/mentors/me/availability");
      set({ availability: response.data.data || [], loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  addAvailability: async (payload) => {
    try {
      const response = await api.post("/api/mentors/availability", payload);
      const block = response.data.data;
      set((state) => ({
        availability: [...state.availability, block],
      }));
      return { success: true, block };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  removeAvailability: async (availabilityId) => {
    try {
      await api.delete(`/api/mentors/availability/${availabilityId}`);
      set((state) => ({
        availability: state.availability.filter(
          (block) => (block._id || block.id) !== availabilityId,
        ),
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  updateSessionStatus: async (sessionId, status) => {
    try {
      const response = await api.put(`/api/sessions/${sessionId}/status`, {
        status,
      });
      const updated = response.data.data;
      set((state) => ({
        sessions: state.sessions.map((s) =>
          (s._id || s.id) === sessionId ? { ...s, ...updated, status } : s,
        ),
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },
}));

export default useMentorStore;
