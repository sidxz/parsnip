"use client";
import React from "react";
import dynamic from "next/dynamic";
import TargetGraph from "../components/target-graph/TargetGraph";
import TargetTable from "../components/target-table/TargetTable";
import TargetEvaluationBar from "../components/target-evaluation-bar/TargetEvaluationBar";
import TargetQuestionnaire from "../components/target-questionnaire/TargetQuestionnaire";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

export default function TargetTool() {
  return (
    <div className="flex flex-column w-full">
      <div className="flex border-0 align-items-center justify-content-center text-3xl font-bold p-2 surface-100">
        PARSNIP
      </div>
      <div className="flex border-0 w-full p-1 surface-border gap-2">
        <div className="flex border-1 border-50 w-full">
          <TargetGraph />
        </div>
        <div className="flex border-1 border-50 w-full">
          <TargetTable />
        </div>
      </div>
      <div className="flex border-0 p-3 surface-border text-3xl font-bold justify-content-center surface-100">Target Evaluation</div>
      <div className="flex border-1 w-full surface-border"><TargetEvaluationBar /></div>
      <div className="flex border-1 surface-border w-full">
        <TargetQuestionnaire />
      </div>
    </div>
  );
}
