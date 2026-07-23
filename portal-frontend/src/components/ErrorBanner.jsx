// src/components/ErrorBanner.jsx
import React from "react";

export default function ErrorBanner({ error, onDismiss }) {
  return (
    <div className="banner banner--error" role="alert">
      <div>
        <strong>Request failed{error.status ? ` (status ${error.status})` : ""}:</strong>{" "}
        {error.message}
      </div>
      <button className="banner__dismiss" onClick={onDismiss} aria-label="Dismiss error">
        ×
      </button>
    </div>
  );
}