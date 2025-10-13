export function createAnswerWeightMap(questions) {
  const answerWeightMap = {};

  questions?.forEach((question) => {
    const identification = question.identification;
    const possibleAnswers = question.possibleAnswers || [];

    possibleAnswers.forEach((answer) => {
      const answerText = answer.answer;
      const weight =
        answer.weight !== null && answer.weight !== undefined
          ? answer.weight
          : 0;

      if (!answerWeightMap[identification]) {
        answerWeightMap[identification] = [];
      }

      answerWeightMap[identification].push({
        answer: answerText,
        weight: weight,
      });
    });
  });

  return answerWeightMap;
}

export function generateWeightedAnswerMatrix(answerWeightMap, answers) {
  const qaw = {};

  // Iterate through each question id and its selected answer
  Object.entries(answers).forEach(([questionId, selectedAnswer]) => {
    // Check if this question exists in the weight map
    if (answerWeightMap[questionId]) {
      const possibleAnswers = answerWeightMap[questionId];

      // Find the matching answer object
      const matched = possibleAnswers.find(
        (a) => a.answer.toUpperCase() === selectedAnswer.toUpperCase()
      );

      if (matched) {
        qaw[questionId] = matched.weight;
      } else {
        qaw[questionId] = 0; // fallback if no match is found
      }
    }
  });

  console.log("Answers with Weights:");
  console.log(JSON.stringify(qaw, null, 4));

  return qaw;
}



export const safeGet = (getFn, key, label) => {
  const value = getFn(key);
  if (value === undefined) {
    console.error(
      `Missing required constant: ${label} (${key})`
    );
    throw new Error(`Missing required constant: ${label}`);
  }
  return value;
};