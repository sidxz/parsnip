"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";
import { useEffect } from "react";
import { useVulnerabilityStore } from "@/app/stores/useVulnerabilityStore";
import TargetGraph from "../components/target-graph/TargetGraph";
import TargetTable from "../components/target-table/TargetTable";
import TargetEvaluationBar from "../components/target-evaluation-bar/TargetEvaluationBar";
import TargetQuestionnaire from "../components/target-questionnaire/TargetQuestionnaire";
import { calculateScore } from "../lib/score";
import { useConstantsStore } from "../stores/useConstantStore";
import Loading from "../components/ui/Loading";

export default function TargetTool() {
  const loadVulnerabilities = useVulnerabilityStore(
    (s) => s.loadVulnerabilities
  );
  const getByAccession = useVulnerabilityStore((s) => s.getByAccession);
  const vulnerabilityLoading = useVulnerabilityStore(
    (s) => s.vulnerabilityLoading
  );
  const error = useVulnerabilityStore((s) => s.error);

  const { constants, constantsLoading, loadConstants, get } =
    useConstantsStore();

  useEffect(() => {
    loadVulnerabilities();
  }, [loadVulnerabilities]);

  useEffect(() => {
    // Load once on mount (or wherever you want)
    loadConstants();
  }, [loadConstants]);

  const [scores, setScores] = React.useState({});

  const onEvaluate = () => {
    let mockResponse = {
      "2A1": "UNKNOWN",
      "2A1B": "UNKNOWN",
      "2A2": "UNKNOWN",
      "2A4A": "UNKNOWN",
      "2A4B": "UNKNOWN",
      "2A5": "UNKNOWN",
      "2B1": "UNKNOWN",
      "2B2": "UNKNOWN",
      "2B4": "UNKNOWN",
      "2C3": "UNKNOWN",
      "2C5": "UNKNOWN",
      "3A1": "UNKNOWN",
      "3A2": "UNKNOWN",
      "3A3": "UNKNOWN",
      "3A4": "UNKNOWN",
      "3B1": "YES",
      "3B2": "YES",
      "4A3A": "ACTIVE",
      "4A3B": "ACTIVE",
      "4A4": "UNKNOWN",
      "4C3": "UNKNOWN",
      "5A1": "NO",
      "5A2": "UNKNOWN",
      "5A3": "NO",
      "5B1": "YES",
      "6A1": "YES",
      "6A2": "YES",
      "6A3": "YES",
      "6A4": "YES",
      "6A4A": "UNKNOWN",
      "6A4B": "UNKNOWN",
      "6A4C": "UNKNOWN",
      "6A5": "YES",
      "6A6": "YES",
      "6A6A": "UNKNOWN",
      "6A7": "YES",
      "6B1": "NA",
      "6B2": "LOW",
      "6B3": "LOW",
      "6B4": "HIGH",
      "6B5": "NA",
      "6C1": "YES",
      "6C2": "YES",
      "6C3": "YES",
      "6C4": "YES",
      "6C5": "MEDIUM",
      "6D1": "YES",
      "6D2": "UNKNOWN",
      "6D3": "UNKNOWN",
      "6D4": "NO",
    };
    let accessionNumber = "Rv1297";
    console.log("Evaluate clicked");
    let finalScores = calculateScore(mockResponse, accessionNumber);
    setScores({
      ...finalScores,
    });
  };

  if (constantsLoading || vulnerabilityLoading) return <Loading />;

  return (
    <div className="flex flex-column w-full">
      <div className="flex flex-column border-0 align-items-center justify-content-center p-2 surface-100 gap-2">
        <div className="flex text-3xl text-primary font-bold">PARSNIP</div>
        <div className="flex text-xs p-0 align-items-center justify-content-end pr-3">
          <Button
            className="p-0 m-0 text-xs pr-3"
            link
            label="Publication"
            icon="pi pi-external-link"
          />
          <Button
            className="p-0 m-0 text-xs pr-3"
            link
            label="TB Drug Accelerator"
            icon="pi pi-wave-pulse"
          />
          <Button
            className="p-0 m-0 text-xs pr-3"
            link
            label="GitHub"
            icon="pi pi-github"
          />
        </div>
      </div>

      <div className="flex border-0 w-full p-1 surface-border gap-2">
        <div className="flex border-1 border-50 w-full">
          <TargetGraph scores={scores} />
        </div>
        <div className="flex border-1 border-50 w-full">
          <TargetTable />
        </div>
      </div>
      <div className="flex border-0 p-3 surface-border text-2xl text-primary font-bold justify-content-center surface-100">
        Target Evaluation
      </div>
      <div className="flex border-1 w-full surface-border">
        <TargetEvaluationBar onEvaluate={onEvaluate} />
      </div>

      <div className="flex gap-3 p-2 w-full">
        <div className="flex flex-column surface-card p-3 border-round shadow-1 w-full md:w-6">
          <div className="text-sm text-500">Calculated Chemistry Score</div>
          <div className="text-2xl font-bold text-primary">
            {scores?.chemistryScore ?? "—"}
          </div>
        </div>
        <div className="flex flex-column surface-card p-3 border-round shadow-1 w-full md:w-6">
          <div className="text-sm text-500">Calculated Genetic Score</div>
          <div className="text-2xl font-bold text-primary">
            {scores?.geneticScore ?? "—"}
          </div>
        </div>
        <div className="flex flex-column surface-card p-3 border-round shadow-1 w-full md:w-6">
          <div className="text-sm text-500">Calculated Liability Score</div>
          <div className="text-2xl font-bold text-primary">
            {scores?.liabilityScore ?? "—"}
          </div>
        </div>
      </div>

      <div className="flex border-1 surface-border w-full">
        <TargetQuestionnaire />
      </div>
    </div>
  );
}
