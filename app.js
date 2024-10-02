const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const photoRoutes = require("./PhotoRoutes"); // Ensure the path is correct
const Admin = require("./Admin"); // Import the Admin model

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
  origin: "http://localhost:5173", // Your Vercel frontend URL
  methods: ["GET", "POST", "DELETE"], // Adjust methods as necessary
  credentials: true, // If you need to send cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/admin/password", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ password: admin.password });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin password", error });
  }
});

// Use photo routes
app.use("/api/photos", photoRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
