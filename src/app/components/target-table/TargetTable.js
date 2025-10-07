import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';

const data = [
  {
    targetName: 'rpoB',
    chemicalInhibitionScore: 0.85,
    geneticInhibitionScore: 0.78,
    likelihoodScore: 0.92,
    bucket: '2A'
  },
  {
    targetName: 'katG',
    chemicalInhibitionScore: 0.65,
    geneticInhibitionScore: 0.72,
    likelihoodScore: 0.81,
    bucket: '3'
  },
  {
    targetName: 'inhA',
    chemicalInhibitionScore: 0.45,
    geneticInhibitionScore: 0.55,
    likelihoodScore: 0.60,
    bucket: '2C'
  },
  {
    targetName: 'embB',
    chemicalInhibitionScore: 0.90,
    geneticInhibitionScore: 0.80,
    likelihoodScore: 0.95,
    bucket: '1A'
  },
  {
    targetName: 'pncA',
    chemicalInhibitionScore: 0.70,
    geneticInhibitionScore: 0.68,
    likelihoodScore: 0.75,
    bucket: '2B'
  },
  {
    targetName: 'gyrA',
    chemicalInhibitionScore: 0.55,
    geneticInhibitionScore: 0.60,
    likelihoodScore: 0.65,
    bucket: '3'
  },
  {
    targetName: 'rpsL',
    chemicalInhibitionScore: 0.80,
    geneticInhibitionScore: 0.77,
    likelihoodScore: 0.88,
    bucket: '1B'
  },
  {
    targetName: 'ethA',
    chemicalInhibitionScore: 0.60,
    geneticInhibitionScore: 0.58,
    likelihoodScore: 0.70,
    bucket: '2C'
  },
  {
    targetName: 'fabG1',
    chemicalInhibitionScore: 0.50,
    geneticInhibitionScore: 0.52,
    likelihoodScore: 0.55,
    bucket: '3'
  },
  {
    targetName: 'Rv0678',
    chemicalInhibitionScore: 0.95,
    geneticInhibitionScore: 0.90,
    likelihoodScore: 0.98,
    bucket: '1A'
  },
  {
    targetName: 'atpE',
    chemicalInhibitionScore: 0.72,
    geneticInhibitionScore: 0.74,
    likelihoodScore: 0.80,
    bucket: '2B'
  },
  {
    targetName: 'tlyA',
    chemicalInhibitionScore: 0.68,
    geneticInhibitionScore: 0.65,
    likelihoodScore: 0.73,
    bucket: '2A'
  },
  {
    targetName: 'eis',
    chemicalInhibitionScore: 0.58,
    geneticInhibitionScore: 0.60,
    likelihoodScore: 0.62,
    bucket: '3'
  },
  {
    targetName: 'pepQ',
    chemicalInhibitionScore: 0.82,
    geneticInhibitionScore: 0.79,
    likelihoodScore: 0.90,
    bucket: '1C'
  },
  {
    targetName: 'Rv1979c',
    chemicalInhibitionScore: 0.63,
    geneticInhibitionScore: 0.67,
    likelihoodScore: 0.72,
    bucket: '2B'
  }
];

const TargetTable = () => {
  return (
    <div className="card w-full">
      <DataTable value={data} >
        <Column field="targetName" header="Target Name" />
        <Column field="chemicalInhibitionScore" header="Chemical Inhibition" />
        <Column field="geneticInhibitionScore" header="Genetic Inhibition" />
        <Column field="likelihoodScore" header="Likelihood" />
        <Column field="bucket" header="Bucket" />
      </DataTable>
    </div>
  );
};

export default TargetTable;