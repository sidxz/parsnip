import { useQuestionStore } from "@/app/stores/useQuestionStore";
import { generateWeightedAnswerMatrix } from "./helpers";
import { computeSection2 } from "./section2";
import { computeSection3 } from "./section3";
import { computeSection4 } from "./section4";
import { computeSection5 } from "./section5";
import { computeChemistryScore } from "./chemistryScore";
import { computeGeneticScore } from "./geneticScore";
import { computeSection6 } from "./section6";

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

  // Section 6
  const section6res = computeSection6(answers, weightedMatrix);
  const likelihoodScore = section6res.Sec6_Sum;

  // Final Score
  score = {
    chemistryScore: Number(chemistryScore.chemistry_score.toFixed(0)),
    geneticScore: Number(geneticScore.genetic_score.toFixed(0)),
    likelihoodScore: Number(likelihoodScore.toFixed(0)),
  };

  console.log("Final Score =", score);
  return score;
}
