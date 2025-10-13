import {
  Ranking__Impact_Of_Chemical_Inhibition_In_Vivo,
  Ranking__Impact_Of_Chemical_Inhibition_Replicating_In_Vitro,
  Ranking__Impact_Of_Chemical_Inhibition_Non_Replicating_In_Vitro,
  Sec3_Perfect_Sum,
} from "./constants";

export function computeChemistryScore(qaw, section2res, section3res) {
  const sum = (keys) => keys.reduce((acc, k) => acc + (qaw[k] ?? 0), 0);
  const mul = (keys) => keys.reduce((acc, k) => acc * (qaw[k] ?? 1), 1);

  const primary_chemistry_score =
    Ranking__Impact_Of_Chemical_Inhibition_In_Vivo * section2res.I2_A +
    Ranking__Impact_Of_Chemical_Inhibition_Replicating_In_Vitro *
      section2res.I2_B +
    Ranking__Impact_Of_Chemical_Inhibition_Non_Replicating_In_Vitro *
      section2res.I2_C;

  const evidence_for_on_target_activity =
    section3res.I3_R_BI_Score + section3res.I3_OE_UE_Pathw_BI_Score > 0
      ? 1
      : section3res.Sec3_Sum / Sec3_Perfect_Sum;

  const liability_multiplier = mul(["5A1", "5A2", "5A3"]);

  const chemistry_score =
    evidence_for_on_target_activity *
    primary_chemistry_score *
    liability_multiplier;

  const res = {
    primary_chemistry_score,
    evidence_for_on_target_activity,
    liability_multiplier,
    chemistry_score,
  };
  return res;
}
