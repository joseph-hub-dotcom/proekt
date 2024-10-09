const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const photoRoutes = require("./PhotoRoutes"); // Ensure the path is correct
const Admin = require("./Admin"); // Import the Admin model
const http = require("http");
const socketIo = require("socket.io");

const mongoURI =
  "mongodb+srv://josifj29:proektsvadba123@proektcluster.fvu25.mongodb.net/?retryWrites=true&w=majority&appName=ProektCluster"; // Replace with your actual database URI

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
  origin: ["https://proekt-gqf7.vercel.app", "http://localhost:5173"], // Your Vercel frontend and local frontend
  methods: ["GET", "POST", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Create an HTTP server and attach Socket.io to it
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["https://proekt-gqf7.vercel.app", "http://localhost:5173"], // Allowed origins
    methods: ["GET", "POST"], // Allowed methods
    credentials: true, // Allow credentials
  },
});

// Store the io instance in the app object for access in routes
app.set("io", io);

// Middleware
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

// Listen for connections
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Listen for new image upload event
  socket.on("newImageUploaded", () => {
    socket.broadcast.emit("newImageUploaded"); // Emit event to all other clients
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
