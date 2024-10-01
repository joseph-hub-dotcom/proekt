// createAdmin.js
const mongoose = require("mongoose");
const Admin = require("./Admin");

const mongoURI = "mongodb+srv://josifj29:proektsvadba123@proektcluster.fvu25.mongodb.net/?retryWrites=true&w=majority&appName=ProektCluster"; // Replace with your actual database URI

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected");

    const adminPassword = "martin"; // Set your desired password here

    const admin = new Admin({ password: adminPassword });
    await admin.save();
    console.log("Admin password saved to database");
    mongoose.connection.close();
  })
  .catch((err) => console.log("Error connecting to MongoDB:", err));
