const { db } = require("../firebaseConfig.js");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const usersRef = db.ref("users");
    usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const userId = Object.keys(userData)[0]; // Get the user ID
          const user = userData[userId];

          // Check if the password matches
          if (user.password === password) {
            console.log(user);
            res.status(200).json({ message: "Login successful", user });
          } else {
            res.status(401).json({ message: "Invalid password" });
          }
        } else {
          res.status(401).json({ message: "User not found" });
        }
      });
    console.log("GET OK");
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { login };
