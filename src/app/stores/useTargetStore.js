"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const URL =
  "https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/data/tbda_targets.json";

export const useTargetsStore = create(
  persist(
    (set, get) => ({
      targets: [],                // array from tbda_targets.json
      loadingTargets: false,
      targetsError: null,
      lastFetchedAt: null,

      // Load (or reload) targets from the GitHub URL
      loadTargets: async () => {
        // avoid duplicate fetches
        if (get().loadingTargets) return;

        set({ loadingTargets: true, targetsError: null });
        const controller = new AbortController();

        try {
          const res = await fetch(URL, {
            cache: "no-store",
            signal: controller.signal,
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const data = await res.json();
          // Accept either an array or {targets: [...]}
          const list = Array.isArray(data) ? data : (data?.targets ?? []);
          if (!Array.isArray(list)) {
            throw new Error("Unexpected JSON shape: expected an array or {targets: []}");
          }

          set({
            targets: list,
            loadingTargets: false,
            lastFetchedAt: Date.now(),
          });
        } catch (err) {
          // ignore abort errors if any
          set({
            targetsError: err?.message || "Failed to load targets",
            loadingTargets: false,
          });
        }

        // return a cleanup in case you want to call from a component effect
        return () => controller.abort();
      },

      // handy helpers
      getTargetById: (id) => get().targets.find((t) => t?.id === id) || null,
      filterTargetsByName: (q) => {
        const query = String(q || "").trim().toLowerCase();
        if (!query) return get().targets;
        return get().targets.filter((t) =>
          String(t?.name || "").toLowerCase().includes(query)
        );
      },

      resetTargets: () =>
        set({ targets: [], loadingTargets: false, targetsError: null, lastFetchedAt: null }),
    }),
    { name: "targets-store" }
  )
);
