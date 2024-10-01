// App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./FileUpload"; // Assuming your upload component is here
import AdminPage from "./AdminPage"; // Import your AdminPage component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/admin" element={<AdminPage />} /> {/* Add this line */}
      </Routes>
    </Router>
  );
};

export default App;
