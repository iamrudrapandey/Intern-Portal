// backend/data.js
let interns = [
  {
    id: "int_001",
    name: "Asha Verma",
    email: "asha.verma@decodelabs.tech",
    track: "Frontend",
    status: "active",
    joinedOn: "2026-01-12",
  },
  {
    id: "int_002",
    name: "Rohan Mehta",
    email: "rohan.mehta@decodelabs.tech",
    track: "Backend",
    status: "active",
    joinedOn: "2026-01-19",
  },
];

let nextId = 3;

function list() {
  return interns;
}

function find(id) {
  return interns.find((i) => i.id === id);
}

function create({ name, email, track }) {
  const intern = {
    id: `int_${String(nextId++).padStart(3, "0")}`,
    name,
    email,
    track,
    status: "active",
    joinedOn: new Date().toISOString().slice(0, 10),
  };
  interns.push(intern);
  return intern;
}

function patch(id, updates) {
  const intern = find(id);
  if (!intern) return null;
  Object.assign(intern, updates);
  return intern;
}

function put(id, { name, email, track, status }) {
  const intern = find(id);
  if (!intern) return null;
  // PUT = full replace. Unlike patch(), we don't merge — every field
  // is overwritten explicitly. id and joinedOn stay server-controlled.
  intern.name = name;
  intern.email = email;
  intern.track = track;
  intern.status = status;
  return intern;
}

function remove(id) {
  const before = interns.length;
  interns = interns.filter((i) => i.id !== id);
  return interns.length < before;
}

module.exports = { list, find, create, patch, put, remove };