import { useQuestionStore } from "../stores/useQuestionStore";

/**
 * Section 6A
 * Excel spec:
 * 6a = 6a1 + 6a2 + IF(6a2 = N,6a3) + 6a4a + 6a4b
 *    + IF(6a4a + 6a4b = 2 or 4, 6a4c)
 *    + IF(6a4a + 6a4b = 6a4c = 0, 6a5)
 *    + 6a6 + IF(6a6 = Y, 6a6a) + IF(6a6 = Y and 6a6a ≠ Y, 6a7)
 *
 * Notes:
 * - We use raw `answers` for conditions (YES/NO/UNKNOWN).
 * - We use numeric `qaw` for the values to add.
 * - If your schema doesn't have 6A4A/6A4B/6A4C yet (only "6A4"),
 *   they will be treated as 0 by default—map as needed in your pipeline.
 * - Cap is not enforced here (your section total target is 15; apply outside if desired).
 */
export function computeSection6(answers, qaw) {
  const answerWeightMap = useQuestionStore.getState().answerWeightMap;
  const val = (k) => Number(qaw?.[k] ?? 0);
  const norm = (x) =>
    String(x ?? "")
      .trim()
      .toUpperCase();
  const isYes = (k) => ["Y", "YES", "1"].includes(norm(answers?.[k]));
  const isNo = (k) => ["N", "NO", "0"].includes(norm(answers?.[k]));
  const isNone = (k) => ["NONE", "NA", "N/A"].includes(norm(answers?.[k]));

  // -------- 6A --------
  const sumA4Yes = (isYes("6A4A") ? 2 : 0) + (isYes("6A4B") ? 2 : 0);

  const I_6A =
    val("6A1") +
    val("6A2") +
    (isNo("6A2") ? val("6A3") : 0) +
    val("6A4A") +
    val("6A4B") +
    (sumA4Yes === 2 || sumA4Yes === 4 ? val("6A4C") : 0) +
    (!isYes("6A4A") &&
    !isYes("6A4B") &&
    !isYes("6A4C") &&
    val("6A4A") === 0 &&
    val("6A4B") === 0 &&
    val("6A4C") === 0
      ? val("6A5")
      : 0) +
    val("6A6") +
    (isYes("6A6") ? val("6A6A") : 0) +
    (isYes("6A6") && !isYes("6A6A") ? val("6A7") : 0);

  // -------- 6B --------
  // Few reusable flags (keeps expressions short & readable)
  const b1dY = isYes("6B1D"),
    b1dN = isNo("6B1D");
  const b1aY = isYes("6B1A"),
    b1aN = isNo("6B1A");
  const b3dY = isYes("6B3D"),
    b3dN = isNo("6B3D");
  const b3aY = isYes("6B3A");

  const autofill_6B5A_H = answerWeightMap["6B5A"].find(a => a.answer === "HIGH")?.weight;
  const autofill_6B5B_H = answerWeightMap["6B5B"].find(a => a.answer === "HIGH")?.weight;

  const I_6B =
    val("6B1D") +
    (b1dN ? val("6B1A") : 0) +
    (b1dN && b1aY ? val("6B1B1") : 0) +
    (isYes("6B1B1") ? val("6B1B2") : 0) +
    (b1aY ? val("6B2A") : 0) +
    // CHANGE: 6B2B is scored if 6B1A=Y AND 6B1B1≠Y (doc table)
    (b1aY && !isYes("6B1B1") ? val("6B2B") : 0) +
    (b1aY ? val("6B2C") : 0) +
    val("6B3D") +
    // CHANGE: 6B3A is NOT scored if 6B1D=Y OR 6B1A=Y
    (b3dN && !b1dY && !b1aY ? val("6B3A") : 0) +
    (b3dN && b3aY ? val("6B3B1") : 0) +
    (isYes("6B3B1") ? val("6B3B2") : 0) +
    (b3aY ? val("6B4A") : 0) +
    // CHANGE: 6B4B is NOT scored if 6B3B1=Y
    (b3aY && !isYes("6B3B1") ? val("6B4B") : 0) +
    (b1aY ? val("6B4C") : 0) +
    // CHANGE: 6B3C1/6B3C2 NOT scored if 6B1D=Y OR 6B1A=Y
    (b3aY && !b1dY && !b1aY ? val("6B3C1") : 0) +
    (b1aY && !b1dY ? val("6B3C2") : 0) + // same guard as table text indicates
    (b1dY ? autofill_6B5A_H : val("6B5A")) +
    (b1aN ? val("6B5B"): (b3dY ? autofill_6B5B_H : 0));

  //-------6C--------

  const IF_6C_6None_add_6C3 = isNone("6C6") ? val("6C3") : 0;
  const IF_6C_6None_add_6C4 = isNone("6C6") ? val("6C4") : 0;

  const I_6C =
    val("6C6") +
    val("6C7") +
    IF_6C_6None_add_6C3 +
    IF_6C_6None_add_6C4 +
    val("6C1") +
    val("6C5B");

  console.log("Section 6C Intermediate+++++++++")
  console.log("6C6=", val("6C6"))
  console.log("6C7=", val("6C7"))
  console.log("IF_6C_6None_add_6C3=", IF_6C_6None_add_6C3)
  console.log("IF_6C_6None_add_6C4=", IF_6C_6None_add_6C4)
  console.log("6C1=", val("6C1"))
  console.log("6C5B=", val("6C5B"))
  console.log("I_6C=", I_6C)

  // -------6D--------

  // Stage ranks from questions.json (constants)
  const STAGE_RANK = {
    NONE: 0,
    "SCREENING HIT": 3,
    HA: 4,
    H2L: 5,
    LO: 6,
    SP: 7,
    CANDIDATE: 8,
    CLINIC: 9,
    DRUG: 10,
  };

  const stage = norm(answers?.["6C6"]);
  const rank = STAGE_RANK[stage] ?? 0;

  // Determine which 6D5* items are allowed by 6C6
  let allowedD5 = [];
  if (rank < STAGE_RANK["H2L"]) {
    // none
    allowedD5 = [];
  } else if (rank < STAGE_RANK["LO"]) {
    // only a-b
    allowedD5 = ["6D5A", "6D5B"];
  } else if (rank < STAGE_RANK["SP"]) {
    // only a-f
    allowedD5 = ["6D5A", "6D5B", "6D5C", "6D5D", "6D5E", "6D5F"];
  } else if (rank === STAGE_RANK["SP"]) {
    // SP → a-g
    allowedD5 = ["6D5A", "6D5B", "6D5C", "6D5D", "6D5E", "6D5F", "6D5G"];
  } else if (rank === STAGE_RANK["CANDIDATE"]) {
    // Candidate → a-h
    allowedD5 = [
      "6D5A",
      "6D5B",
      "6D5C",
      "6D5D",
      "6D5E",
      "6D5F",
      "6D5G",
      "6D5H",
    ];
  } else if (rank === STAGE_RANK["CLINIC"]) {
    // Clinical → a-k
    allowedD5 = [
      "6D5A",
      "6D5B",
      "6D5C",
      "6D5D",
      "6D5E",
      "6D5F",
      "6D5G",
      "6D5H",
      "6D5I",
      "6D5J",
      "6D5K",
    ];
  } else if (rank >= STAGE_RANK["DRUG"]) {
    // Drug → a-l
    allowedD5 = [
      "6D5A",
      "6D5B",
      "6D5C",
      "6D5D",
      "6D5E",
      "6D5F",
      "6D5G",
      "6D5H",
      "6D5I",
      "6D5J",
      "6D5K",
      "6D5L",
    ];
  }

  const IF_6D_1Y_add_2 = isYes("6D1") ? val("6D2") : 0;
  const sumD5 = allowedD5.reduce((acc, k) => acc + val(k), 0);

  const I_6D = val("6D1") + IF_6D_1Y_add_2 + val("6D3") + val("6D4") + sumD5;

  console.log("Section 6A Intermediate =", I_6A);
  console.log("Section 6B Intermediate =", I_6B);
  console.log("Section 6C Intermediate =", I_6C);
  console.log("Section 6D Intermediate =", I_6D);

  return {
    I_6A: I_6A,
    I_6B: I_6B,
    I_6C: I_6C,
    I_6D: I_6D,
    Sec6_Sum: I_6A + I_6B + I_6C + I_6D,
  };
}
