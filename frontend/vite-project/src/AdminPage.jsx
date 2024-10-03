import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Import the Modal component

const AdminPanel = () => {
  const [media, setMedia] = useState([]); // Renamed from images to media
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [correctPassword, setCorrectPassword] = useState(""); // State to hold the correct password

  useEffect(() => {
    const checkAuthentication = () => {
      const authenticated =
        localStorage.getItem("isAdminAuthenticated") === "true";
      if (authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsModalOpen(true); // Open the modal for password input if not authenticated
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMedia(); // Fetch media only if authenticated
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchAdminPassword = async () => {
      if (isModalOpen) {
        try {
          const response = await axios.get(
            "https://proekt.onrender.com/api/admin/password"
          );
          setCorrectPassword(response.data.password);
        } catch (error) {
          console.error("Error fetching admin password:", error);
        }
      }
    };

    fetchAdminPassword();
  }, [isModalOpen]);

  const fetchMedia = async () => {
    try {
      const response = await axios.get(
        "https://proekt.onrender.com/api/photos"
      ); // Adjust the endpoint if needed
      setMedia(response.data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
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
    try {
      await axios.delete(`https://proekt.onrender.com/api/photos/delete/${id}`);
      setMedia(media.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting media:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete("https://proekt.onrender.com/api/photos");
      setMedia([]);
    } catch (error) {
      console.error("Error deleting all media:", error);
    }
  };

  const downloadAllImages = async () => {
    try {
      const response = await axios.get(
        "https://proekt.onrender.com/api/photos/download",
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "photos.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading all images:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    setIsAuthenticated(false);
    setIsModalOpen(true); // Reopen modal on logout
  };

  // Count images and videos
  const imageCount = media.filter((item) =>
    item.contentType.startsWith("image/")
  ).length;
  const videoCount = media.filter((item) =>
    item.contentType.startsWith("video/")
  ).length;

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

      {isAuthenticated && (
        <div className="mb-4">
          <button
            onClick={handleLogout}
            className="bg-[#e0ffcd] text-black font-bold py-2 px-4 rounded mr-2">
            Logout
          </button>

          <button
            onClick={downloadAllImages}
            className="bg-[#e0ffcd] text-black font-bold py-2 px-4 rounded mr-2">
            Download All Images
          </button>

          <button
            onClick={handleDeleteAll}
            className="bg-[#ffcab0] text-black font-bold py-2 px-4 rounded">
            Delete All Images
          </button>
        </div>
      )}

      {isAuthenticated && (
        <div>
          <h2 className="font-bold">Media Count:</h2>
          <p>Images: {imageCount}</p>
          <p>Videos: {videoCount}</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {media.map((item) => (
              <div key={item._id} className="border rounded-lg p-2">
                <h3 className="font-semibold">{item.filename}</h3>
                {item.data ? (
                  <img
                    src={`data:${item.contentType};base64,${item.data}`}
                    alt={item.filename}
                    className="w-32 h-auto" // Set the size you want
                  />
                ) : (
                  <p>Media not available</p>
                )}
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-[#e0ffcd] text-black font-bold py-1 px-2 rounded mt-2">
                  Delete Picture
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
