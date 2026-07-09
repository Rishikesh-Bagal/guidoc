# Deployment Guide

GUIDOC is designed to be deployed across modern serverless and PaaS platforms.

## Frontend (Vercel)

The React/Vite frontend is optimized for Vercel.

1. **Connect Repository**: Import the `guidoc` repository in Vercel.
2. **Framework Preset**: Vercel should automatically detect **Vite**.
3. **Root Directory**: Set the Root Directory to `frontend`.
4. **Environment Variables**: Add the following in the Vercel dashboard:
   - `VITE_API_URL` (e.g., `https://guidoc-api.onrender.com/api/v1`)
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
5. **Deploy**: Vercel will handle the `npm run build` command and host the SPA correctly using `vercel.json` for routing rules.

## Backend (Render)

The Node/Express backend is optimized for Render.com.

1. **New Web Service**: Create a new Web Service on Render and link the repository.
2. **Root Directory**: Set it to `backend`.
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI` (Your MongoDB Atlas connection string)
   - `FRONTEND_URL` (Your Vercel URL, used for CORS)
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (for Firebase Admin SDK verification).
6. **Deploy**: Render will expose the application on a public URL.

## Database (MongoDB Atlas)

Ensure you have allowed IP access to your database from Render. For ease of use, you can allow `0.0.0.0/0` in MongoDB Atlas Network Access, relying on strong credentials for security.
