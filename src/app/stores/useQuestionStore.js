"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAnswerWeightMap } from "@/app/lib/helpers";

export const useQuestionStore = create(
  persist(
    (set, get) => ({
      questions: [],
      answerWeightMap: {},
      loading: false,
      error: null,

      // Load + compute once; reuse everywhere
      loadQuestions: async () => {
        set({ loading: true, error: null });
        try {
          console.log("Fetching questions...");
          const res = await fetch("https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/data/questions.json", {
            cache: "no-store",
          });
          const data = await res.json();

          const filtered = (data.questions ?? []).filter(
            (q) => !q.isAdminOnly && !q.isDisabled
          );

          const map = createAnswerWeightMap(filtered);

          set({
            questions: filtered,
            answerWeightMap: map,
            loading: false,
          });
        } catch (e) {
          set({
            error: e?.message || "Failed to load questions",
            loading: false,
          });
        }
      },

      reset: () => set({ questions: [], answerWeightMap: {} }),
    }),
    { name: "question-store" } // persists in localStorage (optional)
  )
);
