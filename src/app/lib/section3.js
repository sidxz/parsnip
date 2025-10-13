/**
 * Compute Section 3 scores with intermediate values
 * @param {Object} qaw - Question Answer Weight map
 * @returns {Object} Section 3 scoring object
 */
export function computeSection3(qaw) {
  const val = (k) => qaw[k] ?? 0;

  // --- 3A1 - R score ---
  const I3_R_Score = val("3A1") > 10 ? 1 : 0;

  // --- Binding inhibition ---
  const I3_Binding_Inhibition_Sum = val("3B1") + val("3B2");
  const I3_Binding_Inhibition_Score = I3_Binding_Inhibition_Sum > 10 ? 1 : 0;

  // --- R + B/I ---
  const I3_R_BI_Score = I3_R_Score + I3_Binding_Inhibition_Score > 1 ? 1 : 0;

  // --- OE or UE ---
  const I3_OE_UE_Sum = val("3A2") + val("3A3");
  const I3_OE_UE_Score = I3_OE_UE_Sum > 10 ? 1 : 0;

  // --- Pathway ---
  const I3_Pathway_Score = val("3A4") > 10 ? 1 : 0;

  // --- OE/UE & Pathw & B/I ---
  const I3_OE_UE_Pathw_BI_Score =
    I3_OE_UE_Score + I3_Pathway_Score + I3_Binding_Inhibition_Score > 2 ? 1 : 0;

  // --- Mouse Sum ---
  const I3_Mouse_Sum = val("2A4A") + val("2A4B");
  const I3_Mouse_Score = I3_Mouse_Sum > 4 ? 1 : 0;

  // --- Override Genetics ---
  const I3_Override_Genetics_Score =
    I3_R_BI_Score + I3_Mouse_Score > 1 ||
    I3_OE_UE_Pathw_BI_Score + I3_Mouse_Score > 1;

  // --- Final section 3 sum ---
  const Sec3_Sum =
    I3_OE_UE_Score +
    I3_R_Score +
    I3_Pathway_Score +
    I3_Binding_Inhibition_Score;

  return {
    I3_R_Score,
    I3_Binding_Inhibition_Sum,
    I3_Binding_Inhibition_Score,
    I3_R_BI_Score,
    I3_OE_UE_Sum,
    I3_OE_UE_Score,
    I3_Pathway_Score,
    I3_OE_UE_Pathw_BI_Score,
    I3_Mouse_Sum,
    I3_Mouse_Score,
    I3_Override_Genetics_Score,
    Sec3_Sum,
  };
}
