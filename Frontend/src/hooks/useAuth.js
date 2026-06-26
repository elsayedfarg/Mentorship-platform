import useAuthStore from "@/store/authStore";

export default function useAuth() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const hydrate = useAuthStore((state) => state.hydrate);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,

    login,
    register,
    logout,
    setUser,
    hydrate,
  };
}
