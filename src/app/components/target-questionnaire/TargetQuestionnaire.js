"use client";
import React from "react";
import TargetQuestion from "../target-question/TargetQuestion";
import { useQuestionStore } from "@/app/stores/useQuestionStore";
import Loading from "../ui/Loading";

const TargetQuestionnaire = ({ incoming }) => {
  const {
    questions,
    loadingQuestions,
    error,
    loadQuestions,
    selections,
    setAnswer,
    loadQuestionnaire,
    saveQuestionnaire,
  } = useQuestionStore();

  // React.useEffect(() => {
  //   loadQuestions();
  // }, [loadQuestions]);

  // Example: preload a questionnaire after questions load
  // Comment out if you don't want auto-preload
  React.useEffect(() => {
    if (!questions.length) return;
    // const incoming = {
    //   "2A1": "UNKNOWN",
    //   "2A1B": "UNKNOWN",
    //   "2A2": "UNKNOWN",
    //   "2A4A": "ACTIVE",
    //   "2A4B": "UNKNOWN",
    //   "2A5": "ACTIVE",
    //   "2B1": "ACTIVE",
    //   "2B2": "ACTIVE",
    //   "2B4": "INACTIVE",
    //   "2C3": "UNKNOWN",
    //   "2C5": "ACTIVE",
    //   "3A1": "YES",
    //   "3A2": "YES",
    //   "3A3": "YES",
    //   "3A4": "UNKNOWN",
    //   "3B1": "YES",
    //   "3B2": "YES",
    //   "4A3A": "ACTIVE",
    //   "4A3B": "ACTIVE",
    //   "4A4": "UNKNOWN",
    //   "4C3": "UNKNOWN",
    //   "5A1": "NO",
    //   "5A2": "NO",
    //   "5A3": "NO",
    //   "5B1": "YES",
    //   "6A1": "YES",
    //   "6A2": "YES",
    //   "6A3": "NO",
    //   "6A4": "NO",
    //   "6A5": "NO",
    //   "6A6": "NO",
    //   "6A7": "YES",
    //   "6B1": "NA",
    //   "6B2": "LOW",
    //   "6B3": "MEDIUM",
    //   "6B4": "HIGH",
    //   "6B5": "NA",
    //   "6C1": "YES",
    //   "6C2": "YES",
    //   "6C3": "UNKNOWN",
    //   "6C4": "UNKNOWN",
    //   "6C5": "HIGH",
    //   "6D1": "UNKNOWN",
    //   "6D2": "YES",
    //   "6D3": "YES",
    //   "6D4": "UNKNOWN",
    // };
    console.log("Preloading questionnaire:", incoming);
    if (incoming) loadQuestionnaire(incoming);
  }, [questions, loadQuestionnaire]);

  if (loadingQuestions) return <Loading />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex flex-column gap-2 m-2 p-2 w-full align-items-center border-0">
      <div className="w-full flex text-xl p-2">
        TARGET QUESTIONNAIRE
      </div>

      {questions.map((q, idx) => (
        <TargetQuestion
          idx={idx}
          key={q.id}
          question={q}
          value={selections[q.identification] || null}
          onChange={setAnswer}
        />
      ))}
    </div>
  );
};

export default TargetQuestionnaire;
