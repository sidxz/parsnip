import React from "react";
import { useEffect, useState } from "react";

import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";

import "primeflex/primeflex.css";

const TargetEvaluationBar = ({ onEvaluate }) => {
  const [selectedGenes, setSelectedGenes] = useState([]);
  const [targetName, setTargetName] = useState("");
  const [loadingGenes, setLoadingGenes] = useState(true);

  const [genes, setGenes] = useState(null);

  useEffect(() => {
    setLoadingGenes(true);
    fetch(
      "https://raw.githubusercontent.com/sidxz/parsnip-data/refs/heads/main/data/genes.json"
    )
      .then((r) => r.json())
      .then((data) => {
        // Sort by Name (case-insensitive)
        const sorted = data.sort((a, b) =>
          a.Name.localeCompare(b.Name, undefined, { sensitivity: "base" })
        );
        setGenes(sorted);
      })
      .catch(console.error)
      .finally(() => setLoadingGenes(false));
  }, []);

  // Capitalize first letter, leave rest as-is
  const formatGeneName = (name) => {
    if (!name || typeof name !== "string") return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const onGeneChange = (e) => {
    const sel = e.value || [];
    console.log(e.value);
    setSelectedGenes(sel);
    let joined =
      sel.length > 0
        ? sel
            .map((g) => formatGeneName(g?.Name ?? ""))
            .filter(Boolean)
            .join("-")
        : "";

    setTargetName(joined);
  };

  return (
    <div className="flex justify-content-between align-items-center p-3 w-full surface-100">
      <div className="flex">
        <MultiSelect
          value={selectedGenes}
          loading={loadingGenes}
          onChange={(e) => onGeneChange(e)}
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
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />
        </div>
      </div>

      <div className="flex align-items-center"></div>
      {/* Right Section (existing buttons) */}
      <div className="flex justify-content-end gap-1">
        {/* <Button label="Save" icon="pi pi-save" className="p-button-success" />
        <Button
          label="Reset"
          icon="pi pi-undo"
          className="p-button-secondary"
        /> */}
        <Button
          label="Evaluate"
          icon="pi pi-check"
          onClick={() => onEvaluate()}
          disabled={selectedGenes.length === 0 || !targetName}
        />
        <Button label="Restore" icon="pi pi-refresh" />
        <Button
          label="Download PDF"
          icon="pi pi-download"
          disabled={selectedGenes.length === 0 || !targetName}
        />
      </div>
    </div>
  );
};

export default TargetEvaluationBar;
