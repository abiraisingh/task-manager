const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1/tasks", require("./src/routes/taskRoutes"));

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch(err => console.log(err));

// routes
app.use("/api/v1/auth", require("./src/routes/authRoutes"));

//TEMP Route
const auth = require("./src/middleware/auth");

app.get("/protected", auth, (req, res) => {
  res.json({
    msg: "Access granted",
    user: req.user
  });
});

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// server
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});