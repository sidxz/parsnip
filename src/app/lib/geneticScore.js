import {
  Ranking__Impact_Of_Genetic_Inhibition_In_Vivo,
  Ranking__Impact_Of_Genetic_Inhibition_Replicating_In_Vitro,
  Ranking__Impact_Of_Genetic_Inhibition_Non_Replicating_In_Vitro,
  Sec3_Perfect_Sum,
} from "./constants";

export function computeGeneticScore(qaw, section4res, liability_multiplier) {
  const sum = (keys) => keys.reduce((acc, k) => acc + (qaw[k] ?? 0), 0);

  const primary_genetic_score =
    Ranking__Impact_Of_Genetic_Inhibition_In_Vivo * section4res.I4_A +
    Ranking__Impact_Of_Genetic_Inhibition_Replicating_In_Vitro *
      section4res.I4_B +
    Ranking__Impact_Of_Genetic_Inhibition_Non_Replicating_In_Vitro *
      section4res.I4_C;

  const genetic_score = primary_genetic_score * liability_multiplier;

  const res = {
    primary_genetic_score,
    genetic_score,
  };
  return res;
}
