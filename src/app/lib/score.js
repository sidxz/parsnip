import { useQuestionStore } from "@/app/stores/useQuestionStore";
import { generateWeightedAnswerMatrix } from "./helpers";
import { computeSection2 } from "./section2";
import { computeSection3 } from "./section3";
import { computeSection4 } from "./section4";
import { computeSection5 } from "./section5";
import { computeChemistryScore } from "./chemistryScore";
import { computeGeneticScore } from "./geneticScore";

export function calculateScore(answers, accessionNumber) {
  const answerWeightMap = useQuestionStore.getState().answerWeightMap;

  let score;

  console.log("Answer Weight Map =", answerWeightMap);
  console.log("Answers =", answers);

  const weightedMatrix = generateWeightedAnswerMatrix(answerWeightMap, answers);
  console.log("Weighted Answer Matrix =", weightedMatrix);

  // Section2
  const section2res = computeSection2(weightedMatrix);
  console.log("Section 2 Results =", section2res);

  // Section3
  const section3res = computeSection3(weightedMatrix);
  console.log("Section 3 Results =", section3res);

  // Section4
  const section4res = computeSection4(weightedMatrix, accessionNumber);
  console.log("Section 4 Results =", section4res);

  // Section5
  const section5res = computeSection5(weightedMatrix);
  console.log("Section 5 Results =", section5res);

  // Chemistry Score
  const chemistryScore = computeChemistryScore(
    weightedMatrix,
    section2res,
    section3res
  );
  console.log("Chemistry Score Results =", chemistryScore);

  // Genetic Score
  const geneticScore = computeGeneticScore(
    weightedMatrix,
    section4res,
    chemistryScore.liability_multiplier
  );
  console.log("Genetic Score Results =", geneticScore);
  // Final Score
  score = {
    chemistryScore: Number(chemistryScore.primary_chemistry_score.toFixed(2)),
    geneticScore: Number(geneticScore.primary_genetic_score.toFixed(2))
  };

  console.log("Final Score =", score);
  return score;
}
