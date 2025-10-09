"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";

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
      <div className="flex text-xs p-1 align-items-center justify-content-end pr-3">
          <Button className="p-0 m-0 text-xs pr-3" link label="Publication" icon="pi pi-external-link" />
          <Button className="p-0 m-0 text-xs pr-3" link label="TB Drug Accelerator" icon="pi pi-wave-pulse" />
          <Button className="p-0 m-0 text-xs pr-3" link label="GitHub" icon="pi pi-github" />
          
          </div>
      <div className="flex flex-column border-0 align-items-center justify-content-center p-2 surface-100 gap-2">
        
        
          <div className="flex text-3xl text-primary font-bold">PARSNIP</div>
      </div>
      <div className="flex border-0 w-full p-1 surface-border gap-2">
        <div className="flex border-1 border-50 w-full">
          <TargetGraph />
        </div>
        <div className="flex border-1 border-50 w-full">
          <TargetTable />
        </div>
      </div>
      <div className="flex border-0 p-3 surface-border text-2xl text-primary font-bold justify-content-center surface-100">Target Evaluation</div>
      <div className="flex border-1 w-full surface-border"><TargetEvaluationBar /></div>
      <div className="flex border-1 surface-border w-full">
        <TargetQuestionnaire />
      </div>
    </div>
  );
}
