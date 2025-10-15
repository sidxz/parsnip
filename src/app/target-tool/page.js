"use client";
import React from "react";
import dynamic from "next/dynamic";
import { Button } from "primereact/button";
import { useEffect } from "react";
import { useVulnerabilityStore } from "@/app/stores/useVulnerabilityStore";
import { useQuestionStore } from "@/app/stores/useQuestionStore";
import TargetGraph from "../components/target-graph/TargetGraph";
import TargetTable from "../components/target-table/TargetTable";
import TargetEvaluationBar from "../components/target-evaluation-bar/TargetEvaluationBar";
import TargetQuestionnaire from "../components/target-questionnaire/TargetQuestionnaire";
import { calculateScore } from "../lib/score";
import { useConstantsStore } from "../stores/useConstantStore";
import Loading from "../components/ui/Loading";
import { useUIStore } from "../stores/useUIStore";
import { useTargetsStore } from "../stores/useTargetStore";
import { ProgressBar } from "primereact/progressbar";
import { Knob } from "primereact/knob";

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

  const {
    questions,
    loadingQuestions,
    loadQuestions,
    selections,
    setAnswer,
    loadQuestionnaire,
    saveQuestionnaire,
  } = useQuestionStore();

  const {
    selectedTargetName,
    setSelectedTargetName,
    selectedGenes,
    setSelectedGenes,
  } = useUIStore();

  const {
    targets,
    loadingTargets,
    targetsError,
    loadTargets,
    filterTargetsByName,
  } = useTargetsStore();

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  useEffect(() => {
    loadVulnerabilities();
  }, [loadVulnerabilities]);

  useEffect(() => {
    // Load once on mount (or wherever you want)
    loadConstants();
  }, [loadConstants]);

  useEffect(() => {
    if ((targets?.length ?? 0) === 0) {
      loadTargets();
    }
  }, [loadTargets, targets?.length]);

  const [scores, setScores] = React.useState({});

  const onEvaluate = () => {
    const responses = saveQuestionnaire();
    console.log("Selected genes:", selectedGenes);
    console.log("Target name:", selectedTargetName);
    console.log("Questionnaire responses:", responses);

    let accessionNumber = selectedGenes[0]?.Locus;
    if (!accessionNumber) {
      console.error("No accession number found for selected genes");
      return;
    }
    console.log("Accession No = ", accessionNumber);
    console.log("Evaluate clicked");
    let finalScores = calculateScore(responses, accessionNumber);
    setScores({
      ...finalScores,
    });
  };

  if (
    loadingTargets ||
    loadingQuestions ||
    constantsLoading ||
    vulnerabilityLoading
  )
    return <Loading />;

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
          <TargetGraph scores={scores} evaluatedTarget={selectedTargetName} />
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
        <div className="flex flex-column surface-card p-3 border-round shadow-1 w-full justify-content-center align-items-center md:w-6">
          <div className="text-xl text-500">Calculated Chemistry Score</div>
          <div className="text-2xl font-bold text-primary">
            {/* {scores?.chemistryScore ?? "—"} */}
            <Knob
              value={scores?.chemistryScore ?? 0}
              strokeWidth={5}
              readOnly
            />
          </div>
        </div>
        <div className="flex flex-column surface-card p-3 border-round shadow-1 w-full justify-content-center align-items-center md:w-6">
          <div className="text-xl text-500">Calculated Genetic Score</div>
          <div className="text-2xl font-bold text-primary">
            {/* {scores?.geneticScore ?? "—"} */}
            {/* <ProgressBar value={scores?.geneticScore ?? 0}></ProgressBar> */}
            <Knob value={scores?.geneticScore ?? 0} strokeWidth={5} readOnly />
          </div>
        </div>
        <div className="flex flex-column surface-card p-3 border-round shadow-1 w-full justify-content-center align-items-center md:w-6">
          <div className="text-xl text-500">Calculated Likelihood Score</div>
          <div className="text-2xl font-bold text-primary">
            {/* {scores?.likelihoodScore ?? "33.45"} */}
            <Knob
              value={scores?.likelihoodScore ?? 0}
              strokeWidth={5}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="flex border-1 surface-border w-full ">
        <TargetQuestionnaire />
      </div>
    </div>
  );
}
