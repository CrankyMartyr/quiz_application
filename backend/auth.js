const { admin } = require("./firebaseConfig");
const express = require("express");
const router = express.Router();
const firebase = require("firebase");
require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyAEJNvU_H1yP5udQxbMuEfk-rnjpgYGoC4",
  authDomain: "quizapp-ddf3d.firebaseapp.com",
  projectId: "quizapp-ddf3d",
  storageBucket: "quizapp-ddf3d.appspot.com",
  messagingSenderId: "32321129646",
  appId: "1:32321129646:web:e584c6fb786d38a667f13f",
};

firebase.initializeApp(firebaseConfig);

// Middleware to verify token
const authenticateUser = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized" });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Unauthorized" });
  }
};

// Admin role verification middleware
const checkAdminRole = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};

// Sign up user
router.post("/signup", async (req, res) => {
  const { email, password, username, admin } = req.body;

  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
    await admin.auth().setCustomUserClaims(user.user.uid, { admin });

    await admin.firestore().collection("users").doc(user.user.uid).set({
      email,
      username,
      admin,
    });

    return res
      .status(201)
      .json({ message: "User signed up successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    const token = await user.user.getIdToken();
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(403).json({ error: "Login failed" });
  }
});

module.exports = { router, authenticateUser, checkAdminRole };
