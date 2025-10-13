// /app/stores/useQuestionStore.js
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createAnswerWeightMap } from "@/app/lib/helpers";

const norm = (s) =>
  String(s ?? "")
    .trim()
    .toUpperCase();

// Use the label itself as the canonical code
const getOptionCode = (opt) => norm(opt?.answer);

// Find option by comparing desired code to the option.answer
const findOptionByCode = (q, desiredCode) => {
  const want = norm(desiredCode);
  return q.possibleAnswers?.find((o) => norm(o.answer) === want) || null;
};

export const useQuestionStore = create(
  (set, get) => ({
    questions: [],
    answerWeightMap: {},
    // selections keyed by IDENTIFICATION -> optionId
    selections: {},
    loadingQuestions: false,
    error: null,
    pendingQuestionnaire: null, // { [identification]: "YES"/"ACTIVE"/... }
    loadingQuestionnaire: false,

    loadQuestions: async () => {
      set({ loadingQuestions: true, error: null });
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/data/questions.json",
          { cache: "no-store" }
        );
        const data = await res.json();

        const filtered = (data.questions ?? []).filter(
          (q) => !q.isAdminOnly && !q.isDisabled
        );

        const map = createAnswerWeightMap(filtered);

        // Apply pending questionnaire, if any
        const pending = get().pendingQuestionnaire;
        let nextSelections = { ...get().selections };

        if (pending) {
          for (const q of filtered) {
            const ident = q.identification;
            const desired = pending[ident];
            if (!desired) continue;

            const match = findOptionByCode(q, desired);
            if (match) nextSelections[ident] = match.id;
          }
        }

        set({
          questions: filtered,
          answerWeightMap: map,
          selections: nextSelections,
          pendingQuestionnaire: null,
          loadingQuestions: false,
        });
      } catch (e) {
        set({
          error: e?.message || "Failed to load questions",
          loadingQuestions: false,
        });
      }
    },

    // Controlled setter (by identification)
    setAnswer: (identification, optionId) =>
      set((s) => ({
        selections: { ...s.selections, [identification]: optionId },
      })),

    // Load a full questionnaire: { identification: "YES"/"ACTIVE"/... }
    loadQuestionnaire: (incomingMap) => {
      console.log("Loading questionnaire into store:", incomingMap);
      const qs = get().questions;
      if (!qs?.length) {
        set({ pendingQuestionnaire: incomingMap });
        return;
      }

      const next = { ...get().selections };
      for (const q of qs) {
        const ident = q.identification;
        const desired = incomingMap[ident];
        if (!desired) continue;

        const match = findOptionByCode(q, desired);
        if (match) next[ident] = match.id;
      }
      set({ selections: next });
    },

    // Load questionnaire mapping from a URL that returns a JSON object:
    // { "2A1": "YES", "2A4A": "ACTIVE", ... }
    // in /app/stores/useQuestionStore.js
    loadQuestionnaireFromUrl: async (url) => {
      const { questions, loadQuestionnaire } = get();

      set({ loadingQuestionnaire: true, error: null });
      try {
        if (!url || typeof url !== "string") {
          throw new Error("loadQuestionnaireFromUrl: url must be a string");
        }

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        if (!json || typeof json !== "object" || Array.isArray(json)) {
          throw new Error(
            "Expected a JSON object of { identification: answer }"
          );
        }

        if (questions?.length) {
          loadQuestionnaire(json);
        } else {
          set({ pendingQuestionnaire: json });
        }

        set({ loadingQuestionnaire: false });
        return { success: true, message: "Questionnaire loaded successfully" };
      } catch (e) {
        const message = e?.message || "Failed to load questionnaire";
        set({ error: message, loadingQuestionnaire: false });
        return { success: false, message };
      }
    },

    // Save current selections as a questionnaire object

    // Export as { identification: "YES"/"ACTIVE"/... }
    saveQuestionnaire: () => {
      const { questions, selections } = get();
      const out = {};
      for (const q of questions) {
        const ident = q.identification;
        const optId = selections[ident];
        if (!optId) continue;

        const opt = q.possibleAnswers?.find((o) => o.id === optId);
        if (!opt) continue;

        out[ident] = getOptionCode(opt); // returns normalized "YES"/"ACTIVE"/...
      }
      return out;
    },

    clearSelections: () => set({ selections: {} }),

    reset: () =>
      set({
        questions: [],
        answerWeightMap: {},
        selections: {},
        pendingQuestionnaire: null,
        loadingQuestions: false,
        error: null,
      }),
  }),
  { name: "question-store" }
);
