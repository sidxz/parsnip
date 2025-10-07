"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
});

export default function TargetGraph() {
  function generateRandomArray(length, min, max) {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return arr;
  }

  const x = generateRandomArray(123, 1, 100);
  const y = generateRandomArray(123, 1, 100);
  const z = generateRandomArray(123, 1, 100);

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
    hovertemplate:
      "Chemical Inhibition: %{x}<br>" +
      "Genetic Inhibition: %{y}<br>" +
      "Likelihood: %{z}",
  };

  const trace2 = {
    x: [46],
    y: [25],
    z: [55],
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
