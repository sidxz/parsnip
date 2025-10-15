"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useTargetsStore } from "@/app/stores/useTargetStore";
import { ProgressSpinner } from "primereact/progressspinner";
import Loading from "../ui/Loading";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => (
      <Loading message="Plotting Graph."/>
  ),
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
    return <div className="flex justify-content-center align-items-center">Loading targets...</div>;
  }

  console.log("Targets loaded:", targets);

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
  console.log("Hover texts:", hoverText);

  const trace1 = {
    x: x,
    y: y,
    z: z,
    mode: "markers",
    type: "scatter3d",
    marker: {
      size: 6,
      opacity: 0.8,
      color: "rgba(1, 120, 168, 1)", // Marker color (can use hex, rgb, rgba)
      symbol: "circle", // Options: "circle", "square", "diamond", "cross", "x", "triangle-up", etc.
      line: {
        color: "rgba(217,217,217,0.14)",
        width: 0.5,
      },
    },
    name: "TBDA Targets",
    text: hoverText,
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
    mode: "markers", // Options: "markers", "lines", "lines+markers"
    type: "scatter3d", // For 3D scatter plot
    marker: {
      size: 8, // Marker size
      symbol: "diamond", // Options: "circle", "square", "diamond", "cross", "x", "triangle-up", etc.
      color: "rgba(30, 224, 0, 1)", // Marker color (can use hex, rgb, rgba)
      opacity: 0.8, // Marker opacity (0 to 1)
      line: {
        color: "rgb(204,204,204)", // Border color
        width: 1, // Border width
      },
    },
    name: "Your Target", // Legend name
    text: ["Custom label"], // Optional: hover text
    visible: true, // Show/hide trace
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
    height: 700,
    width: 800,
    margin: { l: 10, r: 10, t: 0, b: 0 },
    scene: {
      xaxis: {
        title: {
          text: "Chemical Inhibition",
          font: { size: 12, color: "#7f7f7f" },
        },
      },
      yaxis: {
        title: {
          text: "Genetic Inhibition",
          font: { size: 12, color: "#7f7f7f" },
        },
      },
      zaxis: {
        title: {
          text: "Likelihood",
          font: { size: 12, color: "#7f7f7f" },
        },
      },
    },
  };

  return (
    <Plot
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
