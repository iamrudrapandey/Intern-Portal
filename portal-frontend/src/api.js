// src/api.js

const BASE_URL = "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (networkError) {
    // fetch() only throws on true network failure (server down, no internet, CORS block)
    throw new ApiError("Network error: could not reach the registry service.", 0);
  }

  if (response.status === 204) return null; // DELETE has no body

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || `Request failed with status ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  return payload;
}

export const InternsAPI = {
  list: (opts = {}) => request(`/interns${opts.simulateError ? "?simulateError=1" : ""}`),
  create: (intern) => request("/interns", { method: "POST", body: JSON.stringify(intern) }),
  patch: (id, updates) => request(`/interns/${id}`, { method: "PATCH", body: JSON.stringify(updates) }),
  put: (id, intern) => request(`/interns/${id}`, { method: "PUT", body: JSON.stringify(intern) }),
  remove: (id) => request(`/interns/${id}`, { method: "DELETE" }),
};