"use client";
import React from "react";
import dynamic from "next/dynamic";
import { useTargetsStore } from "@/app/stores/useTargetStore";
import Loading from "../ui/Loading";
import { InputSwitch } from 'primereact/inputswitch';
import { ST } from "next/dist/shared/lib/utils";
import { STRING_CONSTANTS } from "@/app/lib/strings";

// Dynamically import Plot to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <Loading message="Plotting Graph." />,
});

export default function TargetGraph3D({ scores, evaluatedTarget = "" }) {
  const { targets, loadingTargets } = useTargetsStore();
  const [showOctanes, setShowOctanes] = React.useState(false);

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

  const labels = valid.map((t) => `${t.targetName || "Unknown"}`);

  // -----------------------------
  // Optional: 3D partition planes + best octant highlight
  // -----------------------------
  const MID = 50;
  const MIN = 0;
  const MAX = 100;

  // Low-res grid for planes (keeps render light)
  const GRID = 2;
  const lin = Array.from({ length: GRID }, (_, i) => (i / (GRID - 1)) * MAX);

  const planeTraces = [];
  const guideTraces = [];

  if (showOctanes) {
    // Plane x = MID (vary y,z)
    planeTraces.push({
      type: "surface",
      x: lin.map(() => lin.map(() => MID)),
      y: lin.map((yy) => lin.map(() => yy)),
      z: lin.map(() => lin),
      showscale: false,
      opacity: 0.08,
      hoverinfo: "skip",
      name: "x=50",
      colorscale: [
        [0, "rgba(127,127,127,1)"],
        [1, "rgba(127,127,127,1)"],
      ],
    });

    // Plane y = MID (vary x,z)
    planeTraces.push({
      type: "surface",
      x: lin.map((xx) => lin.map(() => xx)),
      y: lin.map(() => lin.map(() => MID)),
      z: lin.map(() => lin),
      showscale: false,
      opacity: 0.08,
      hoverinfo: "skip",
      name: "y=50",
      colorscale: [
        [0, "rgba(127,127,127,1)"],
        [1, "rgba(127,127,127,1)"],
      ],
    });

    // Plane z = MID (vary x,y)
    planeTraces.push({
      type: "surface",
      x: lin.map((xx) => lin.map(() => xx)),
      y: lin.map(() => lin),
      z: lin.map(() => lin.map(() => MID)),
      showscale: false,
      opacity: 0.08,
      hoverinfo: "skip",
      name: "z=50",
      colorscale: [
        [0, "rgba(127,127,127,1)"],
        [1, "rgba(127,127,127,1)"],
      ],
    });

    // Best octant highlight: x>=50, y>=50, z>=50 (upper-right-top)
    // Implemented as 3 translucent faces (corner glow) to keep it lightweight.
    guideTraces.push(
      {
        type: "surface",
        x: [
          [MID, MID],
          [MID, MID],
        ],
        y: [
          [MID, MAX],
          [MID, MAX],
        ],
        z: [
          [MID, MID],
          [MAX, MAX],
        ],
        showscale: false,
        opacity: 0.12,
        hoverinfo: "skip",
        name: "Best Octant (x-face)",
        colorscale: [
          [0, "rgba(30,224,0,1)"],
          [1, "rgba(30,224,0,1)"],
        ],
      },
      {
        type: "surface",
        x: [
          [MID, MAX],
          [MID, MAX],
        ],
        y: [
          [MID, MID],
          [MID, MID],
        ],
        z: [
          [MID, MID],
          [MAX, MAX],
        ],
        showscale: false,
        opacity: 0.12,
        hoverinfo: "skip",
        name: "Best Octant (y-face)",
        colorscale: [
          [0, "rgba(30,224,0,1)"],
          [1, "rgba(30,224,0,1)"],
        ],
      },
      {
        type: "surface",
        x: [
          [MID, MAX],
          [MID, MAX],
        ],
        y: [
          [MID, MID],
          [MAX, MAX],
        ],
        z: [
          [MID, MID],
          [MID, MID],
        ],
        showscale: false,
        opacity: 0.12,
        hoverinfo: "skip",
        name: "Best Octant (z-face)",
        colorscale: [
          [0, "rgba(30,224,0,1)"],
          [1, "rgba(30,224,0,1)"],
        ],
      }
    );

    // Optional mid-lines on cube faces (improves reading partitions)
    guideTraces.push({
      type: "scatter3d",
      mode: "lines",
      hoverinfo: "skip",
      showlegend: false,
      line: { width: 2, color: "rgba(127,127,127,0.35)" },
      x: [
        // z=0 face: x=50 line (y varies)
        MID,
        MID,
        null,
        // z=0 face: y=50 line (x varies)
        MIN,
        MAX,
        null,

        // z=100 face: x=50 line (y varies)
        MID,
        MID,
        null,
        // z=100 face: y=50 line (x varies)
        MIN,
        MAX,
        null,

        // x=0 face: y=50 line (z varies)
        MIN,
        MIN,
        null,
        // x=100 face: y=50 line (z varies)
        MAX,
        MAX,
        null,

        // y=0 face: x=50 line (z varies)
        MID,
        MID,
        null,
        // y=100 face: x=50 line (z varies)
        MID,
        MID,
        null,
      ],
      y: [
        MIN,
        MAX,
        null,
        MID,
        MID,
        null,

        MIN,
        MAX,
        null,
        MID,
        MID,
        null,

        MID,
        MID,
        null,
        MID,
        MID,
        null,

        MIN,
        MIN,
        null,
        MAX,
        MAX,
        null,
      ],
      z: [
        MIN,
        MIN,
        null,
        MIN,
        MIN,
        null,

        MAX,
        MAX,
        null,
        MAX,
        MAX,
        null,

        MIN,
        MAX,
        null,
        MIN,
        MAX,
        null,

        MIN,
        MAX,
        null,
        MIN,
        MAX,
        null,
      ],
    });
  }

  // -----------------------------
  // Point traces
  // -----------------------------
  const trace1 = {
    x,
    y,
    z,
    mode: "markers+text",
    type: "scatter3d",
    text: labels,
    textposition: "bottom center",
    textfont: { size: 10 },
    marker: {
      size: 7,
      opacity: 0.8,
      color: "rgba(1, 120, 168, 1)",
      symbol: "circle",
      line: {
        color: "rgba(217,217,217,0.14)",
        width: 0.5,
      },
    },
    name: "TBDA Targets",
    hovertemplate:
      "Target: %{text}<br>" +
      STRING_CONSTANTS.CHEMICAL_IN_AXIS + ": %{x}<br>" +
      STRING_CONSTANTS.GENETIC_IN_AXIS + ": %{y}<br>" +
      STRING_CONSTANTS.LIKELIHOOD_AXIS + ": %{z}<extra></extra>",
  };

  const trace2 = {
    x: Number.isFinite(scores?.chemistryScore) ? [scores.chemistryScore] : [],
    y: Number.isFinite(scores?.geneticScore) ? [scores.geneticScore] : [],
    z: Number.isFinite(scores?.likelihoodScore) ? [scores.likelihoodScore] : [],
    mode: "markers+text",
    type: "scatter3d",
    text: evaluatedTarget ? [evaluatedTarget] : ["Your Target"],
    textposition: "right center",
    textfont: { size: 10 },
    marker: {
      size: 14,
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
      (evaluatedTarget || "Your Target") +
      "<br>" +
      STRING_CONSTANTS.CHEMICAL_IN_AXIS + ": %{x}<br>" +
      STRING_CONSTANTS.GENETIC_IN_AXIS + ": %{y}<br>" +
      STRING_CONSTANTS.LIKELIHOOD_AXIS + ": %{z}<extra></extra>",
  };

  // Ensure guides render behind points by ordering traces
  const data = [...guideTraces, ...planeTraces, trace1, trace2];

  const layout = {
    height: 650,
    width: 650,
    margin: { l: 10, r: 10, t: 0, b: 0 },
    scene: {
      aspectmode: "cube",
      xaxis: {
        title: {
          text: STRING_CONSTANTS.CHEMICAL_IN_AXIS,
          font: { size: 12, color: "#7f7f7f" },
        },
        range: [MIN, MAX],
        backgroundcolor: "rgba(0,0,0,0)",
        showspikes: false,
      },
      yaxis: {
        title: {
          text: STRING_CONSTANTS.GENETIC_IN_AXIS,
          font: { size: 12, color: "#7f7f7f" },
        },
        range: [MIN, MAX],
        backgroundcolor: "rgba(0,0,0,0)",
        showspikes: false,
      },
      zaxis: {
        title: { text: STRING_CONSTANTS.LIKELIHOOD_AXIS, font: { size: 12, color: "#7f7f7f" } },
        range: [MIN, MAX],
        backgroundcolor: "rgba(0,0,0,0)",
        showspikes: false,
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 },
        center: { x: 0, y: 0, z: 0 },
      },
    },
    showlegend: false,
  };

  return (
  <div className="flex flex-column gap-2">
    {/* Top control bar */}
    <div className="flex justify-content-end align-items-center">
      <span
        className="mr-2 text-sm"
        style={{ color: "#6b7280" }} // subtle gray, paper-safe
      >
        Show octants
      </span>

      <InputSwitch
        checked={showOctanes}
        onChange={(e) => setShowOctanes(e.value)}
        className="p-inputswitch-sm"
      />
    </div>

    {/* Plot */}
    <div className="flex">
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
    </div>
  </div>
);

}
