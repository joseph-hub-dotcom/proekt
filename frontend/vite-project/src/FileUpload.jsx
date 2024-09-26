import React, { useEffect, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]); // State to hold the selected files

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://proekt-theta.vercel.app/api/photos"
        );
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageError = (filename) => {
    console.warn(`Image file not found for: ${filename}`);
  };

  const handleFileChange = (event) => {
    setFiles(event.target.files); // Set the selected files (allows multiple)
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Append each selected file to formData
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    try {
      await axios.post(
        "https://https://proekt-theta.vercel.app/api/photos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Optionally fetch images again to see the newly uploaded images
      const response = await axios.get(
        "https://https://proekt-theta.vercel.app/api/photos"
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      {/* File upload form */}
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />{" "}
        {/* multiple attribute allows selecting more than one file */}
        <button type="submit">Upload Images</button>
      </form>

      {/* Displaying fetched images */}
      {images.map((image) => (
        <div key={image._id}>
          <h3>{image.filename}</h3>
          {image.data ? (
            // For base64 data
            <img
              src={`data:${image.contentType};base64,${image.data.toString(
                "base64"
              )}`}
              alt={image.filename}
              style={{ width: "200px", height: "auto" }}
              onError={() => handleImageError(image.filename)} // Handle image error
            />
          ) : image.imageUrl ? (
            // For images stored as URLs
            <img
              src={image.imageUrl}
              alt={image.filename}
              style={{ width: "200px", height: "auto" }}
              onError={() => handleImageError(image.filename)} // Handle image error
            />
          ) : (
            <p>Image not available</p> // In case no src is available
          )}
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
