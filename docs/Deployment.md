# Deployment Guide

This document outlines the steps required to deploy the GUIDOC application to production environments.

## 1. Frontend Deployment (Vercel)

The frontend is a React application built with Vite. It is optimized for static hosting platforms like Vercel or Netlify.

### Steps for Vercel
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import the `guidoc` repository.
4. Set the **Framework Preset** to `Vite`.
5. Set the **Root Directory** to `frontend`.
6. Add the following **Environment Variables**:
   - `VITE_API_URL` (Point this to your deployed backend URL, e.g., `https://guidoc-api.onrender.com/api/v1`)
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
7. Click **Deploy**. Vercel will automatically run `npm run build` and host the `dist` output.

## 2. Backend Deployment (Render)

The backend is a Node.js/Express API. Render is an excellent platform for hosting web services.

### Steps for Render
1. Log in to [Render](https://render.com/) and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name**: `guidoc-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
4. Add the following **Environment Variables**:
   - `PORT`: `5000` (Render will override this internally, but it's good practice)
   - `MONGODB_URI`: Your production MongoDB Atlas connection string.
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `FIREBASE_SERVICE_ACCOUNT`: Base64 encoded string of your Firebase Admin SDK service account JSON.
5. Click **Create Web Service**.

## 3. Database Preparation (MongoDB Atlas)

Ensure your MongoDB Atlas cluster allows connections from your backend hosting provider (Render).
1. Go to **Network Access** in MongoDB Atlas.
2. Add the IP address `0.0.0.0/0` (Allow access from anywhere) since Render IP addresses can change. For stricter security, look up Render's static IP add-on.
3. Create a dedicated database user with strong passwords for the production environment.

## 4. Final Verification

Once both frontend and backend are deployed:
1. Verify CORS settings in the backend `index.js` allow the Vercel frontend URL.
2. Open the deployed Vercel app.
3. Test authentication, search, and AI assistant functionality to ensure full connectivity.
