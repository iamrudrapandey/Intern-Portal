# Intern Registry — Project 4: Frontend & Backend Integration

A full-stack app demonstrating REST API integration between a React
frontend and an Express backend — built for the "Frontend & Backend
Integration" module.

## Stack
- **Backend:** Node.js, Express, CORS, in-memory data store
- **Frontend:** React (Vite), native `fetch()`, async/await

## Features
- Full REST CRUD: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Correct HTTP status codes (200, 201, 204, 400, 404, 422, 500)
- Live async-request visualizer (Input → Process → Output pipeline)
- Graceful error handling for both HTTP errors and network failures
- CORS-enabled cross-origin requests between frontend (5173) and backend (4000)

## Project structure
Intern-Portal/
├── portal-backend/
│ ├── server.js
│ ├── data.js
│ └── package.json
└── portal-frontend/
├── index.html
└── src/
├── api.js
├── App.jsx
├── index.css
└── components/
├── PipelineStrip.jsx
├── ErrorBanner.jsx
├── InternForm.jsx
└── InternList.jsx          
 ## Running locally

**Terminal 1 — backend**
```bash
cd portal-backend
npm install
npm run dev
```
Runs on `http://localhost:4000`.

**Terminal 2 — frontend**
```bash
cd portal-frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

# 🚀 Intern Management Portal

A full-stack intern management application built to demonstrate **frontend-backend communication, REST API design, CRUD operations, error handling, and modern web architecture principles**.

The project follows a clean client-server architecture where the frontend communicates with an Express backend through RESTful APIs.

# 📌 Project Overview

The Intern Management Portal allows users to:

* View all intern records
* Create new intern profiles
* Edit existing intern information
* Update specific fields using partial updates
* Delete intern records
* Experience real-time request flow visualization

The project focuses on understanding the complete lifecycle of a web request:

**Frontend Request → Backend Processing → API Response → UI Update**


# 🛠️ Tech Stack

## Frontend

* React.js
* JavaScript (ES6+)
* CSS
* Fetch API
* Component-based architecture

## Backend

* Node.js
* Express.js
* REST APIs
* CORS middleware

## Development Tools

* npm
* Git
* VS Code


# ⚡ Running Locally

Follow these steps to run the project locally.


## 1. Start Backend Server

Open a terminal:

```bash
cd portal-backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:4000
```


## 2. Start Frontend Application

Open another terminal:

```bash
cd portal-frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```


# 📡 API Documentation

The application follows RESTful API conventions.

| Method | Endpoint           | Idempotent | Purpose                 | Status Codes       |
| ------ | ------------------ | ---------- | ----------------------- | ------------------ |
| GET    | `/api/interns`     | ✅ Yes      | Fetch all interns       | 200, 500           |
| POST   | `/api/interns`     | ❌ No       | Create new intern       | 201, 400, 422      |
| PUT    | `/api/interns/:id` | ✅ Yes      | Replace complete record | 200, 400, 404, 422 |
| PATCH  | `/api/interns/:id` | ✅ Yes      | Update selected fields  | 200, 404, 422      |
| DELETE | `/api/interns/:id` | ✅ Yes      | Remove intern record    | 204, 404           |


# 🏗️ Architecture & Design Decisions

## 🔄 IPO Request Lifecycle

Every request follows the IPO model:

```
        Client
          |
          ↓
      INPUT
   HTTP Request
          |
          ↓
     PROCESS
 Express Routing
 Validation
 Data Handling
          |
          ↓
      OUTPUT
 API Response
 UI Update
```

The frontend represents this flow visually using the `PipelineStrip` component.

The request lifecycle is controlled using a single state:

```
idle → input → process → output → idle
```

This creates a clear representation of how data moves through the system.


# 🔁 PUT vs PATCH Implementation

Both update methods are implemented intentionally because they solve different problems.

## PATCH — Partial Update

PATCH updates only selected fields.

Example:

```json
{
  "status": "Selected"
}
```

Implementation:

```javascript
Object.assign(intern, updates)
```

Used for:

* Status updates
* Quick modifications
* Partial edits


## PUT — Complete Replacement

PUT replaces the complete intern resource.

Example:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Developer",
  "status": "Selected"
}
```

Sending incomplete PUT data is rejected because PUT represents a full replacement.


## REST Idempotency

| Request | Result                                     |
| ------- | ------------------------------------------ |
| PUT     | Same request produces the same final state |
| PATCH   | Same request produces the same final state |
| POST    | Creates a new resource every time          |

This follows standard REST principles.

# ⚠️ Error Handling Strategy

The application implements centralized error handling using two layers.


## 1. Network-Level Errors

These occur when the request never reaches the backend.

Examples:

* Backend server unavailable
* Internet failure
* CORS blocking

Handled using:

```javascript
try/catch
```


## 2. HTTP-Level Errors

These occur when the server receives the request but returns an unsuccessful response.

Examples:

```
400 Bad Request
404 Not Found
422 Validation Error
500 Server Error
```

Since `fetch()` does not automatically throw errors for HTTP failures, the application checks:

```javascript
response.ok
```

and creates a custom:

```
ApiError
```

containing the response status.


# 🧩 Centralized Error Flow

```
API Error
    |
    ↓
 ApiError
    |
    ↓
 App.jsx Handler
    |
    ↓
 ErrorBanner Component
    |
    ↓
 User Notification
```

Benefits:

* No silent failures
* Consistent error messages
* Cleaner UI components


# 🌐 CORS Configuration

The frontend and backend run on different origins:

```
Frontend:
localhost:5173

Backend:
localhost:4000
```

The backend enables:

```javascript
cors()
```

to allow secure communication between both applications.

Without CORS configuration, browser security policies would block API requests.


# 🧠 Server-Driven State Management

The application always trusts server responses instead of assuming local values.

Example:

When creating a new intern:

❌ Local assumption:

```javascript
add(formData)
```

✅ Server-controlled update:

```javascript
add(serverResponse)
```

The backend generates values like:

* Unique ID
* Joined date
* Server-side fields

The frontend updates its state only after receiving the confirmed API response.


# 🚫 Intentional Design Decisions

## Why Promise.all() Was Not Used

Parallel API requests were not introduced because:

* Only one intern list request is required
* No dependent parallel operations exist
* Additional complexity would not improve performance

The implementation keeps the data flow simple and predictable.


## Why No Database Was Added

The current version uses an in-memory data store:

```
data.js
```

Purpose:

* Focus on API design
* Demonstrate frontend-backend communication
* Keep development simple

Current limitation:

* Data resets after backend restart

Future production versions can integrate:

* MongoDB
* PostgreSQL
* Firebase
* Supabase


# ✨ Features

✅ Complete CRUD functionality
✅ RESTful API implementation
✅ React frontend with reusable components
✅ Express backend architecture
✅ PUT and PATCH distinction
✅ Centralized error handling
✅ CORS configuration
✅ Server-driven state updates
✅ Request lifecycle visualization


# 🚀 Future Improvements

Possible enhancements:

* Add database persistence
* Implement authentication & authorization
* Add search and filtering
* Add pagination
* Deploy frontend and backend
* Add automated testing
* Add API documentation using Swagger


# 🎯 Learning Outcomes

Through this project, the following concepts were implemented:

* REST API fundamentals
* Client-server communication
* HTTP methods
* API error handling
* React state management
* Backend routing
* CORS configuration
* Resource lifecycle management

# 👩‍💻 Author

**Rudra Pandey**

B.Tech Computer Science Engineering

Passionate about:

* Full Stack Development
* Artificial Intelligence
* Machine Learning
* Building real-world applications


⭐ If you found this project useful, consider giving it a star!
