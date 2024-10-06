import React from "react";
import logo from "./white-transp.png";

const Navbar = () => {
  return (
    <nav className="bg-[#EC2784] p-0 border-[#f76b8a] shadow-lg border-b-[5px]">
      <div className="container mx-auto flex justify-center h-20 items-center">
        <img
          src={logo}
          alt="Lovies Logo"
          className="h-[50%] w-[60%] object-contain"
        />
      </div>
    </nav>
  );
};

export default Navbar;
