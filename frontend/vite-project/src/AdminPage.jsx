import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component
import Spinner from "./Spinner"; // Import the Spinner component

const AdminPanel = () => {
  const [media, setMedia] = useState([]);
  const [visibleMedia, setVisibleMedia] = useState([]); // To track visible media
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correctPassword, setCorrectPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mediaCount] = useState(20); // Track number of media to show

  useEffect(() => {
    const checkAuthentication = () => {
      const authenticated = localStorage.getItem("isAdminAuthenticated") === "true";
      if (authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsModalOpen(true);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia(); // Fetch initial media
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchAdminPassword = async () => {
      if (isModalOpen) {
        try {
          const response = await axios.get("http://localhost:3000/api/admin/password");
          setCorrectPassword(response.data.password);
        } catch (error) {
          console.error("Error fetching admin password:", error);
          setErrorMessage("Failed to fetch admin password.");
        }
      }
    };

    fetchAdminPassword();
  }, [isModalOpen]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/photos");
      if (!response.data || response.data.length === 0) {
        throw new Error("No media found.");
      }
      setMedia(response.data); // Store all media
      setVisibleMedia(response.data.slice(0, mediaCount)); // Show first 20 media
    } catch (error) {
      console.error("Error fetching media:", error);
      setErrorMessage("Failed to fetch media.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMedia = () => {
    const nextMedia = media.slice(visibleMedia.length, visibleMedia.length + mediaCount);
    setVisibleMedia((prevVisibleMedia) => [...prevVisibleMedia, ...nextMedia]); // Append more media
  };

  const handlePasswordSubmit = (password) => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem("isAdminAuthenticated", "true");
      setIsModalOpen(false);
    } else {
      alert("Incorrect password. Access denied.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this picture?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/photos/delete/${id}`);
        setVisibleMedia(visibleMedia.filter((item) => item._id !== id)); // Update visible media
        setMedia(media.filter((item) => item._id !== id)); // Update full media list
      } catch (error) {
        console.error("Error deleting media:", error);
        alert("Failed to delete media.");
      }
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all images?");
    if (confirmed) {
      try {
        await axios.delete("http://localhost:3000/api/photos");
        setVisibleMedia([]);
        setMedia([]);
      } catch (error) {
        console.error("Error deleting all media:", error);
        alert("Failed to delete all media.");
      }
    }
  };

  const downloadAllImages = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/photos/download", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "photos.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading all images:", error);
      alert("Failed to download images.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center p-5">
      <nav className="bg-green-500 p-4 w-full">
        <h1 className="text-white text-2xl text-center">Admin Panel</h1>
      </nav>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {isAuthenticated && (
        <div className="mb-4 flex space-x-2">
          <button
            onClick={handleLogout}
            className="bg-[#e0ffcd] hover:bg-[#c2ff9b] transition-colors text-black font-bold py-2 px-4 rounded shadow"
          >
            Logout
          </button>

          <button
            onClick={downloadAllImages}
            className="bg-[#e0ffcd] hover:bg-[#c2ff9b] transition-colors text-black font-bold py-2 px-4 rounded shadow"
          >
            Download All Images
          </button>

          <button
            onClick={handleDeleteAll}
            className="bg-[#ffcab0] hover:bg-[#ffb3a0] transition-colors text-black font-bold py-2 px-4 rounded shadow"
          >
            Delete All Images
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-4">
        {visibleMedia.map((item) => (
          <div key={item._id} className="border rounded-lg p-2 shadow-lg">
            <h3 className="font-semibold">{item.filename}</h3>
            {item.data ? (
              <img
                src={`data:${item.contentType};base64,${item.data}`}
                alt={item.filename}
                className="w-32 h-auto"
              />
            ) : (
              <p>Media not available</p>
            )}
            <button
              onClick={() => handleDelete(item._id)}
              className="bg-[#e0ffcd] hover:bg-[#c2ff9b] transition-colors text-black font-bold py-1 px-2 rounded mt-2 shadow"
            >
              Delete Picture
            </button>
          </div>
        ))}
      </div>

      {loading && <Spinner />}
      
      {!loading && visibleMedia.length < media.length && (
        <div className="flex flex-col items-center mt-4">
          <p className="text-gray-600">
            {media.length - visibleMedia.length} more photos to load
          </p>
          <button
            onClick={loadMoreMedia} // Load more media on button click
            className="bg-[#e0ffcd] hover:bg-[#c2ff9b] transition-colors text-black font-bold py-2 px-4 rounded mt-2 shadow"
          >
            Load More Photos
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
