"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUIStore = create(
  (set) => ({
    selectedTargetName: "",
    selectedGenes: [],

    // Generic setters
    setSelectedTargetName: (name) => set({ selectedTargetName: name }),
    setSelectedGenes: (genes) => set({ selectedGenes: genes }),
    // reset everything UI-related
    resetUI: () =>
      set({
        selectedTargetName: "",
        selectedGenes: [],
      }),
  }),
  {
    name: "ui-store", // persists in localStorage
  }
);
