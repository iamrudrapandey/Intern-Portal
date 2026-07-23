// src/components/PipelineStrip.jsx
import React from "react";

const STAGES = [
  { key: "input", label: "INPUT", detail: "Client HTTP request" },
  { key: "process", label: "PROCESS", detail: "Backend routing + DB" },
  { key: "output", label: "OUTPUT", detail: "DOM updates" },
];

export default function PipelineStrip({ stage }) {
  const activeIndex = STAGES.findIndex((s) => s.key === stage);

  return (
    <div className="pipeline" role="status" aria-live="polite">
      {STAGES.map((s, i) => {
        const isActive = i === activeIndex;
        const isPast = activeIndex > i || (stage === "idle" && activeIndex === -1);
        return (
          <React.Fragment key={s.key}>
            <div className={`pipeline__node ${isActive ? "is-active" : ""}`}>
              <span className="pipeline__dot" />
              <div>
                <div className="pipeline__label">{s.label}</div>
                <div className="pipeline__detail">{s.detail}</div>
              </div>
            </div>
            {i < STAGES.length - 1 && (
              <div className={`pipeline__wire ${isActive || isPast ? "is-live" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
      <div className={`pipeline__status ${stage === "idle" ? "is-idle" : "is-busy"}`}>
        {stage === "idle" ? "READY" : "IN FLIGHT"}
      </div>
    </div>
  );
}