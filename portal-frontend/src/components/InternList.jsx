// src/components/InternList.jsx
import React from "react";

export default function InternList({ interns, onToggleStatus, onDelete, onEdit }) {
  if (interns.length === 0) {
    return <p className="panel__empty">No interns yet — the roster is empty. Add one on the left.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Track</th>
          <th>Status</th>
          <th>Joined</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {interns.map((intern) => (
          <tr key={intern.id}>
            <td>{intern.name}</td>
            <td className="table__mono">{intern.email}</td>
            <td>{intern.track}</td>
            <td>
              <button
                className={`badge badge--${intern.status === "active" ? "sage" : "amber"}`}
                onClick={() => onToggleStatus(intern)}
                title="Click to toggle status (PATCH)"
              >
                {intern.status}
              </button>
            </td>
            <td className="table__mono">{intern.joinedOn}</td>
            <td style={{ display: "flex", gap: "6px" }}>
              <button className="btn btn--ghost btn--sm" onClick={() => onEdit(intern)}>
                Edit
              </button>
              <button className="btn btn--danger btn--sm" onClick={() => onDelete(intern)}>
                Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}