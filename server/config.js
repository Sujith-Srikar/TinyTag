const admin = require("firebase-admin");

const serviceAccount = require("./firebaseServiceAccount.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const db = admin.firestore();

// Reference to the "url" collection
const URL = db.collection("url");

module.exports = URL;