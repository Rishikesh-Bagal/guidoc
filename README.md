<div align="center">
  <img src="https://via.placeholder.com/150" alt="GUIDOC Logo" />
  <h1>GUIDOC</h1>
  <p><b>Simplifying Document Guidance for Everyone</b></p>
  <p>
    <img src="https://img.shields.io/badge/version-2.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/build-passing-success.svg" alt="Build Status">
    <img src="https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react" alt="React">
    <img src="https://img.shields.io/badge/Node.js-18+-339933.svg?logo=nodedotjs" alt="Node.js">
  </p>
</div>

<br />

GUIDOC is an AI-powered platform that helps citizens navigate government document application processes through guided workflows, semantic search, and intelligent voice assistance.

---

## 🌟 Overview & Highlights

- **V2.0.0 Final Release**: Production-ready, fully responsive, and accessible.
- **Multilingual Support**: Available in English and Hindi natively.
- **AI Assistant & Voice Guidance**: Conversational AI trained to answer document queries through text or voice.
- **Eligibility Wizard**: Interactive wizard to instantly know if you qualify for specific documents.

## 🚀 Features

- **Authentication System**: Secure login and registration via Firebase Auth.
- **User Dashboard**: Track saved documents, eligibility history, and recent searches.
- **Document Search & Filtering**: Lightning-fast semantic search by category and keywords.
- **Document Details**: Comprehensive step-by-step online and offline procedures, required documents, fees, and processing times.
- **Application Tracker**: Track your real-world document application status.
- **Admin Portal**: A dedicated workspace to manage documents, view stats, and handle users.
- **Favorites & Notifications**: Save frequently accessed documents and get notified of updates.
- **Office Locator**: Find government offices near you.

For a full breakdown of features, see [Features.md](docs/Features.md).

## 📸 Screenshots

| Dashboard | Document Search | Eligibility Wizard |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/400x250?text=Dashboard) | ![Search Placeholder](https://via.placeholder.com/400x250?text=Search) | ![Wizard Placeholder](https://via.placeholder.com/400x250?text=Wizard) |

| AI Voice Assistant | Admin Portal | Mobile Responsive |
| :---: | :---: | :---: |
| ![Voice Assistant Placeholder](https://via.placeholder.com/400x250?text=Voice+Assistant) | ![Admin Placeholder](https://via.placeholder.com/400x250?text=Admin+Portal) | ![Mobile Placeholder](https://via.placeholder.com/400x250?text=Mobile+View) |

## 🏗️ Tech Stack

- **Frontend**: React + Vite (SPA)
- **Styling**: Vanilla CSS (Custom Design System with CSS Variables)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas (Mongoose)
- **Authentication**: Firebase Authentication
- **AI/LLM**: Google Gemini API
- **Hosting**:
  - Frontend: [Vercel](https://vercel.com/) or Netlify
  - Backend: [Render](https://render.com/)

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed structural breakdown.

## 📂 Folder Structure

```
guidoc/
├── backend/                  # Express.js REST API
│   ├── src/
│   │   ├── config/           # DB and Firebase config
│   │   ├── controllers/      # Route handlers
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API routes
│   │   └── index.js          # Entry point
│   └── package.json
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Auth, Theme)
│   │   ├── locales/          # i18n translation files
│   │   ├── pages/            # Page components
│   │   ├── services/         # API integration services
│   │   └── App.jsx           # Root component
│   └── package.json
└── docs/                     # Documentation files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Firebase Project
- Google Gemini API Key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Rishikesh-Bagal/guidoc.git
   cd guidoc
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Environment Variables

Copy the example environment files and fill in your values:

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Backend** (`backend/.env`):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_SERVICE_ACCOUNT=your_base64_encoded_service_account_or_path
```

### Running Locally

Run both frontend and backend development servers in separate terminals:

**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

### Build Commands

To create a production build for the frontend:
```bash
cd frontend
npm run build
```

## ☁️ Deployment

See [Deployment.md](docs/Deployment.md) for a comprehensive guide on deploying GUIDOC to Vercel and Render.

## 🔮 Future Scope & Roadmap

- **Push Notifications**: Proactive alerts for application status updates.
- **Document OCR**: Upload documents to automatically parse and verify details.
- **Payment Gateway**: Mock integration for fee payment.
- **Mobile App**: React Native port for iOS/Android.

## ⚠️ Known Limitations

- **Voice Assistant**: The Voice Assistant relies on the Web Speech API and may not work consistently across all browsers (best supported in Chrome).
- **Payment Integration**: Currently, there is no real payment gateway; fees are informational only.
- **Data Completeness**: While we cover major documents, state-specific nuances for all regions of India are still being aggregated.

## 🤝 Contributors

- **Rishikesh Bagal** - *Lead Full-Stack Engineer*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.