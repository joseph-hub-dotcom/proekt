import React, { useEffect, useState } from "react";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner"; // Import the spinner
import { Badge, Button } from "@material-tailwind/react";
import { Alert } from "@material-tailwind/react";

const FileUpload = (props) => {
  const [images, setImages] = useState([]);
  const [firstFileName, setFirstFileName] = useState(""); // State for the first file name
  const [visibleImages, setVisibleImages] = useState(10); // State to track number of images displayed
  const [files, setFiles] = useState([]); // State to hold the selected files
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [uploadMessage, setUploadMessage] = useState(""); // State for upload message
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true); // Set loading to true
      try {
        const response = await axios.get("https://proekt.onrender.com/api/photos");
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchImages();
  }, []);

  const handleImageError = (filename) => {
    console.warn(`Image file not found for: ${filename}`);
  };

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files; // Get the selected files
    setFiles(selectedFiles); // Update the files state

    // Update the firstFileName state with the name of the first selected file
    if (selectedFiles.length > 0) {
      setFirstFileName(selectedFiles[0].name);
    } else {
      setFirstFileName(""); // Reset if no files are selected
    }
  };

  // Handle button click to trigger hidden file input
  const handleButtonClick = () => {
    document.getElementById("hiddenFileInput").click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Append each selected file to formData
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }

    setLoading(true); // Set loading to true
    try {
      await axios.post("https://proekt.onrender.com/api/photos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Fetch images again to see the newly uploaded images
      const response = await axios.get("https://proekt.onrender.com/api/photos");
      setImages(response.data);
      setUploadMessage(`Your uploads are live!`);

      // Clear the name of the first file after upload
      setFirstFileName(""); // Reset file name after upload

      // Clear the message after a few seconds
      setTimeout(() => setUploadMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setLoading(false); // Set loading to false after uploading
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

  const handleShowMore = () => {
    setVisibleImages((prev) => prev + 10); // Show 10 more images
  };

  const remainingImages = images.length - visibleImages; // Calculate remaining images

  return (
    <div className="container mx-auto p-4 bg-[#fcfefe]">
      <p className="mb-3 text-4xl font-bold font-yellowtail text-center text-[#c51350] dark:text-[#c51350] font-parisienne">
        Rozita and David's Wedding
      </p>
      {/* File upload form */}
      <form
        onSubmit={handleSubmit}
        className="mb-4 w-full flex justify-center items-center gap-3">
        <input
          type="file"
          id="hiddenFileInput"
          multiple
          onChange={handleFileChange}
          className="hidden" // Hide the input
        />

        <Button
          variant="gradient"
          color="indigo"
          className="flex items-center font-nunito font-bold gap-3 w-[180px] h-[45px]"
          onClick={handleButtonClick}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M19 13a1 1 0 00-1 1v.38l-1.48-1.48a2.79 2.79 0 00-3.93 0l-.7.7-2.48-2.48a2.85 2.85 0 00-3.93 0L4 12.6V7a1 1 0 011-1h7a1 1 0 000-2H5a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3v-5a1 1 0 00-1-1zM5 20a1 1 0 01-1-1v-3.57l2.9-2.9a.79.79 0 011.09 0l3.17 3.17 4.3 4.3zm13-1a.89.89 0 01-.18.53L13.31 15l.7-.7a.77.77 0 011.1 0L18 17.21zm4.71-14.71l-3-3a1 1 0 00-.33-.21 1 1 0 00-.76 0 1 1 0 00-.33.21l-3 3a1 1 0 001.42 1.42L18 4.41V10a1 1 0 002 0V4.41l1.29 1.3a1 1 0 001.42 0 1 1 0 000-1.42z" />
          </svg>
          {firstFileName
            ? `Choose Files (${
                firstFileName.length > 5
                  ? firstFileName.substring(0, 5) + "..."
                  : firstFileName
              })`
            : "Choose Files"}
        </Button>
        {files.length > 0 && (
          <Button
            variant="gradient"
            color="pink"
            type="submit"
            className="flex items-center font-nunito font-bold gap-3 w-[180px] h-[45px]"
            ripple={true}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            <p>Upload Photos</p>
          </Button>
        )}
      </form>

      {/* Upload Message */}
      {uploadMessage && (
        <Alert color="green" className="mb-4 font-poppins font-md text-white">
          {uploadMessage}
        </Alert>
      )}

      {/* Spinner Loading */}
      {loading && (
        <div className="flex justify-center items-center mb-4">
          <InfinitySpin
            visible={true}
            width="200"
            color="#c3195d"
            ariaLabel="infinity-spin-loading"
          />
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.slice(0, visibleImages).map((image, index) => (
          <div
            key={image._id}
            className="relative w-full h-64 cursor-pointer"
            onClick={() => openModal(index)}>
            {image.data ? (
              // For base64 data
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-lg border-2 border-[#f76b8a] shadow-lg transition-transform duration-200 hover:scale-105"
                src={`data:${image.contentType};base64,${image.data.toString(
                  "base64"
                )}`}
                alt={image.filename}
                onError={() => handleImageError(image.filename)}
              />
            ) : image.imageUrl ? (
              // For images stored as URLs
              <img
                className="absolute inset-0 w-full h-full object-cover rounded-lg border-2 border-[#f76b8a] shadow-lg transition-transform duration-200 hover:scale-105"
                src={image.imageUrl}
                alt={image.filename}
                onError={() => handleImageError(image.filename)}
              />
            ) : (
              <p className="text-center">Image not available</p>
            )}
          </div>
        ))}
      </div>
      {remainingImages > 0 && (
        <div className="flex justify-center items-center mt-4">
          {" "}
          {/* Flex container */}
          <Badge content={remainingImages} className="mt-4">
            <Button
              variant="outlined"
              onClick={handleShowMore}
              className="flex items-center gap-2 mt-4">
              Load More{" "}
              <svg
                fill="currentColor"
                viewBox="0 0 16 16"
                className="h-5 w-5"
                {...props}>
                <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z" />
              </svg>
            </Button>
          </Badge>
        </div>
      )}

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
