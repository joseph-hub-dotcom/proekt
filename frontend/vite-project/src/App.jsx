import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FileUpload from "./FileUpload";
import Navbar from "./NavBar";
import AdminPage from "./AdminPage"; // Import your AdminPage component

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                <FileUpload />
              </div>
            }
          />
          <Route path="/admin" element={<AdminPage />} /> {/* Add this line */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
