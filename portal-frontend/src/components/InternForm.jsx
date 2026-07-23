// src/components/InternForm.jsx
import React, { useState, useEffect } from "react";

const TRACKS = ["Frontend", "Backend", "Full Stack", "Data"];
const STATUSES = ["active", "on-leave"];

const EMPTY = { name: "", email: "", track: TRACKS[0], status: STATUSES[0] };

export default function InternForm({ onCreate, onUpdate, editingIntern, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(editingIntern);

  // When editingIntern changes (user clicked "Edit" on a row), load its
  // values into the form. When it's cleared, reset to blank.
  useEffect(() => {
    setForm(editingIntern ? { ...editingIntern } : EMPTY);
  }, [editingIntern]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = isEditing ? await onUpdate(editingIntern.id, form) : await onCreate(form);
    setSubmitting(false);
    if (ok && !isEditing) setForm(EMPTY);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="form__field">
        <span>Name</span>
        <input value={form.name} onChange={update("name")} placeholder="Asha Verma" required />
      </label>
      <label className="form__field">
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="asha.verma@decodelabs.tech"
          required
        />
      </label>
      <label className="form__field">
        <span>Track</span>
        <select value={form.track} onChange={update("track")}>
          {TRACKS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      {isEditing && (
        <label className="form__field">
          <span>Status</span>
          <select value={form.status} onChange={update("status")}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      )}

      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : isEditing ? "Save changes (PUT)" : "Add intern (POST)"}
        </button>
        {isEditing && (
          <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}