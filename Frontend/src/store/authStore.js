import { create } from "zustand";
import api from "@/lib/apiClient";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  login: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/api/auth/login", credentials);
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);

      set({ user, token, loading: false });
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  register: async (credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("/api/auth/register", credentials);
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);

      set({ user, token, loading: false });
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem("token");
  },

  setUser: (user) => set({ user }),

  hydrate: async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await api.get("/api/auth/profile");

      set({
        token,
        user: response.data.data,
      });
    } catch {
      localStorage.removeItem("token");
      set({ token: null, user: null, error: null });
    }
  },
}));

export default useAuthStore;
