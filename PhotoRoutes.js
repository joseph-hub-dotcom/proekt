const express = require("express");
const multer = require("multer");
const Photo = require("./Photo");
const router = express.Router();

// Set up multer for file uploads (in memory storage)
const storage = multer.memoryStorage(); // Use memory storage for multer
const upload = multer({ storage: storage });

router.post("/upload", upload.array("photos"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedPhotos = [];

    // Save each uploaded file to the database as binary data
    for (const file of req.files) {
      const newPhoto = new Photo({
        filename: file.originalname,
        data: file.buffer, // Save the binary data
        contentType: file.mimetype,
      });

      await newPhoto.save();
      uploadedPhotos.push(newPhoto);
    }

    res.status(201).json({
      message: "Photos uploaded successfully",
      photos: uploadedPhotos,
    });
  } catch (err) {
    console.error("Error saving photos:", err);
    res
      .status(500)
      .json({ message: "Error saving photos", error: err.message });
  }
});

// Route to fetch a specific image by its ID and display it
router.get("/image/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);

    if (!photo) {
      return res.status(404).json({ message: "Image not found" });
    }

    console.log(`Serving image: ${photo.filename}`);
    res.set("Content-Type", photo.contentType); // Set content type dynamically
    res.send(photo.data); // Send the binary data directly as the response
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Error fetching image", error });
  }
});

// Route to fetch all image metadata (without the binary data)
const fs = require("fs");
const path = require("path");

router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find();
    const formattedPhotos = photos.map((photo) => {
      if (photo.data) {
        // Send base64 string for binary images stored in DB
        return {
          _id: photo._id,
          filename: photo.filename,
          data: photo.data.toString("base64"), // Convert to base64
          contentType: photo.contentType,
        };
      } else {
        // Check if the file exists in uploads folder
        const filePath = path.join(__dirname, "uploads", photo.filename);
        if (fs.existsSync(filePath)) {
          // If the file exists, return its URL
          return {
            _id: photo._id,
            filename: photo.filename,
            imageUrl: photo.imageUrl,
            contentType: photo.contentType,
          };
        } else {
          // If file is missing, return a placeholder or error
          return {
            _id: photo._id,
            filename: photo.filename,
            imageUrl: "http://localhost:3000/uploads/placeholder.png", // Placeholder image
            contentType: photo.contentType,
          };
        }
      }
    });
    res.json(formattedPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ message: "Error fetching photos", error });
  }
});

// In your backend (app.js or photoroutes.js)
router.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = router;
