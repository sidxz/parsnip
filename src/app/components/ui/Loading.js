import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

/**
 * Full screen loading page using PrimeReact ProgressSpinner.
 * Save as: src/app/components/ui/Loading.js
 *
 * Props:
 * - message: optional text shown below the spinner (default: "Loading...")
 * - background: optional background color for the overlay (default: rgba(255,255,255,0.85))
 */
const Loading = ({ message = " Please Wait.. ", background = "rgba(255,255,255,0.85)" }) => {
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background,
    zIndex: 9999,
    pointerEvents: "auto",
  };

  const boxStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    borderRadius: 8,
    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
    background: "transparent",
  };

  const messageStyle = {
    marginTop: 8,
    fontSize: 16,
    color: "var(--text-color, #333)",
    textAlign: "center",
  };

  return (
    <div style={overlayStyle} role="status" aria-live="polite" aria-busy="true">
      <div style={boxStyle}>
        <ProgressSpinner style={{ width: 64, height: 64 }} strokeWidth={6} />
        PARSNIP
        {message && <div style={messageStyle}>{message}</div>}
      </div>
    </div>
  );
};

export default Loading;