import React, { useEffect, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]); // State to hold the selected files

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "https://proekt.onrender.com/api/photos"
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
        "https://proekt.onrender.com/api/photos/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Fetch images again to see the newly uploaded images
      const response = await axios.get(
        "https://proekt.onrender.com/api/photos"
      );
      setImages(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://proekt.onrender.com/api/photos/delete/${id}`);
      // Optionally, refetch images or update state
      setImages(images.filter((image) => image._id !== id)); // Update the local state to remove the deleted image
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Function to delete all images
  const handleDeleteAll = async () => {
    try {
      await axios.delete("https://proekt.onrender.com/api/photos");
      // Clear images after deletion
      setImages([]);
    } catch (error) {
      console.error("Error deleting all images:", error);
    }
  };

  // Function to download all images
  const downloadAllImages = async () => {
    try {
      const response = await axios.get(
        "https://proekt.onrender.com/api/photos/download",
        {
          responseType: "blob", // Important for handling binary data
        }
      );

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "photos.zip"); // Name of the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up
    } catch (error) {
      console.error("Error downloading all images:", error);
    }
  };

  return (
    <div>
      {/* File upload form */}
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        {/* multiple attribute allows selecting more than one file */}
        <button type="submit">Upload Images</button>
      </form>

      {/* Download All button */}
      <button onClick={downloadAllImages} style={{ marginTop: "10px" }}>
        Download All Images
      </button>

      {/* Delete All button */}
      <button onClick={handleDeleteAll} style={{ marginTop: "10px" }}>
        Delete All Images
      </button>

      {/* Displaying fetched images */}
      {images.map((image) => (
        <div key={image._id} style={{ marginTop: "10px" }}>
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
          <br />
          {/* Delete button for each image */}
          <button onClick={() => handleDelete(image._id)}>
            Delete Picture
          </button>
        </div>
      ))}
    </div>
  );
};

export default FileUpload;
