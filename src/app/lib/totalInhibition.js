export function totalInhibition(answers, qaw, chemistryScore, geneticScore) {
  console.log("Computing Total Inhibition Score...");
  console.log("Answers:", answers);

  const hasMouseModel = answers['2A4A'] === "ACTIVE" || answers['2A4B'] === "ACTIVE";

  const hasGeneticEvidenceSimple = answers['3A1'] === "YES" && answers['3B1'] === "YES";

  const hasTwoOfThreeGeneticEvidence =
    (answers['4A3A'] === "YES" && answers['3A4'] === "YES") ||
    (answers['4A3A'] === "YES" && answers['3B1'] === "YES") ||
    (answers['3A4'] === "YES" && answers['3B1'] === "YES");

  let geneticsOverride = (hasMouseModel && hasGeneticEvidenceSimple) || hasTwoOfThreeGeneticEvidence;
  console.log("Genetics Override:", geneticsOverride);

  if (geneticsOverride) {
    return {
      total_inhibition_score: chemistryScore.chemistry_score,
      override_applied: true
    };
  }

  const weightCI = 0.7;
  const  weightGI = 0.3;
  return {
      total_inhibition_score: weightCI * chemistryScore.chemistry_score + weightGI * geneticScore.genetic_score,
      override_applied: false
    };
}
