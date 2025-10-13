import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { useTargetsStore } from "@/app/stores/useTargetStore";

const TargetTable = () => {
  const {
    targets,
    loadingTargets,
    targetsError,
    loadTargets,
    filterTargetsByName,
  } = useTargetsStore();

  return (
    <div className="card w-full">
      <DataTable value={targets} loading={loadingTargets}>
        <Column field="targetName" header="Target Name" />
        <Column field="chemicalInhibitionScore" header="Chemical Inhibition" />
        <Column field="geneticInhibitionScore" header="Genetic Inhibition" />
        <Column field="likelihoodScore" header="Likelihood" />
      </DataTable>
    </div>
  );
};

export default TargetTable;
