const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./quizapp-ddf3d-firebase-adminsdk-i6dq5-97cb92d6c9.json");
const quizRoutes = require("./routes/quizzes");
const scoreRoutes = require("./routes/scores");
const userRoutes = require("./routes/users");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<your-project-id>.firebaseio.com",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/quizzes", quizRoutes); // Quiz routes
app.use("/scores", scoreRoutes); // Score routes
app.use("/users", userRoutes); // User routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
