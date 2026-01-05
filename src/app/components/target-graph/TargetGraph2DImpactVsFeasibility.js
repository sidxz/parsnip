"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useTargetsStore } from "@/app/stores/useTargetStore";
import Loading from "../ui/Loading";

const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Loading message="Plotting Graph." />,
});

/**
 * 2D: Composite Impact (TI) vs Feasibility
 * TI = wChem * chemicalInhibitionScore + wGen * geneticInhibitionScore
 *
 * Props:
 * - scores: { chemistryScore?: number, geneticScore?: number, likelihoodScore?: number }
 * - evaluatedTarget: string
 * - weights (optional): { wChem?: number, wGen?: number }
 */
export default function TargetGraph2DImpactVsFeasibility({
  scores,
  evaluatedTarget = "",
  weights = { wChem: 0.5, wGen: 0.5 },
}) {
  const { targets, loadingTargets } = useTargetsStore();

  const { wChem, wGen } = weights;

  // Guard: keep sane defaults if someone passes weird weights
  const safeWeights = useMemo(() => {
    const wc = Number.isFinite(wChem) ? wChem : 0.5;
    const wg = Number.isFinite(wGen) ? wGen : 0.5;
    const sum = wc + wg;
    // Normalize to sum=1 to keep TI on 0-100 scale assuming inputs are 0-100
    if (!Number.isFinite(sum) || sum <= 0) return { wc: 0.5, wg: 0.5 };
    return { wc: wc / sum, wg: wg / sum };
  }, [wChem, wGen]);

  if (loadingTargets) {
    return (
      <div className="flex justify-content-center align-items-center">
        Loading targets...
      </div>
    );
  }

  // Keep only targets with all needed numeric scores
  const valid = targets.filter(
    (t) =>
      Number.isFinite(t?.chemicalInhibitionScore) &&
      Number.isFinite(t?.geneticInhibitionScore) &&
      Number.isFinite(t?.likelihoodScore)
  );

  // Composite Impact (TI) for each target
  const x = valid.map(
    (t) =>
      safeWeights.wc * t.chemicalInhibitionScore +
      safeWeights.wg * t.geneticInhibitionScore
  );

  // Feasibility (display label preferred)
  const y = valid.map((t) => t.likelihoodScore);

  const labels = valid.map((t) => `${t.targetName || "Unknown"}`);

  const trace1 = {
    x,
    y,
    mode: "markers+text",
    type: "scatter",
    text: labels,
    textposition: "top center",
    textfont: { size: 10 },
    marker: {
      size: 9,
      opacity: 0.85,
      color: "rgba(1, 120, 168, 1)",
      symbol: "circle",
      line: { color: "rgba(217,217,217,0.20)", width: 0.7 },
    },
    name: "TBDA Targets",
    hovertemplate:
      "Target: %{text}<br>" +
      "Composite Impact: %{x:.1f}<br>" +
      "Feasibility: %{y:.1f}<br>" +
      `<br><i>TI = ${safeWeights.wc.toFixed(2)}·CI + ${safeWeights.wg.toFixed(
        2
      )}·GI</i>` +
      "<extra></extra>",
  };

  // Highlighted evaluated target point, if provided
  const tiYourTarget =
    Number.isFinite(scores?.chemistryScore) && Number.isFinite(scores?.geneticScore)
      ? safeWeights.wc * scores.chemistryScore + safeWeights.wg * scores.geneticScore
      : null;

  const trace2 = {
    x: Number.isFinite(tiYourTarget) ? [tiYourTarget] : [],
    y: Number.isFinite(scores?.likelihoodScore) ? [scores.likelihoodScore] : [],
    mode: "markers+text",
    type: "scatter",
    text: evaluatedTarget ? [evaluatedTarget] : ["Your Target"],
    textposition: "right center",
    textfont: { size: 11 },
    marker: {
      size: 14,
      symbol: "diamond",
      color: "rgba(30, 224, 0, 1)",
      opacity: 0.95,
      line: { color: "rgb(204,204,204)", width: 1.5 },
    },
    name: "Your Target",
    hovertemplate:
      "Evaluated Target: " +
      (evaluatedTarget || "Your Target") +
      "<br>" +
      "Composite Impact: %{x:.1f}<br>" +
      "Feasibility: %{y:.1f}<br>" +
      "<extra></extra>",
  };

  const layout = {
    height: 650,
    width: 650,
    margin: { l: 50, r: 10, t: 20, b: 55 },
    xaxis: {
      title: { text: "Impact", font: { size: 12, color: "#7f7f7f" } },
      range: [0, 100],
      zeroline: false,
    },
    yaxis: {
      title: { text: "Feasibility", font: { size: 12, color: "#7f7f7f" } },
      range: [0, 100],
      zeroline: false,
    },
    // Optional: light quadrant guides (kept subtle)
    shapes: [
      {
        type: "line",
        x0: 50,
        x1: 50,
        y0: 0,
        y1: 100,
        line: { width: 1, color: "rgba(127,127,127,0.25)" },
      },
      {
        type: "line",
        x0: 0,
        x1: 100,
        y0: 50,
        y1: 50,
        line: { width: 1, color: "rgba(127,127,127,0.25)" },
      },
    ],
  };

  return (
    <Plot
      className="flex"
      data={[trace1, trace2]}
      layout={layout}
      config={{
        displayModeBar: false,
        responsive: true,
      }}
    />
  );
}
