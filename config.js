import admin from 'firebase-admin';

export const PORT = 5555;

export const mongoDBURL = 
'mongodb+srv://vinay:6mCrijEFMBcAhJ3f@book-store.2pvw8.mongodb.net/books-collection?retryWrites=true&w=majority&appName=book-store';


// Load service account key
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const verifyToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    throw new Error('Unauthorized');
  }
};
