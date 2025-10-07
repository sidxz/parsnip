import React from "react";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";

import "primeflex/primeflex.css";

const TargetEvaluationBar = () => {
  const [selectedGenes, setSelectedGenes] = React.useState([]);
  const onGeneChange = (e) => {
    setSelectedGenes(e.value);
  };

  const [targetName, setTargetName] = React.useState("");

  const genes = [
    { name: "DnaA", accessionNo: "Rv0001" },
    { name: "DnaN", accessionNo: "Rv0005" },
    { name: "RpoB", accessionNo: "Rv0667" },
    { name: "GroEL2", accessionNo: "Rv0440" },
    { name: "SodA", accessionNo: "Rv1908c" },
  ];

  return (
    <div className="flex justify-content-between align-items-center p-3 w-full surface-100">
      <div className="flex">
        <MultiSelect
          value={selectedGenes}
          onChange={(e) => onGeneChange(e.value)}
          options={genes}
          optionLabel="name"
          placeholder="Select genes for target evaluation"
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
        <Button label="Save" icon="pi pi-save" className="p-button-success" />
        <Button
          label="Reset"
          icon="pi pi-undo"
          className="p-button-secondary"
        />
        <Button label="Evaluate" icon="pi pi-check" />
        <Button label="Restore" icon="pi pi-refresh" />
        <Button label="Download PDF" icon="pi pi-download" />
      </div>
    </div>
  );
};

export default TargetEvaluationBar;
