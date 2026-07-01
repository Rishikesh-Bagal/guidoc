const admin = require('firebase-admin');

// Note: In a real environment, you'd use a service account key JSON file
// or set environment variables like FIREBASE_PRIVATE_KEY.
// For now, if no credentials are provided, we initialize an empty app 
// or log a warning so the backend doesn't crash on startup.

try {
  // If FIREBASE_SERVICE_ACCOUNT is provided in env as a JSON string
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized with service account");
  } else {
    // Dummy initialization for development if no service account is present
    admin.initializeApp();
    console.log("Firebase Admin initialized with default application credentials (or dummy mode)");
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

module.exports = admin;
