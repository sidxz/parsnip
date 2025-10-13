"use client";
import { useVulnerabilityStore } from "@/app/stores/useVulnerabilityStore";
import { useConstantsStore } from "@/app/stores/useConstantStore";
import { safeGet } from "./helpers";

/* =========================
   UTILITIES
   ========================= */
const toNum = (x) => {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
};

const isEssential = (x) => String(x || "").toLowerCase() === "essential";

const meanRounded1 = (arr) => {
  const vals = arr.map(Number).filter((x) => Number.isFinite(x));
  if (!vals.length) return null;
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round(m * 10) / 10;
};


/* =========================
   MAIN
   ========================= */
export function computeSection4(qaw, accessionNumber) {
  const { get } = useConstantsStore.getState();
  const { getByAccession } = useVulnerabilityStore.getState();

  // --- Required constants
  const ranking_standard_media = safeGet(
    get,
    "ranking_standard_media",
    "ranking_standard_media"
  );
  const ranking_gluconeogenic_c_source = safeGet(
    get,
    "ranking_gluconeogenic_c_source",
    "ranking_gluconeogenic_c_source"
  );
  const ranking_other = safeGet(get, "ranking_other", "ranking_other");

  const Glycolytic_BEST = safeGet(get, "Glycolytic_BEST", "Glycolytic_BEST");
  const Glycolytic_MEDIAN = safeGet(
    get,
    "Glycolytic_MEDIAN",
    "Glycolytic_MEDIAN"
  );
  const Glycolytic_WORST = safeGet(get, "Glycolytic_WORST", "Glycolytic_WORST");

  const Gluconeogenic_BEST = safeGet(
    get,
    "Gluconeogenic_BEST",
    "Gluconeogenic_BEST"
  );
  const Gluconeogenic_MEDIAN = safeGet(
    get,
    "Gluconeogenic_MEDIAN",
    "Gluconeogenic_MEDIAN"
  );
  const Gluconeogenic_WORST = safeGet(
    get,
    "Gluconeogenic_WORST",
    "Gluconeogenic_WORST"
  );

  const Other_BEST = safeGet(get, "Other_BEST", "Other_BEST");
  const Other_MEDIAN = safeGet(get, "Other_MEDIAN", "Other_MEDIAN");
  const Other_WORST = safeGet(get, "Other_WORST", "Other_WORST");

  // --- Vulnerabilities
  const vulnerabilities = (getByAccession(accessionNumber) || []).map((r) => ({
    ...r,
    vulnerabilityCondition: String(
      r.vulnerabilityCondition || r.vulnerabilityabilityCondition || ""
    ).trim(),
  }));

  // --- Groups
  const glycolyticConditions = ["Biotin", "Dextrose", "Glycerol", "7H9"];
  const gluconeogenicConditions = [
    "Propionate",
    "Butyrate",
    "Oleic Acid",
    "Cholesterol",
  ];
  const otherConditions = ["Low Iron"];

  const v_glycolytic = vulnerabilities.filter((row) =>
    glycolyticConditions.includes(row.vulnerabilityCondition)
  );
  const v_gluconeogenic = vulnerabilities.filter((row) =>
    gluconeogenicConditions.includes(row.vulnerabilityCondition)
  );
  const v_other = vulnerabilities.filter((row) =>
    otherConditions.includes(row.vulnerabilityCondition)
  );

  /* =========================
     SCORERS
     ========================= */
  const calculateAdjScore = (
    certain,
    score,
    crisprEss,
    best,
    median,
    worst
  ) => {
    let normalized = 0;
    if (certain) normalized = toNum(score);
    else if (isEssential(crisprEss)) normalized = median;
    else normalized = 0.33 * worst;
    return (normalized / best) * 100;
  };

  const adjustedGlycolyticFnToApply = (
    cond,
    certain,
    score,
    crisprEss,
    tnEss
  ) => {
    switch (cond) {
      case "Biotin":
        return calculateAdjScore(
          certain,
          score,
          crisprEss,
          Glycolytic_BEST.Biotin,
          Glycolytic_MEDIAN.Biotin,
          Glycolytic_WORST.Biotin
        );
      case "Dextrose":
        return calculateAdjScore(
          certain,
          score,
          crisprEss,
          Glycolytic_BEST.Dextrose,
          Glycolytic_MEDIAN.Dextrose,
          Glycolytic_WORST.Dextrose
        );
      case "Glycerol":
        return calculateAdjScore(
          certain,
          score,
          crisprEss,
          Glycolytic_BEST.Glycerol,
          Glycolytic_MEDIAN.Glycerol,
          Glycolytic_WORST.Glycerol
        );
      case "7H9": {
        let normalized = 0;
        if (certain) normalized = toNum(score);
        else if (isEssential(crisprEss) && isEssential(tnEss))
          normalized = Glycolytic_MEDIAN["7H9"];
        else if (isEssential(crisprEss) || isEssential(tnEss))
          normalized = 0.5 * Glycolytic_MEDIAN["7H9"];
        else normalized = 0.33 * Glycolytic_WORST["7H9"];
        return (normalized / Glycolytic_BEST["7H9"]) * 100;
      }
      default:
        return null;
    }
  };

  const adjustedGluconeogenicFnToApply = (cond, certain, score, crisprEss) => {
    if (cond in Gluconeogenic_BEST)
      return calculateAdjScore(
        certain,
        score,
        crisprEss,
        Gluconeogenic_BEST[cond],
        Gluconeogenic_MEDIAN[cond],
        Gluconeogenic_WORST[cond]
      );
    return null;
  };

  const adjustedOtherFnToApply = (cond, certain, score, crisprEss) => {
    if (cond === "Low Iron")
      return calculateAdjScore(
        certain,
        score,
        crisprEss,
        Other_BEST["Low Iron"],
        Other_MEDIAN["Low Iron"],
        Other_WORST["Low Iron"]
      );
    return null;
  };

  // --- Annotate rows
  const v_glycolytic_with_adj = v_glycolytic.map((row) => ({
    ...row,
    adj_score: adjustedGlycolyticFnToApply(
      row.vulnerabilityCondition,
      row.certain,
      row.score,
      row.crisprEss,
      row.tnSeqEss
    ),
  }));

  const v_gluconeogenic_with_adj = v_gluconeogenic.map((row) => ({
    ...row,
    adj_score: adjustedGluconeogenicFnToApply(
      row.vulnerabilityCondition,
      row.certain,
      row.score,
      row.crisprEss
    ),
  }));

  const v_other_with_adj = v_other.map((row) => ({
    ...row,
    adj_score: adjustedOtherFnToApply(
      row.vulnerabilityCondition,
      row.certain,
      row.score,
      row.crisprEss
    ),
  }));

  // --- Means
  const glycolytic_mean_score = meanRounded1(
    v_glycolytic_with_adj.map((r) => r.adj_score)
  );
  const gluconeogenic_mean_score = meanRounded1(
    v_gluconeogenic_with_adj.map((r) => r.adj_score)
  );
  const other_mean_score = meanRounded1(
    v_other_with_adj.map((r) => r.adj_score)
  );

  // --- Section 4 Weights -> Component scores
  const I4_glycolytic_carbon_source = Math.round(
    ranking_standard_media * (glycolytic_mean_score ?? 0)
  );
  const I4_gluconeogenic_carbon_source = Math.round(
    ranking_gluconeogenic_c_source * (gluconeogenic_mean_score ?? 0)
  );
  const I4_Other = Math.round(ranking_other * (other_mean_score ?? 0));

  // --- Subsections
  const I4_A =
    toNum(qaw?.["4A3A"]) + toNum(qaw?.["4A3B"]) + toNum(qaw?.["4A4"]);
  const I4_B =
    I4_glycolytic_carbon_source + I4_gluconeogenic_carbon_source + I4_Other;
  const I4_C = toNum(qaw?.["4C3"]);

  const Sec4_Sum = I4_A + I4_B + I4_C;

  return {
    v_glycolytic: v_glycolytic_with_adj,
    v_gluconeogenic: v_gluconeogenic_with_adj,
    v_other: v_other_with_adj,

    glycolytic_mean_score,
    gluconeogenic_mean_score,
    other_mean_score,

    I4_glycolytic_carbon_source,
    I4_gluconeogenic_carbon_source,
    I4_Other,

    I4_A,
    I4_B,
    I4_C,

    Sec4_Sum,
  };
}
