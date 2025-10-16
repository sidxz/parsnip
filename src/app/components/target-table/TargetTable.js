import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterService } from "primereact/api";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { useTargetsStore } from "@/app/stores/useTargetStore";

const registerRangeRule = (ruleName) => {
  if (!FilterService.filters[ruleName]) {
    FilterService.register(ruleName, (fieldValue, filterValue) => {
      if (fieldValue === null || fieldValue === undefined) return false;
      const v = Number(fieldValue);
      if (Number.isNaN(v)) return false;

      const hasMin =
        filterValue?.min !== null && filterValue?.min !== undefined && filterValue.min !== "";
      const hasMax =
        filterValue?.max !== null && filterValue?.max !== undefined && filterValue.max !== "";

      if (!hasMin && !hasMax) return true;
      if (hasMin && v < Number(filterValue.min)) return false;
      if (hasMax && v > Number(filterValue.max)) return false;
      return true;
    });
  }
};

const RangeFilter = ({ value, onChange }) => {
  const current = value || { min: 0, max: null };

  return (
    <div className="flex items-center gap-2 p-2">
      <InputNumber
        value={current.min ?? 0}
        onValueChange={(e) => onChange({ ...current, min: e.value })}
        inputClassName="w-20"
      />
      <InputNumber
        value={current.max ?? null}
        onValueChange={(e) => onChange({ ...current, max: e.value })}
        placeholder="to"
        inputClassName="w-20"
      />
    </div>
  );
};

const TargetTable = () => {
  const { targets, loadingTargets } = useTargetsStore();

  useEffect(() => {
    registerRangeRule("custom_chemicalInhibitionScore");
    registerRangeRule("custom_geneticInhibitionScore");
    registerRangeRule("custom_likelihoodScore");
  }, []);

  const [filters, setFilters] = useState({
    targetName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    chemicalInhibitionScore: {
      value: { min: 0, max: null },
      matchMode: FilterMatchMode.CUSTOM,
    },
    geneticInhibitionScore: {
      value: { min: 0, max: null },
      matchMode: FilterMatchMode.CUSTOM,
    },
    likelihoodScore: {
      value: { min: 0, max: null },
      matchMode: FilterMatchMode.CUSTOM,
    },
  });

  const setRange = (field) => (nextRange) =>
    setFilters((prev) => ({
      ...prev,
      [field]: { value: nextRange, matchMode: FilterMatchMode.CUSTOM },
    }));

  return (
    <div className="card w-full">
      <DataTable
        value={targets || []}
        loading={loadingTargets}
        filterDisplay="row"
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        
      >
        <Column
          field="targetName"
          header="Target Name"
          sortable
          filter
          showFilterMenu={false}
          filterPlaceholder="Search"
        />
        <Column
          field="chemicalInhibitionScore"
          header="Chemical Inhibition"
          sortable
          filter
          filterMatchMode="custom"
          showFilterMenu={false}
          filterElement={
            <RangeFilter
              value={filters.chemicalInhibitionScore.value}
              onChange={setRange("chemicalInhibitionScore")}
            />
          }
          filterFunction
        />
        <Column
          field="geneticInhibitionScore"
          header="Genetic Inhibition"
          sortable
          filter
          filterMatchMode="custom"
          showFilterMenu={false}
          filterElement={
            <RangeFilter
              value={filters.geneticInhibitionScore.value}
              onChange={setRange("geneticInhibitionScore")}
            />
          }
          filterFunction
        />
        <Column
          field="likelihoodScore"
          header="Likelihood"
          sortable
          filter
          filterMatchMode="custom"
          showFilterMenu={false}
          filterElement={
            <RangeFilter
              value={filters.likelihoodScore.value}
              onChange={setRange("likelihoodScore")}
            />
          }
          filterFunction
        />
      </DataTable>
    </div>
  );
};

export default TargetTable;
