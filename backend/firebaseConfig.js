const admin = require("firebase-admin");
const serviceAccount = require("./quizapp-ddf3d-firebase-adminsdk-i6dq5-c9c9bce8fa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quizapp-ddf3d-default-rtdb.firebaseio.com", // If using Realtime Database
});

const db = admin.database();
module.exports = { admin, db };
