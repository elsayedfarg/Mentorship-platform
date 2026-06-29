import { create } from "zustand";
import api from "@/lib/apiClient";

const useStudentStore = create((set) => ({
  profile: null,
  sessions: [],
  mentors: [],
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      const [sessionsRes, mentorsRes] = await Promise.all([
        api.get("/api/session"),
        api.get("/api/mentor?limit=3") // just get a few mentors for recommended
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
