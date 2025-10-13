// useConstantsStore.js
"use client";
import { create } from "zustand";

// Optional: deep-freeze so constants aren't mutated accidentally
const deepFreeze = (obj) => {
  if (obj && typeof obj === "object" && !Object.isFrozen(obj)) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      deepFreeze(obj[prop]);
    });
  }
  return obj;
};

const RAW_URL =
  "https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/config/constants.json";

export const useConstantsStore = create((set, get) => ({
  constants: {},
  constantsLoading: false,
  error: null,

  loadConstants: async () => {
    set({ constantsLoading: true, error: null });
    try {
      const res = await fetch(RAW_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      deepFreeze(data);
      set({ constants: data || {}, constantsLoading: false });
    } catch (e) {
      set({
        error: e?.message || "Failed to load constants",
        constantsLoading: false,
      });
    }
  },

  // Get a constant by key or dot.path (e.g., "Glycolytic_BEST.7H9")
  get: (key) => {
    if (!key) return undefined;
    const obj = get().constants;
    if (Object.prototype.hasOwnProperty.call(obj, key)) return obj[key];
    // dot-path lookup
    return key
      .split(".")
      .reduce((acc, part) => (acc ? acc[part] : undefined), obj);
  },

  reset: () => set({ constants: {}, error: null, constantsLoading: false }),
}));
