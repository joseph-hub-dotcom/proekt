import React, { useEffect, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);

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

      const response = await axios.get("http://localhost:3000/api/photos");
      setImages(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/photos/delete/${id}`);
      setImages(images.filter((image) => image._id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit">Upload Images</button>
      </form>

      {images.length > 0 ? (
        images.map((image) => (
          <div key={image._id}>
            <h3>{image.filename}</h3>
            <img
              src={`data:${image.contentType};base64,${image.data}`}
              alt={image.filename}
              style={{ width: "200px", height: "auto" }}
            />
          </div>
        ))
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
};

export default FileUpload;
