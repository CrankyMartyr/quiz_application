const admin = require("firebase-admin");
const serviceAccount = require("./quizapp-ddf3d-firebase-adminsdk-i6dq5-97cb92d6c9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quizapp-ddf3d.firebaseio.com", // If using Realtime Database
});

const db = admin.firestore();
module.exports = { admin, db };
