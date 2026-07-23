// backend/server.js
const express = require("express");
const cors = require("cors");
const db = require("./data");

const app = express();
const PORT = 4000;

app.use(cors());          // allow the React frontend's origin through
app.use(express.json());  // parse incoming JSON bodies into req.body

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// GET /api/interns — Retrieve. Idempotent. 200 on success.
app.get("/api/interns", (req, res) => {
  if (req.query.simulateError) {
    return res.status(500).json({ error: "Internal Server Error: registry service unreachable." });
  }
  res.status(200).json(db.list());
});

// POST /api/interns — Create. NOT idempotent. 201 on success.
app.post("/api/interns", (req, res) => {
  const { name, email, track } = req.body || {};

  if (!name || !email || !track) {
    return res.status(400).json({ error: "Bad Request: name, email, and track are all required." });
  }
  if (!isValidEmail(email)) {
    return res.status(422).json({ error: "Unprocessable Entity: email is not a valid address." });
  }

  const intern = db.create({ name, email, track });
  res.status(201).json(intern);
});

// PATCH /api/interns/:id — Partial update. 200 on success, 404 if missing.
app.patch("/api/interns/:id", (req, res) => {
  const intern = db.patch(req.params.id, req.body || {});
  if (!intern) return res.status(404).json({ error: `No intern found with id ${req.params.id}.` });
  res.status(200).json(intern);
});

// PUT /api/interns/:id — Full replace. Idempotent (same body → same result
// every time). 200 on success, 400/422 on bad input, 404 if missing.
app.put("/api/interns/:id", (req, res) => {
  const { name, email, track, status } = req.body || {};

  if (!name || !email || !track || !status) {
    return res.status(400).json({ error: "Bad Request: name, email, track, and status are all required for a full replace." });
  }
  if (!isValidEmail(email)) {
    return res.status(422).json({ error: "Unprocessable Entity: email is not a valid address." });
  }

  const intern = db.put(req.params.id, { name, email, track, status });
  if (!intern) return res.status(404).json({ error: `No intern found with id ${req.params.id}.` });
  res.status(200).json(intern);
});

// DELETE /api/interns/:id — Remove. Idempotent. 204 on success, 404 if missing.
app.delete("/api/interns/:id", (req, res) => {
  const removed = db.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: `No intern found with id ${req.params.id}.` });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});