import { create } from "zustand";

export type AppUser = {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
};

type UserState = {
  user: AppUser | null;
  setUser: (user: AppUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const useIsAuthenticated = () => useUserStore((state) => state.user !== null);
