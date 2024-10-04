const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

// Assuming you're using a database for storing users
const users = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "user@example.com", password: "user123", role: "quiztaker" },
];

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key", // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ role: req.session.user.role });
  } else {
    res.status(401).json({ message: "No active session" });
  }
});

// Handle login
app.post("/api/login", (req, res) => {
  console.log("Login request received:", req.body);
  const { email, password } = req.body;

  // Sample user lookup (you can replace this with actual database logic)
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    // Store user info in session (or other session mechanism)
    req.session.user = { email: user.email, role: user.role };

    // Send back the role with 200 status
    return res.status(200).json({ role: user.role });
  } else {
    // If credentials are wrong, return 401 with error message
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

// Add logout route (optional)
app.post("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
