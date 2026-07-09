# System Architecture

GUIDOC follows a modern decoupled architecture, separating the client-side single page application (SPA) from the backend RESTful API.

## High-Level Flow

1. **Client**: The React frontend requests data from the backend.
2. **Authentication Layer**: Firebase Auth handles user signup/login on the client. Secured routes pass Firebase JWT tokens to the backend via HTTP headers.
3. **Backend API**: The Express.js server acts as the central hub, verifying authentication tokens (via Firebase Admin SDK) and communicating with MongoDB and external APIs.
4. **Data Persistence**: MongoDB Atlas stores document schemas, analytics, and admin configurations. Firebase Firestore is used for real-time user-specific data like favorites and AI chat history.
5. **AI Integration**: The backend interfaces with the Google Gemini API (or a similar LLM) to process natural language queries from the user.

## Tech Stack Breakdown

### Frontend (Client Tier)
- **Framework**: React 18
- **Build Tool**: Vite (for fast HMR and optimized builds)
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid layouts)
- **State Management**: React Context API (Auth, Preferences)
- **API Client**: Axios with Interceptors
- **Icons**: Lucide React
- **Internationalization**: i18next

### Backend (Logic Tier)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Architecture**: MVC (Models, Controllers, Services, Routes)
- **Authentication Validation**: Firebase Admin SDK
- **AI Integration**: Custom LangChain wrappers or direct SDK calls to LLMs

### Database (Data Tier)
- **NoSQL Store 1**: MongoDB Atlas (Mongoose ODM)
  - Used for unstructured document data, scalability, and complex querying.
- **NoSQL Store 2**: Firebase Firestore
  - Used for lightweight, real-time syncing of user preferences, chat logs, and favorites.

### Deployment & CI/CD
- **Frontend Hosting**: Vercel (Edge network, automated deployments via GitHub).
- **Backend Hosting**: Render (Auto-scaling Node.js server).
- **Version Control**: Git & GitHub.