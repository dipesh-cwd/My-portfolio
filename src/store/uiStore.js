import { create } from "zustand";

/**
 * Taskbar UI state: which popup (Start menu or the quick panel) is open.
 * Only one can be open at a time, and both close on Escape / click outside.
 */
export const createInitialUiState = () => ({ startOpen: false, panelOpen: false });

export const useUiStore = create((set) => ({
  ...createInitialUiState(),
  toggleStart: () => set((s) => ({ startOpen: !s.startOpen, panelOpen: false })),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen, startOpen: false })),
  closeMenus: () => set({ startOpen: false, panelOpen: false }),
}));
