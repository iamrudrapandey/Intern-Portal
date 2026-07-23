// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { InternsAPI, ApiError } from "./api.js";
import PipelineStrip from "./components/PipelineStrip.jsx";
import InternForm from "./components/InternForm.jsx";
import InternList from "./components/InternList.jsx";
import ErrorBanner from "./components/ErrorBanner.jsx";

export default function App() {
  const [interns, setInterns] = useState([]);
  const [stage, setStage] = useState("idle");
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [editingIntern, setEditingIntern] = useState(null);

  const runPipeline = useCallback(async (task) => {
    setError(null);
    setStage("input");
    try {
      setStage("process");
      const result = await task();
      setStage("output");
      return result;
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError(err.message, 0);
      setError(apiErr);
      setStage("output");
      throw apiErr;
    } finally {
      setTimeout(() => setStage("idle"), 450);
    }
  }, []);

  const loadInterns = useCallback(
    async (opts) => {
      try {
        const data = await runPipeline(() => InternsAPI.list(opts));
        setInterns(data);
      } catch {
        // error already captured in state by runPipeline
      } finally {
        setInitialLoad(false);
      }
    },
    [runPipeline]
  );

  useEffect(() => {
    loadInterns();
  }, [loadInterns]);

  const handleCreate = async (intern) => {
    try {
      const created = await runPipeline(() => InternsAPI.create(intern));
      setInterns((prev) => [...prev, created]);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdate = async (id, fullIntern) => {
    try {
      const updated = await runPipeline(() => InternsAPI.put(id, fullIntern));
      setInterns((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setEditingIntern(null); // exit edit mode on success
      return true;
    } catch {
      return false; // stay in edit mode so the user can retry/fix input
    }
  };

  const handleStatusToggle = async (intern) => {
    const nextStatus = intern.status === "active" ? "on-leave" : "active";
    try {
      const updated = await runPipeline(() => InternsAPI.patch(intern.id, { status: nextStatus }));
      setInterns((prev) => prev.map((i) => (i.id === intern.id ? updated : i)));
    } catch {
      // banner already shows the error
    }
  };

  const handleDelete = async (intern) => {
    try {
      await runPipeline(() => InternsAPI.remove(intern.id));
      setInterns((prev) => prev.filter((i) => i.id !== intern.id));
      if (editingIntern?.id === intern.id) setEditingIntern(null);
    } catch {
      // banner already shows the error
    }
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand">
          <span className="app__brand-mark">IPO</span>
          <div>
            <h1>Intern Registry</h1>
            <p className="app__subtitle">Project 4 — Frontend &amp; Backend Integration</p>
          </div>
        </div>
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => loadInterns({ simulateError: true })}
          title="Fires a request the backend is told to fail, to demonstrate the 5xx error path"
        >
          Simulate 500 error
        </button>
      </header>

      <PipelineStrip stage={stage} />

      {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

      <main className="app__main">
        <section className="panel">
          <h2 className="panel__title">
            {editingIntern ? `Editing ${editingIntern.name}` : "Register a new intern"}
          </h2>
          <InternForm
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            editingIntern={editingIntern}
            onCancelEdit={() => setEditingIntern(null)}
          />
        </section>

        <section className="panel panel--wide">
          <div className="panel__title-row">
            <h2 className="panel__title">Roster ({interns.length})</h2>
            <button className="btn btn--ghost btn--sm" onClick={() => loadInterns()}>
              Refresh
            </button>
          </div>
          {initialLoad ? (
            <p className="panel__empty">Loading roster…</p>
          ) : (
            <InternList
              interns={interns}
              onToggleStatus={handleStatusToggle}
              onDelete={handleDelete}
              onEdit={setEditingIntern}
            />
          )}
        </section>
      </main>
    </div>
  );
}