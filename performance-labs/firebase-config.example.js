// Copy to firebase-config.js only after Firebase is provisioned and security
// rules are deployed. Firebase WEB configuration is not a secret, but never
// include service-account keys or passwords in browser files.
export const firebaseConfig = {
  apiKey: 'REPLACE_WITH_FIREBASE_WEB_API_KEY',
  authDomain: 'REPLACE_WITH_PROJECT.firebaseapp.com',
  projectId: 'REPLACE_WITH_PROJECT_ID',
  appId: 'REPLACE_WITH_APP_ID'
};
