const admin = require('../config/firebaseAdmin');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
  }
};

const verifyAdmin = async (req, res, next) => {
  if (!req.user || !req.user.uid) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }

  try {
    const userDoc = await admin.firestore().collection('users').doc(req.user.uid).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ message: 'Forbidden: User profile not found' });
    }

    const userData = userDoc.data();
    if (userData.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return res.status(500).json({ message: 'Internal Server Error while verifying role' });
  }
};

module.exports = { verifyToken, verifyAdmin };
