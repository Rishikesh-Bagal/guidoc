<div align="center">
  <img src="https://via.placeholder.com/150" alt="GUIDOC Logo" />
  <h1>GUIDOC</h1>
  <p><b>Simplifying Document Guidance for Everyone</b></p>
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
    <img src="https://img.shields.io/badge/build-passing-success.svg" alt="Build Status">
  </p>
</div>

<br />

GUIDOC is an AI-powered platform that helps citizens understand government document application processes through guided workflows and intelligent assistance.

## 🌟 Highlights

- **V1.0.0 Release**: Fully production-ready.
- **Multilingual Support**: Available in English, Hindi, and Marathi.
- **AI Assistant**: Conversational AI trained to answer your document queries.
- **Eligibility Wizard**: Instantly know if you qualify for a document.

## 🚀 Features

- **Authentication System**: Secure login and registration via Firebase.
- **User Dashboard**: Track saved documents, eligibility history, and recent searches.
- **Document Search & Filtering**: Lightning-fast semantic search by category and keywords.
- **Document Details**: Comprehensive step-by-step online and offline procedures, required documents, fees, and processing times.
- **Tracker**: Track your document application status.
- **Admin Portal**: A dedicated workspace to manage documents, view stats, and handle users.
- **Favorites**: Save your most frequently accessed documents for quick reference.

For a full breakdown of features, see [Features.md](docs/Features.md).

## 📸 Screenshots

| Dashboard | Document Search | Eligibility Wizard |
| :---: | :---: | :---: |
| ![Dashboard Placeholder](https://via.placeholder.com/300x200?text=Dashboard) | ![Search Placeholder](https://via.placeholder.com/300x200?text=Search) | ![Wizard Placeholder](https://via.placeholder.com/300x200?text=Wizard) |

## 🏗️ Architecture & Tech Stack

- **Frontend**: React + Vite (SPA)
- **Styling**: Vanilla CSS (Custom Design System)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Firebase Auth
- **Hosting**:
  - Frontend: [Vercel](https://vercel.com/)
  - Backend: [Render](https://render.com/)

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for more details.

## 🛠️ Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Firebase Project

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
- **Frontend**: `frontend/.env.example` -> `frontend/.env`
- **Backend**: `backend/.env.example` -> `backend/.env`

*Key Variables:* `VITE_API_URL`, Firebase configurations, `MONGODB_URI`, `NODE_ENV`.

### Running Locally

Run both frontend and backend development servers in separate terminals:
- **Backend**: `cd backend && npm run dev`
- **Frontend**: `cd frontend && npm run dev`

## ☁️ Deployment

See [Deployment.md](docs/Deployment.md) for a comprehensive guide on deploying GUIDOC to Vercel and Render.

## 🔮 Future Scope & Roadmap

- **Push Notifications**: Proactive alerts for application status updates.
- **Document OCR**: Upload documents to automatically parse and verify details.
- **Payment Gateway**: Mock integration for fee payment.
- **Mobile App**: React Native port for iOS/Android.

## 🤝 Contributors

- **Rishikesh Bagal** - *Lead Full-Stack Engineer*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.