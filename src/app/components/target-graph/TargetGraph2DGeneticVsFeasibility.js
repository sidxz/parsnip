"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useTargetsStore } from "@/app/stores/useTargetStore";
import Loading from "../ui/Loading";
import { STRING_CONSTANTS } from "@/app/lib/strings";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Loading message="Plotting Graph." />,
});

/**
 * 2D: Genetic Impact (GI) vs Feasibility
 *
 * Props:
 * - scores: { geneticScore?: number, likelihoodScore?: number }
 * - evaluatedTarget: string
 */
export default function TargetGraph2DGeneticVsFeasibility({
  scores,
  evaluatedTarget = "",
}) {
  const { targets, loadingTargets } = useTargetsStore();

  if (loadingTargets) {
    return (
      <div className="flex justify-content-center align-items-center">
        Loading targets...
      </div>
    );
  }

  // Keep only targets with needed numeric scores
  const valid = targets.filter(
    (t) =>
      Number.isFinite(t?.geneticInhibitionScore) &&
      Number.isFinite(t?.likelihoodScore)
  );

  const x = valid.map((t) => t.geneticInhibitionScore); // GI
  const y = valid.map((t) => t.likelihoodScore); // Feasibility (display label)

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
      line: {
        color: "rgba(217,217,217,0.20)",
        width: 0.7,
      },
    },
    name: "TBDA Targets",
    hovertemplate:
      "Target: %{text}<br>" +
      STRING_CONSTANTS.GENETIC_IN_AXIS +
      ": %{x:.1f}<br>" +
      STRING_CONSTANTS.LIKELIHOOD_AXIS +
      ": %{y:.1f}" +
      "<extra></extra>",
  };

  const trace2 = {
    x: Number.isFinite(scores?.geneticScore) ? [scores.geneticScore] : [],
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
      line: {
        color: "rgb(204,204,204)",
        width: 1.5,
      },
    },
    name: "Your Target",
    hovertemplate:
      "Evaluated Target: " +
      (evaluatedTarget || "Your Target") +
      "<br>" +
      STRING_CONSTANTS.GENETIC_IN_AXIS +
      ": %{x:.1f}<br>" +
      STRING_CONSTANTS.LIKELIHOOD +
      ": %{y:.1f}" +
      "<extra></extra>",
  };

  const layout = {
    height: 650,
    width: 650,
    margin: { l: 55, r: 10, t: 20, b: 55 },
    xaxis: {
      title: {
        text: STRING_CONSTANTS.GENETIC_IN_AXIS,
        font: { size: 12, color: "#7f7f7f" },
      },
      range: [0, 100],
      zeroline: false,
    },
    yaxis: {
      title: { text: STRING_CONSTANTS.LIKELIHOOD_AXIS, font: { size: 12, color: "#7f7f7f" } },
      range: [0, 100],
      zeroline: false,
    },
    // Optional subtle quadrant guides at 50/50
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
