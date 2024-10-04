const express = require("express");
const multer = require("multer");
const Photo = require("./Photo");
const router = express.Router();
const archiver = require("archiver");
const path = require("path");
const fs = require("fs");

// Set up multer for file uploads (in memory storage)
const storage = multer.memoryStorage();
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
        data: file.buffer,
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
    res.status(500).json({ message: "Error saving photos", error: err.message });
  }
});

// Fetch all image metadata (without binary data)
router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find();
    const formattedPhotos = photos.map((photo) => {
      return {
        _id: photo._id,
        filename: photo.filename,
        contentType: photo.contentType,
        data: photo.data.toString("base64"), // Convert to base64 for frontend display
      };
    });
    res.json(formattedPhotos);
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ message: "Error fetching photos", error });
  }
});

// Delete a specific photo
router.delete("/delete/:id", async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }
    res.status(200).json({ message: `Photo ${photo.filename} deleted successfully` });
  } catch (error) {
    console.error("Error deleting photo:", error);
    res.status(500).json({ message: "Error deleting photo", error });
  }
});

// Route to delete all photos
router.delete("/", async (req, res) => {
  try {
    await Photo.deleteMany({});
    res.status(200).json({ message: "All photos deleted successfully" });
  } catch (error) {
    console.error("Error deleting all photos:", error);
    res.status(500).json({ message: "Error deleting all photos", error });
  }
});

// Route to download all images as a ZIP file
router.get("/download", async (req, res) => {
  try {
    const photos = await Photo.find();
    const archive = archiver("zip");
    res.attachment("photos.zip");
    archive.pipe(res);

    for (const photo of photos) {
      archive.append(photo.data, { name: photo.filename });
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error downloading photos:", error);
    res.status(500).json({ message: "Error downloading photos", error });
  }
});


module.exports = router;
