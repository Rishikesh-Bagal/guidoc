# Backend API Documentation

The GUIDOC backend exposes a RESTful API powered by Node.js and Express.js, connecting to a MongoDB Atlas cluster.

## Base URL
`/api/v1`

## Authentication
Most routes are public. Routes requiring authentication expect a Firebase JWT in the Authorization header:
`Authorization: Bearer <token>`

---

## Endpoints

### Documents (`/api/v1/documents`)

- `GET /` - Fetch all active documents.
- `GET /search?q={query}` - Search active documents.
- `GET /:slug` - Get a single document by its slug.
- `GET /admin/all` - **(Admin Only)** Get all documents, including inactive ones, paginated.
- `POST /` - **(Admin Only)** Create a new document.
- `PUT /:id` - **(Admin Only)** Update an existing document.
- `DELETE /:id` - **(Admin Only)** Delete a document.

### Eligibility (`/api/v1/eligibility`)

- `POST /` - Evaluate user eligibility based on provided answers.
  - **Body**: `{ document: "aadhar-card", answers: { ... } }`

### AI Chat (`/api/v1/chat`)

- `POST /` - Send a message to the AI Assistant.
  - **Body**: `{ message: "How do I apply for a passport?" }`

---

## Response Format
The API follows a standardized JSON response format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```
