import React, { useEffect, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]); // State to hold the selected files
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadMessage, setUploadMessage] = useState(""); // State for upload message

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

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

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
      setUploadMessage(`Your uploads are live!`);

      // Clear the message after a few seconds
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    // Set the upload message
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

  // Modal controls
  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const showNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const showPrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="container mx-auto p-4 bg-[#feffdf]">
      {/* File upload form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        />
        <button
          type="submit"
          className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
          Upload Images
        </button>
      </form>

      {/* Upload Message */}
      {uploadMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          {uploadMessage}
        </div>
      )}

      {/* Action Buttons */}
      {/*<div className="flex flex-col md:flex-row md:space-x-4 mb-4">
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
      </div>*/}

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div
            key={image._id}
            className="relative w-full h-64 cursor-pointer"
            onClick={() => openModal(index)}>
            {image.data ? (
              // For base64 data
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-lg border-2 border-yellow-400 shadow-lg transition-transform duration-200 hover:scale-105"
                src={`data:${image.contentType};base64,${image.data.toString(
                  "base64"
                )}`}
                alt={image.filename}
                onError={() => handleImageError(image.filename)}
              />
            ) : image.imageUrl ? (
              // For images stored as URLs
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-lg border-2 border-yellow-400 shadow-lg transition-transform duration-200 hover:scale-105"
                src={image.imageUrl}
                alt={image.filename}
                onError={() => handleImageError(image.filename)}
              />
            ) : (
              <p className="text-center">Image not available</p>
            )}
            {/*<button
              className=" bg-red-500 text-white rounded px-2 py-1 text-sm hover:bg-red-600"
              onClick={() => handleDelete(image._id)}>
              Delete Picture
            </button>*/}
          </div>
        ))}
      </div>

      {/* Modal for Image Viewer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <button
            className="absolute top-1 right-4 text-white text-4xl"
            onClick={closeModal}>
            &times;
          </button>
          <button
            className="absolute left-4 text-white text-6xl"
            onClick={showPrevImage}>
            &#8249;
          </button>
          <div className="w-11/12 md:w-3/5 lg:w-2/5">
            {images[currentImageIndex].data ? (
              <img
                className="w-full h-auto object-contain"
                src={`data:${
                  images[currentImageIndex].contentType
                };base64,${images[currentImageIndex].data.toString("base64")}`}
                alt={images[currentImageIndex].filename}
              />
            ) : (
              <img
                className="w-full h-auto object-contain"
                src={images[currentImageIndex].imageUrl}
                alt={images[currentImageIndex].filename}
              />
            )}
          </div>
          <button
            className="absolute right-4 text-white text-6xl"
            onClick={showNextImage}>
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
