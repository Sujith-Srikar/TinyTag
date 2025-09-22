import admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

// Function to fix private key formatting
function fixPrivateKey(privateKey: string): string {
  return privateKey.replace(/\\n/g, "\n");
}

let serviceAccount: any;

// Check if we're in production (using environment variables)
if (process.env.NODE_ENV === "production") {
  // Try to use full service account JSON first
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      // Fix the private key formatting for production
      if (serviceAccount.private_key) {
        serviceAccount.private_key = fixPrivateKey(serviceAccount.private_key);
      }
    } catch (error) {
      throw new Error(
        "Failed to parse FIREBASE_SERVICE_ACCOUNT environment variable: " +
          error
      );
    }
  }
  // Fall back to individual environment variables
  else if (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.FIREBASE_CLIENT_EMAIL
  ) {
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: fixPrivateKey(process.env.FIREBASE_PRIVATE_KEY),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      universe_domain: "googleapis.com",
    };
  } else {
    throw new Error(
      "Firebase service account configuration not found. Set FIREBASE_SERVICE_ACCOUNT or individual Firebase environment variables."
    );
  }
} else {
  // Use local service account file for development
  const serviceAccountPath = path.join(
    __dirname,
    "../../firebaseServiceAccount.json"
  );
  if (fs.existsSync(serviceAccountPath)) {
    serviceAccount = require(serviceAccountPath);
  } else {
    throw new Error(
      "Firebase service account file not found and no production environment variables are set"
    );
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const db = admin.firestore();

// Reference to the "url" collection
const URL = db.collection("url");

export default URL;
