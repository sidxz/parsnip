"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import Link from "next/link";
import * as XLSX from "xlsx";

import { useQuestionStore } from "@/app/stores/useQuestionStore";
import { useConstantsStore } from "@/app/stores/useConstantStore";
import { useVulnerabilityStore } from "@/app/stores/useVulnerabilityStore";
import { generateWeightedAnswerMatrix } from "@/app/lib/helpers";
import { computeSection2 } from "@/app/lib/section2";
import { computeSection3 } from "@/app/lib/section3";
import { computeSection4 } from "@/app/lib/section4";
import { computeSection5 } from "@/app/lib/section5";
import { computeChemistryScore } from "@/app/lib/chemistryScore";
import { computeGeneticScore } from "@/app/lib/geneticScore";
import { computeSection6 } from "@/app/lib/section6";
import { totalInhibition } from "@/app/lib/totalInhibition";
import Loading from "@/app/components/ui/Loading";
import { STRING_CONSTANTS } from "@/app/lib/strings";

// ---------------------------------------------------------------------------
// Rv-number resolution helpers
// ---------------------------------------------------------------------------
function resolveRvNumber(answers, fileName, genes) {
  if (answers._rvNumber) {
    return answers._rvNumber;
  }
  const targetName = fileName.replace(/\.json$/i, "").trim();
  const match = genes.find(
    (g) => g.Name && g.Name.toLowerCase() === targetName.toLowerCase()
  );
  return match?.Locus || null;
}

function stripMeta(answers) {
  const { _rvNumber, ...rest } = answers;
  return rest;
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function BulkEvaluatePage() {
  const toast = useRef(null);
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const { loadQuestions, questions, answerWeightMap, loadingQuestions } =
    useQuestionStore();
  const { loadConstants, constantsLoading } = useConstantsStore();
  const { loadVulnerabilities, vulnerabilityLoading } =
    useVulnerabilityStore();

  const [genes, setGenes] = useState([]);
  const [genesLoading, setGenesLoading] = useState(true);

  const [targets, setTargets] = useState([]);
  const [scored, setScored] = useState(false);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);
  useEffect(() => {
    loadConstants();
  }, [loadConstants]);
  useEffect(() => {
    loadVulnerabilities();
  }, [loadVulnerabilities]);
  useEffect(() => {
    setGenesLoading(true);
    fetch(
      "https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/data/genes.json"
    )
      .then((r) => r.json())
      .then((data) => setGenes(data || []))
      .catch(console.error)
      .finally(() => setGenesLoading(false));
  }, []);

  const storesReady =
    !loadingQuestions && !constantsLoading && !vulnerabilityLoading && !genesLoading;

  const processFiles = useCallback(
    (fileList) => {
      const jsonFiles = Array.from(fileList).filter((f) =>
        f.name.toLowerCase().endsWith(".json")
      );
      if (jsonFiles.length === 0) {
        toast.current?.show({
          severity: "warn",
          summary: "No JSON files",
          detail: "No .json files found in the selection.",
          life: 3000,
        });
        return;
      }

      const promises = jsonFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const answers = JSON.parse(e.target.result);
                const rvNumber = resolveRvNumber(answers, file.name, genes);
                const cleanAnswers = stripMeta(answers);
                const knownIds = new Set(
                  questions.map((q) => q.identification)
                );
                const answeredCount = Object.keys(cleanAnswers).filter((k) =>
                  knownIds.has(k)
                ).length;

                resolve({
                  name: file.name.replace(/\.json$/i, ""),
                  rvNumber,
                  answers: cleanAnswers,
                  answeredCount,
                  totalQuestions: questions.length,
                  status: rvNumber ? "Ready" : "Warning: no Rv number",
                  scores: null,
                });
              } catch (err) {
                resolve({
                  name: file.name.replace(/\.json$/i, ""),
                  rvNumber: null,
                  answers: null,
                  answeredCount: 0,
                  totalQuestions: questions.length,
                  status: `Error: ${err.message}`,
                  scores: null,
                });
              }
            };
            reader.readAsText(file);
          })
      );

      Promise.all(promises).then((results) => {
        setTargets(results);
        setScored(false);
        toast.current?.show({
          severity: "success",
          summary: "Files loaded",
          detail: `${results.length} JSON file(s) loaded.`,
          life: 3000,
        });
      });
    },
    [genes, questions]
  );

  const handleFolderSelect = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const handleFileSelect = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const [dragOver, setDragOver] = useState(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleScoreAll = () => {
    setScoring(true);
    const updated = targets.map((t) => {
      if (!t.answers) return t;
      try {
        const weightedMatrix = generateWeightedAnswerMatrix(
          answerWeightMap,
          t.answers
        );
        const section2res = computeSection2(weightedMatrix);
        const section3res = computeSection3(weightedMatrix);
        const section4res = computeSection4(weightedMatrix, t.rvNumber || "");
        const section5res = computeSection5(weightedMatrix);
        const chemScore = computeChemistryScore(
          weightedMatrix,
          section2res,
          section3res,
          t.answers
        );
        const genScore = computeGeneticScore(
          weightedMatrix,
          section4res,
          chemScore.liability_multiplier
        );
        const section6res = computeSection6(t.answers, weightedMatrix);
        const totalInhib = totalInhibition(
          t.answers,
          weightedMatrix,
          chemScore,
          genScore
        );

        return {
          ...t,
          status: "Scored",
          scores: {
            chemistryScore: Number(chemScore.chemistry_score.toFixed(0)),
            geneticScore: Number(genScore.genetic_score.toFixed(0)),
            likelihoodScore: Number(section6res.Sec6_Sum.toFixed(0)),
            totalInhibitionScore: Number(
              totalInhib.total_inhibition_score.toFixed(0)
            ),
          },
        };
      } catch (err) {
        console.error(`Scoring failed for ${t.name}:`, err);
        return { ...t, status: `Error: ${err.message}` };
      }
    });
    setTargets(updated);
    setScored(true);
    setScoring(false);
    toast.current?.show({
      severity: "success",
      summary: "Scoring complete",
      detail: `${updated.filter((t) => t.scores).length} target(s) scored.`,
      life: 3000,
    });
  };

  const handleDownloadExcel = () => {
    const rows = targets
      .filter((t) => t.scores)
      .map((t) => ({
        "Target Name": t.name,
        "Rv Number": t.rvNumber || "",
        [STRING_CONSTANTS.CHEMICAL_IN]: t.scores.chemistryScore,
        [STRING_CONSTANTS.GENETIC_IN]: t.scores.geneticScore,
        [STRING_CONSTANTS.LIKELIHOOD]: t.scores.likelihoodScore,
        [STRING_CONSTANTS.TOTAL_IN]: t.scores.totalInhibitionScore,
      }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bulk Evaluation");
    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `bulk_evaluation_${today}.xlsx`);
  };

  const statusTemplate = (rowData) => {
    if (rowData.status === "Ready")
      return <Tag severity="success" value="Ready" />;
    if (rowData.status === "Scored")
      return <Tag severity="info" value="Scored" />;
    if (rowData.status?.startsWith("Warning"))
      return <Tag severity="warning" value={rowData.status} />;
    return <Tag severity="danger" value={rowData.status} />;
  };

  if (!storesReady) return <Loading />;

  const readyCount = targets.filter(
    (t) => t.status === "Ready" || t.status === "Warning: no Rv number"
  ).length;

  return (
    <div className="flex flex-column w-full">
      {/* Header */}
      <div className="flex flex-column border-0 align-items-center justify-content-center p-2 surface-100 gap-2">
        <div className="flex text-3xl text-primary font-bold">
          PARSNIP — Bulk Evaluate
        </div>
        <div className="flex text-xs gap-2">
          <Link href="/target-tool">
            <Button
              className="p-0 m-0 text-xs"
              link
              label="Back to PARSNIP"
              icon="pi pi-arrow-left"
            />
          </Link>
        </div>
      </div>

      {/* Upload zone */}
      <div
        className={`flex flex-column align-items-center justify-content-center gap-3 p-5 m-3 border-2 border-dashed border-round ${
          dragOver ? "surface-200 border-primary" : "surface-50 border-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <i className="pi pi-upload text-4xl text-400" />
        <div className="text-lg text-600">
          Drag & drop JSON files here, or use the buttons below
        </div>
        <div className="flex gap-2">
          <Button
            label="Select Folder"
            icon="pi pi-folder-open"
            outlined
            onClick={() => folderInputRef.current?.click()}
          />
          <Button
            label="Select Files"
            icon="pi pi-file"
            outlined
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
        <input
          ref={folderInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFolderSelect}
          {...{ webkitdirectory: "", directory: "" }}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".json"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
      </div>

      <Toast ref={toast} position="top-right" />

      {/* Preview / Results table */}
      {targets.length > 0 && (
        <div className="flex flex-column gap-2 p-3">
          <div className="flex justify-content-between align-items-center">
            <div className="text-lg font-bold">
              {targets.length} target(s) loaded
            </div>
            <div className="flex gap-2">
              {!scored && (
                <Button
                  label={`Score All (${readyCount})`}
                  icon="pi pi-play"
                  onClick={handleScoreAll}
                  disabled={readyCount === 0 || scoring}
                  loading={scoring}
                />
              )}
              {scored && (
                <Button
                  label="Download Excel"
                  icon="pi pi-file-excel"
                  severity="success"
                  onClick={handleDownloadExcel}
                />
              )}
            </div>
          </div>

          <DataTable
            value={targets}
            paginator
            rows={25}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sortField={scored ? "scores.totalInhibitionScore" : "name"}
            sortOrder={scored ? -1 : 1}
            size="small"
            stripedRows
            filterDisplay="row"
          >
            <Column
              field="name"
              header="Target Name"
              sortable
              filter
              filterPlaceholder="Search..."
            />
            <Column field="rvNumber" header="Rv Number" sortable />

            {!scored && (
              <Column
                field="answeredCount"
                header="Questions Answered"
                sortable
                body={(row) => `${row.answeredCount}/${row.totalQuestions}`}
              />
            )}
            {!scored && (
              <Column
                field="status"
                header="Status"
                body={statusTemplate}
                sortable
              />
            )}

            {scored && (
              <Column
                field="scores.chemistryScore"
                header={STRING_CONSTANTS.CHEMICAL_IN}
                sortable
                body={(row) => row.scores?.chemistryScore ?? "—"}
              />
            )}
            {scored && (
              <Column
                field="scores.geneticScore"
                header={STRING_CONSTANTS.GENETIC_IN}
                sortable
                body={(row) => row.scores?.geneticScore ?? "—"}
              />
            )}
            {scored && (
              <Column
                field="scores.likelihoodScore"
                header={STRING_CONSTANTS.LIKELIHOOD}
                sortable
                body={(row) => row.scores?.likelihoodScore ?? "—"}
              />
            )}
            {scored && (
              <Column
                field="scores.totalInhibitionScore"
                header={STRING_CONSTANTS.TOTAL_IN}
                sortable
                body={(row) => row.scores?.totalInhibitionScore ?? "—"}
              />
            )}

            {scored && (
              <Column
                field="status"
                header="Status"
                body={statusTemplate}
                sortable
              />
            )}
          </DataTable>
        </div>
      )}
    </div>
  );
}
