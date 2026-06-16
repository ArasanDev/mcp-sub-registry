import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  adminKey: string;
  setAdminKey: (key: string) => void;
  clearAdminKey: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      adminKey: "",
      setAdminKey: (key) => set({ adminKey: key }),
      clearAdminKey: () => set({ adminKey: "" })
    }),
    { name: "mcp-registry-auth" }
  )
);
