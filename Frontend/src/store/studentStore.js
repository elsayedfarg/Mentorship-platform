import { create } from "zustand";
import api from "@/lib/apiClient";

const useStudentStore = create((set) => ({
  profile: null,
  sessions: [],
  mentors: [],
  selectedMentor: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/students/profile");
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
      const response = await api.put("/api/students/profile", payload);
      set({ profile: response.data.data, loading: false });
      return { success: true, profile: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchMentors: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 12, stack, keyword, sort_by } = params;
      const query = new URLSearchParams({ page, limit });
      if (stack) query.set("stack", stack);
      if (keyword) query.set("keyword", keyword);
      if (sort_by) query.set("sort_by", sort_by);

      const response = await api.get(`/api/mentors?${query}`);
      set({ mentors: response.data.data || [], loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchMentor: async (mentorId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/mentors/${mentorId}`);
      set({ selectedMentor: response.data.data, loading: false });
      return { success: true, mentor: response.data.data };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false, selectedMentor: null });
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

  bookSession: async (payload) => {
    try {
      const response = await api.post("/api/sessions/book", payload);
      const session = response.data.data;
      set((state) => ({ sessions: [...state.sessions, session] }));
      return { success: true, session };
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

  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      const [sessionsRes, mentorsRes] = await Promise.all([
        api.get("/api/sessions"),
        api.get("/api/mentors?limit=3") // just get a few mentors for recommended
      ]);

      set({
        sessions: sessionsRes.data.data || [],
        mentors: mentorsRes.data.data || [],
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
}));

export default useStudentStore;
