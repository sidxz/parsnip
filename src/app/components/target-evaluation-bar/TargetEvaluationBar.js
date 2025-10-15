import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import "primeflex/primeflex.css";

import { useUIStore } from "@/app/stores/useUIStore";
import { useQuestionStore } from "@/app/stores/useQuestionStore";

const TargetEvaluationBar = ({ onEvaluate }) => {
  const {
    selectedTargetName,
    setSelectedTargetName,
    selectedGenes,
    setSelectedGenes,
  } = useUIStore();

  const { loadQuestionnaireFromUrl, loadingQuestionnaire } = useQuestionStore();

  const toast = useRef(null);               // <-- add toast ref
  const [loadingGenes, setLoadingGenes] = useState(true);
  const [genes, setGenes] = useState(null);

  useEffect(() => {
    setLoadingGenes(true);
    fetch("https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/data/genes.json")
      .then((r) => r.json())
      .then((data) => {
        const sorted = data.sort((a, b) =>
          a.Name.localeCompare(b.Name, undefined, { sensitivity: "base" })
        );
        setGenes(sorted);
      })
      .catch(console.error)
      .finally(() => setLoadingGenes(false));
  }, []);

  const formatGeneName = (name) =>
    !name || typeof name !== "string" ? "" : name.charAt(0).toUpperCase() + name.slice(1);

  const onGeneChange = (e) => {
    const sel = e.value || [];
    setSelectedGenes(sel);
    const joined = sel.length
      ? sel.map((g) => formatGeneName(g?.Name ?? "")).filter(Boolean).join("-")
      : "";
    setSelectedTargetName(joined);
  };

  const handleLoadTbdaTarget = async () => {
    const url = `https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/tbda/${encodeURIComponent(
      selectedTargetName
    )}.json`;

    const { success, message } = await loadQuestionnaireFromUrl(url);

    toast.current?.show({
      severity: success ? "success" : "error",
      summary: success ? "Loaded" : "Failed. Please select a target from above.",
      detail: message,
      life: 3000,
    });
  };

  return (
    <div className="flex justify-content-between align-items-center p-3 w-full surface-100">
      <Toast ref={toast} position="top-right" /> {/* toast host */}

      <div className="flex">
        <MultiSelect
          value={selectedGenes}
          loading={loadingGenes}
          onChange={onGeneChange}
          options={genes}
          optionLabel="Name"
          placeholder="Select genes for target evaluation"
          virtualScrollerOptions={{ itemSize: 43 }}
          filter
          className="w-full md:w-20rem"
        />
      </div>

      <div className="flex align-items-center gap-2">
        <div className="flex">Target Name</div>
        <div className="flex">
          <InputText
            value={selectedTargetName}
            onChange={(e) => setSelectedTargetName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-content-end gap-1">
        <Button
          label="Evaluate Proposed Target"
          icon="pi pi-check"
          onClick={onEvaluate}
          disabled={selectedGenes.length === 0 || !selectedTargetName}
        />
        <Button
          label="Load Answers for TBDA Target"
          icon="pi pi-refresh"
          onClick={handleLoadTbdaTarget}
          loading={loadingQuestionnaire}
          disabled={selectedGenes.length === 0 || !selectedTargetName}
        />
        {/* <Button label="Upload PDF" icon="pi pi-upload" />
        <Button
          label="Download PDF"
          icon="pi pi-download"
          disabled={selectedGenes.length === 0 || !selectedTargetName}
        /> */}
      </div>
    </div>
  );
};

export default TargetEvaluationBar;
