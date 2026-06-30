import { create } from "zustand";
import api from "@/lib/apiClient";

const useAdminStore = create((set) => ({
  users: [],
  pendingMentors: [],
  stackStats: [],
  stacks: [],
  stacksLoading: false,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const { page = 1, limit = 10, role } = params;
      const query = new URLSearchParams({ page, limit });
      if (role) query.set("role", role);
      const response = await api.get(`/api/admin/users?${query}`);
      const data = response.data.data;
      set({
        users: Array.isArray(data) ? data : data?.users || [],
        pagination: data?.pagination || { page, limit, total: data?.length || 0 },
        loading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  updateUserStatus: async (userId, isVerified) => {
    try {
      await api.put(`/api/admin/users/${userId}/status`, { is_verified: isVerified });
      set((state) => ({
        users: state.users.map((user) =>
          (user._id || user.id) === userId
            ? { ...user, is_verified: isVerified }
            : user,
        ),
        pendingMentors: state.pendingMentors.filter(
          (m) => (m._id || m.id) !== userId,
        ),
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  fetchPendingMentors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/api/admin/mentors/pending");
      set({ pendingMentors: response.data.data || [], loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  fetchStackStats: async () => {
    try {
      const response = await api.get("/api/stacks/stats");
      set({ stackStats: response.data.data || [] });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  fetchStacks: async (params = {}) => {
    set({ stacksLoading: true });
    try {
      const { page = 1, limit = 10 } = params;
      const query = new URLSearchParams({ page, limit });
      const response = await api.get(`/api/stacks/stats?${query}`);
      const data = response.data.data;
      set({
        stacks: Array.isArray(data) ? data : data?.stacks || [],
        stacksLoading: false,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ stacksLoading: false });
      return { success: false, error: message };
    }
  },

  createStack: async (payload) => {
    try {
      const response = await api.post("/api/stacks", payload);
      const newStack = response.data.data;
      set((state) => ({ stacks: [...state.stacks, newStack] }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  updateStack: async (id, payload) => {
    try {
      const response = await api.put(`/api/stacks/${id}`, payload);
      const updated = response.data.data;
      set((state) => ({
        stacks: state.stacks.map((s) => (s._id || s.id) === id ? updated : s),
        stackStats: state.stackStats.map((s) => (s._id || s.id) === id ? { ...s, ...updated } : s),
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },

  deleteStack: async (id) => {
    try {
      await api.delete(`/api/stacks/${id}`);
      set((state) => ({
        stacks: state.stacks.filter((s) => (s._id || s.id) !== id),
        stackStats: state.stackStats.filter((s) => (s._id || s.id) !== id),
      }));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return { success: false, error: message };
    }
  },
}));

export default useAdminStore;