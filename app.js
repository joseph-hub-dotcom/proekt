const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const photoRoutes = require("./PhotoRoutes"); // Ensure the path is correct

const mongoURI =
  "mongodb+srv://josifj29:proektsvadba123@proektcluster.fvu25.mongodb.net/?retryWrites=true&w=majority&appName=ProektCluster"; // Replace with your actual database URI

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: "https://proekt-gqf7.vercel.app", // Your Vercel frontend URL
  methods: ["GET", "POST"], // Adjust methods as necessary
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use photo routes
app.use("/api/photos", photoRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
