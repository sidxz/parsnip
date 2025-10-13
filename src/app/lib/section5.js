export function computeSection5(qaw) {
  const sum = (keys) => keys.reduce((acc, k) => acc + (qaw[k] ?? 0), 0);

  const I5_A = Math.ceil(sum(["5A1", "5A2"]));

  const I5_B = Math.ceil(sum(["5A3"]));

  const I5C = Math.ceil(sum(["5B1"]));

  const Sec5_Sum = I5_A + I5_B + I5C;

  return {
    I5_A,
    I5_B,
    I5C,
    Sec5_Sum,
  };
}
