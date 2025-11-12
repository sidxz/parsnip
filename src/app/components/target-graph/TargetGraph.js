"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useTargetsStore } from "@/app/stores/useTargetStore";
import Loading from "../ui/Loading";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Loading message="Plotting Graph." />,
});

export default function TargetGraph({ scores, evaluatedTarget = "" }) {
  const {
    targets,
    loadingTargets,
    targetsError,
    loadTargets,
    filterTargetsByName,
  } = useTargetsStore();

  if (loadingTargets) {
    return (
      <div className="flex justify-content-center align-items-center">
        Loading targets...
      </div>
    );
  }

  // Keep only targets with all three numeric scores
  const valid = targets.filter(
    (t) =>
      Number.isFinite(t?.chemicalInhibitionScore) &&
      Number.isFinite(t?.geneticInhibitionScore) &&
      Number.isFinite(t?.likelihoodScore)
  );

  const x = valid.map((t) => t.chemicalInhibitionScore);
  const y = valid.map((t) => t.geneticInhibitionScore);
  const z = valid.map((t) => t.likelihoodScore);

  const hoverText = valid.map((t) => {
    const acc = Array.isArray(t.accessionNumber)
      ? t.accessionNumber.join(", ")
      : t.accessionNumber ?? "";
    return `${t.targetName || "Unknown"} (${acc})`;
  });


  const labels = valid.map((t) => {
    const acc = Array.isArray(t.accessionNumber)
      ? t.accessionNumber.join(", ")
      : t.accessionNumber ?? "";
    //return `${t.targetName || "Unknown"}${acc ? ` (${acc})` : ""}`;
    return `${t.targetName || "Unknown"}`;
  });

  const trace1 = {
    x,
    y,
    z,
    mode: "markers+text",
    type: "scatter3d",
    text: labels, // <= shown on the chart
    textposition: "bottom center", // options: 'top left', 'middle center', etc.
    textfont: { size: 10 },
    marker: {
      size: 7, // Increased marker size
      opacity: 0.8,
      color: "rgba(1, 120, 168, 1)",
      symbol: "circle",
      line: {
        color: "rgba(217,217,217,0.14)",
        width: 0.5,
      },
    },
    name: "TBDA Targets",
    //text: hoverText,
    hovertemplate:
      "Target: %{text}<br>" +
      "Chemical Inhibition: %{x}<br>" +
      "Genetic Inhibition: %{y}<br>" +
      "Likelihood: %{z}",
  };

  const trace2 = {
    x: scores?.chemistryScore ? [scores.chemistryScore] : [],
    y: scores?.geneticScore ? [scores.geneticScore] : [],
    z: scores?.likelihoodScore ? [scores.likelihoodScore] : [],
    mode: "markers+text",
    type: "scatter3d",
    text: labels, // <= shown on the chart
    textposition: "right center", // options: 'top left', 'middle center', etc.
    textfont: { size: 10 },
    marker: {
      size: 14, // Increased size for highlighted target
      symbol: "diamond",
      color: "rgba(30, 224, 0, 1)",
      opacity: 0.9,
      line: {
        color: "rgb(204,204,204)",
        width: 1.5,
      },
    },
    name: "Your Target",
    hovertemplate:
      "Evaluated Target: " +
      evaluatedTarget +
      "<br>" +
      "Chemical Inhibition: %{x}<br>" +
      "Genetic Inhibition: %{y}<br>" +
      "Likelihood: %{z}",
  };

  const data = [trace1, trace2];

  const layout = {
    height: 800,
    width: 700,
    margin: { l: 10, r: 10, t: 0, b: 0 },
    scene: {
      xaxis: {
        title: {
          text: "Chemical Inhibition",
          font: { size: 12, color: "#7f7f7f" },
        },
        range: [0, 100],
      },
      yaxis: {
        title: {
          text: "Genetic Inhibition",
          font: { size: 12, color: "#7f7f7f" },
        },
        range: [0, 100],
      },
      zaxis: {
        title: { text: "Likelihood", font: { size: 12, color: "#7f7f7f" } },
        range: [0, 100],
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }, // move the camera farther out
        center: { x: 0, y: 0, z: 0 },
      },
    },
  };

  return (
    <Plot
      className="flex"
      data={data}
      layout={layout}
      config={{
        displayModeBar: false,
        cameraUpdatemode: "render",
        responsive: true,
      }}
    />
  );
}
