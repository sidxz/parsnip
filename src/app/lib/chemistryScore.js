import { useConstantsStore } from "@/app/stores/useConstantStore";
import { safeGet } from "./helpers";

export function computeChemistryScore(qaw, section2res, section3res, answers) {
  const { get } = useConstantsStore.getState();

  const Ranking__Impact_Of_Chemical_Inhibition_In_Vivo = safeGet(
    get,
    "Ranking__Impact_Of_Chemical_Inhibition_In_Vivo",
    "Ranking__Impact_Of_Chemical_Inhibition_In_Vivo"
  );
  const Ranking__Impact_Of_Chemical_Inhibition_Replicating_In_Vitro = safeGet(
    get,
    "Ranking__Impact_Of_Chemical_Inhibition_Replicating_In_Vitro",
    "Ranking__Impact_Of_Chemical_Inhibition_Replicating_In_Vitro"
  );
  const Ranking__Impact_Of_Chemical_Inhibition_Non_Replicating_In_Vitro =
    safeGet(
      get,
      "Ranking__Impact_Of_Chemical_Inhibition_Non_Replicating_In_Vitro",
      "Ranking__Impact_Of_Chemical_Inhibition_Non_Replicating_In_Vitro"
    );
  const Sec3_Perfect_Sum = safeGet(get, "Sec3_Perfect_Sum", "Sec3_Perfect_Sum");

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

  const CATEGORY_SCORES_DEFAULT = {
    noLiabilities: 1,
    lowConcLiabilities: 1,
    unknownConcLiabilities: 0.75,
    highConcLiabilities: 0,
    geneCompensation: 0.7,
  };

  const CATEGORY_SCORES = safeGet(
    get,
    "Liability_Category_Scores",
    CATEGORY_SCORES_DEFAULT
  );

  let la1 = answers["5A1"] === "NO" ? CATEGORY_SCORES["noLiabilities"] : 1;

  let la2 =
    answers["5A2"] === "NO"
      ? CATEGORY_SCORES["highConcLiabilities"]
      : answers["5A2"] === "UNKNOWN"
      ? CATEGORY_SCORES["unknownConcLiabilities"]
      : CATEGORY_SCORES["lowConcLiabilities"];

  let la3 = answers["5A3"] === "YES" ? CATEGORY_SCORES["geneCompensation"] : 1;

  //const liability_multiplier = mul(["5A1", "5A2", "5A3"]);
  const liability_multiplier = la1 * la2 * la3;

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
