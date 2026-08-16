import { create } from "zustand";

export type ToastVariant = "success" | "error";

export type Toast = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastState = {
  current: Toast | null;
  show: (message: string, variant: ToastVariant) => void;
  hide: () => void;
};

let nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  current: null,
  show: (message, variant) =>
    set({ current: { id: ++nextId, message, variant } }),
  hide: () => set({ current: null }),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().show(message, "success"),
  error: (message: string) => useToastStore.getState().show(message, "error"),
};
