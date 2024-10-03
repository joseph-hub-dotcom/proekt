import React from "react";
import logo from "./lovelens.png";

const Navbar = () => {
  return (
    <nav className="bg-[#eaf6f6] p-4 border-[#f76b8a] shadow-lg border-b-[5px]">
      <div className="container mx-auto flex justify-center">
        <img src={logo} alt="Lens Logo" className="h-10" />
      </div>
    </nav>
  );
};

export default Navbar;
