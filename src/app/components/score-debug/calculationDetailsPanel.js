import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

export function CalculationDetailsPanel({ data }) {
  const { chemistryScore, geneticScore, likelihoodScore, sectionWise } = data;

  const {
    section2,
    section3,
    section4,
    section5,
    section6,
    chemistryScore: chemDetail,
    geneticScore: genDetail,
  } = sectionWise || {};

  return (
    <div className="flex gap-3 p-2 w-full">
        <div className="flex flex-column gap-3">
          {/* --- Summary cards --- */}
          <div className="grid">
            <div className="col-12 md:col-4">
              <div className="surface-100 border-round p-3 flex flex-column gap-2">
                <span className="text-xs text-color-secondary font-medium">
                  Chemistry Score
                </span>
                <span className="text-2xl font-semibold text-primary">
                  {chemistryScore}
                </span>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div className="surface-100 border-round p-3 flex flex-column gap-2">
                <span className="text-xs text-color-secondary font-medium">
                  Genetic Score
                </span>
                <span className="text-2xl font-semibold text-primary">
                  {geneticScore}
                </span>
              </div>
            </div>
            <div className="col-12 md:col-4">
              <div className="surface-100 border-round p-3 flex flex-column gap-2">
                <span className="text-xs text-color-secondary font-medium">
                  Feasibility Score
                </span>
                <span className="text-2xl font-semibold text-primary">
                  {likelihoodScore}
                </span>
              </div>
            </div>
          </div>

          <Divider align="left">
            <span className="text-sm font-semibold">
              Section 2 – In vitro evidence
            </span>
          </Divider>

          {/* --- Section 2 key-values --- */}
          <KeyValueGrid
            data={section2}
            labels={{
              I2_A: "I2_A",
              I2_B: "I2_B",
              I2_C: "I2_C",
              Sec2_Sum: "Section 2 Total",
            }}
          />

          <Divider align="left">
            <span className="text-sm font-semibold">
              Section 3 – Genetic & pathway evidence
            </span>
          </Divider>

          <KeyValueGrid
            data={section3}
            labels={{
              I3_R_Score: "Resistance Score",
              I3_Binding_Inhibition_Sum: "Binding Inhibition Sum",
              I3_Binding_Inhibition_Score: "Binding Inhibition Score",
              I3_R_BI_Score: "R + BI Score",
              I3_OE_UE_Sum: "OE/UE Sum",
              I3_OE_UE_Score: "OE/UE Score",
              I3_Pathway_Score: "Pathway Score",
              I3_OE_UE_Pathw_BI_Score: "OE/UE + Pathway + BI Score",
              I3_Mouse_Sum: "Mouse Sum",
              I3_Mouse_Score: "Mouse Score",
              I3_Override_Genetics_Score: "Override Genetics?",
              Sec3_Sum: "Section 3 Total",
            }}
          />

          <Divider align="left">
            <span className="text-sm font-semibold">
              Section 4 – Vulnerability index
            </span>
          </Divider>

          {/* --- Section 4 tables --- */}
          {section4 && (
            <div className="flex flex-column gap-3">
              {/* Glycolytic carbon sources */}
              {section4.v_glycolytic?.length > 0 && (
                <div>
                  <div className="flex justify-content-between align-items-center mb-2">
                    <span className="font-semibold text-sm">
                      Glycolytic carbon sources
                    </span>
                    <Tag
                      value={`Mean score: ${
                        section4.glycolytic_mean_score ?? "-"
                      }`}
                    />
                  </div>
                  <DataTable
                    value={section4.v_glycolytic}
                    size="small"
                    className="text-xs"
                    scrollable
                    scrollHeight="200px"
                  >
                    <Column field="vulnerabilityCondition" header="Condition" />
                    <Column field="vulnerabilityIndex" header="VI" />
                    <Column field="tnSeqEss" header="TnSeq" />
                    <Column field="crisprEss" header="CRISPR" />
                    <Column field="pctOfMax" header="% of max" />
                    <Column field="bin" header="Bin" />
                    <Column
                      field="adj_score"
                      header="Adj score"
                      body={(row) => row.adj_score?.toFixed(2)}
                    />
                  </DataTable>
                </div>
              )}

              {/* Gluconeogenic carbon sources */}
              {section4.v_gluconeogenic?.length > 0 && (
                <div>
                  <div className="flex justify-content-between align-items-center mb-2">
                    <span className="font-semibold text-sm">
                      Gluconeogenic carbon sources
                    </span>
                    <Tag
                      value={`Mean score: ${
                        section4.gluconeogenic_mean_score ?? "-"
                      }`}
                    />
                  </div>
                  <DataTable
                    value={section4.v_gluconeogenic}
                    size="small"
                    className="text-xs"
                    scrollable
                    scrollHeight="200px"
                  >
                    <Column field="vulnerabilityCondition" header="Condition" />
                    <Column field="vulnerabilityIndex" header="VI" />
                    <Column field="tnSeqEss" header="TnSeq" />
                    <Column field="crisprEss" header="CRISPR" />
                    <Column field="pctOfMax" header="% of max" />
                    <Column field="bin" header="Bin" />
                    <Column
                      field="adj_score"
                      header="Adj score"
                      body={(row) => row.adj_score?.toFixed(2)}
                    />
                  </DataTable>
                </div>
              )}

              {/* Other carbon sources (if any) */}
              {section4.v_other?.length > 0 && (
                <div>
                  <div className="flex justify-content-between align-items-center mb-2">
                    <span className="font-semibold text-sm">
                      Other carbon sources
                    </span>
                    <Tag
                      value={`Mean score: ${section4.other_mean_score ?? "-"}`}
                    />
                  </div>
                  <DataTable
                    value={section4.v_other}
                    size="small"
                    className="text-xs"
                    scrollable
                    scrollHeight="200px"
                  >
                    <Column field="vulnerabilityCondition" header="Condition" />
                    <Column field="vulnerabilityIndex" header="VI" />
                    <Column field="tnSeqEss" header="TnSeq" />
                    <Column field="crisprEss" header="CRISPR" />
                    <Column field="pctOfMax" header="% of max" />
                    <Column field="bin" header="Bin" />
                    <Column
                      field="adj_score"
                      header="Adj score"
                      body={(row) => row.adj_score?.toFixed(2)}
                    />
                  </DataTable>
                </div>
              )}

              {/* Section 4 aggregates */}
              <KeyValueGrid
                data={section4}
                labels={{
                  I4_glycolytic_carbon_source: "I4 – Glycolytic carbon source",
                  I4_gluconeogenic_carbon_source:
                    "I4 – Gluconeogenic carbon source",
                  I4_Other: "I4 – Other",
                  I4_A: "I4_A",
                  I4_B: "I4_B",
                  I4_C: "I4_C",
                  Sec4_Sum: "Section 4 Total",
                }}
              />
            </div>
          )}

          <Divider align="left">
            <span className="text-sm font-semibold">
              Section 5 – Translational evidence
            </span>
          </Divider>

          <KeyValueGrid
            data={section5}
            labels={{
              I5_A: "I5_A",
              I5_B: "I5_B",
              I5C: "I5_C",
              Sec5_Sum: "Section 5 Total",
            }}
          />

          <Divider align="left">
            <span className="text-sm font-semibold">
              Section 6 – Overall impact
            </span>
          </Divider>

          <KeyValueGrid
            data={section6}
            labels={{
              I_6A: "I6_A",
              I_6B: "I6_B",
              I_6C: "I6_C",
              I_6D: "I6_D",
              Sec6_Sum: "Section 6 Total",
            }}
          />

          <Divider align="left">
            <span className="text-sm font-semibold">
              Chemistry & Genetics (detail)
            </span>
          </Divider>

          <div className="grid">
            <div className="col-12 md:col-6">
              <FieldCard title="Chemistry detail">
                <KeyValueGrid
                  dense
                  data={chemDetail}
                  labels={{
                    primary_chemistry_score: "Primary chemistry score",
                    evidence_for_on_target_activity:
                      "Evidence for on-target activity",
                    liability_multiplier: "Liability multiplier",
                    chemistry_score: "Final chemistry score",
                  }}
                />
              </FieldCard>
            </div>
            <div className="col-12 md:col-6">
              <FieldCard title="Genetic detail">
                <KeyValueGrid
                  dense
                  data={genDetail}
                  labels={{
                    primary_genetic_score: "Primary genetic score",
                    genetic_score: "Final genetic score",
                  }}
                />
              </FieldCard>
            </div>
          </div>
        </div>
    </div>
  );
}

/**
 * Simple reusable key-value grid.
 * data: plain object
 * labels: { key: "Nice label" }
 */
function KeyValueGrid({ data = {}, labels = {}, dense = false }) {
  const entries = Object.entries(labels).filter(
    ([key]) => data?.[key] !== undefined
  );

  if (!entries.length) return null;

  return (
    <div className={`grid ${dense ? "text-xs" : ""}`}>
      {entries.map(([key, label]) => (
        <div key={key} className="col-12 md:col-6">
          <div className="flex justify-content-between align-items-center border-bottom-1 border-100 py-1">
            <span className="text-color-secondary mr-2">{label}</span>
            <span className="font-semibold">
              {typeof data[key] === "boolean"
                ? data[key]
                  ? "Yes"
                  : "No"
                : String(data[key])}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldCard({ title, children }) {
  return (
    <div className="surface-100 border-round p-3 flex flex-column gap-2 h-full">
      <span className="text-xs text-color-secondary font-medium">{title}</span>
      {children}
    </div>
  );
}
