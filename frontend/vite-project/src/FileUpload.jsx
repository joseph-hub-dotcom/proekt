import React, { useEffect, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]); // State to hold the selected files

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/photos");
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
      await axios.post("http://localhost:3000/api/photos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Fetch images again to see the newly uploaded images
      const response = await axios.get("http://localhost:3000/api/photos");
      setImages(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/photos/delete/${id}`);
      // Optionally, refetch images or update state
      setImages(images.filter((image) => image._id !== id)); // Update the local state to remove the deleted image
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // Function to delete all images
  const handleDeleteAll = async () => {
    try {
      await axios.delete("http://localhost:3000/api/photos");
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
        "http://localhost:3000/api/photos/download",
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
    <div className="container mx-auto p-4">
      {/* File upload form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600">
          Upload Images
        </button>
      </form>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <button
          onClick={downloadAllImages}
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600">
          Download All Images
        </button>
        <button
          onClick={handleDeleteAll}
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 mt-2 md:mt-0">
          Delete All Images
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {images.map((image) => (
          <div key={image._id} className="flex flex-col">
            {image.data ? (
              // For base64 data
              <img
                className="h-auto w-full rounded-lg object-cover transition-transform duration-200 hover:scale-105"
                src={`data:${image.contentType};base64,${image.data.toString(
                  "base64"
                )}`}
                alt={image.filename}
                onError={() => handleImageError(image.filename)} // Handle image error
              />
            ) : image.imageUrl ? (
              // For images stored as URLs
              <img
                className="h-auto w-full rounded-lg object-cover transition-transform duration-200 hover:scale-105"
                src={image.imageUrl}
                alt={image.filename}
                onError={() => handleImageError(image.filename)} // Handle image error
              />
            ) : (
              <p className="text-center">Image not available</p> // In case no src is available
            )}
            <h3 className="text-center mt-2">{image.filename}</h3>
            {/* Delete button for each image */}
            <button
              className="mt-2 bg-red-500 text-white rounded px-2 py-1 text-sm hover:bg-red-600"
              onClick={() => handleDelete(image._id)}>
              Delete Picture
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
