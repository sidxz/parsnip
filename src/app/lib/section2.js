/**
 * Compute Section 2 scores with intermediate values
 * @param {Object} qaw - Question Answer Weight map
 * @returns {Object} Section 2 scoring object
 */
export function computeSection2(qaw) {
  const sum = (keys) => keys.reduce((acc, k) => acc + (qaw[k] ?? 0), 0);

  // Section 2A - during infections
  const I2_A = Math.ceil(
    sum(["2A1", "2A1B", "2A2", "2A4A", "2A4B", "2A5"])
  );

  // Section 2B - replicating Mtb in vitro
  const I2_B = Math.ceil(
    sum(["2B1", "2B2", "2B4"])
  );

  // Section 2C - nonreplicating Mtb in vitro
  const I2_C = Math.ceil(
    sum(["2C3", "2C5"])
  );

  const Sec2_Sum = I2_A + I2_B + I2_C;

  return {
    I2_A,
    I2_B,
    I2_C,
    Sec2_Sum
  };
}
