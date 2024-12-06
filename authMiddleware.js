import { verifyToken } from '../config.js';

export const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer Token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await verifyToken(token);
    req.user = decodedToken; // Attach user info to the request
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
