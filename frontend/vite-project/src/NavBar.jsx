import React from "react";
import logo from "./lovelens.png";

const Navbar = () => {
  return (
    <nav className="bg-[#ffebbb] p-4 border-[#ffb5b5] shadow-lg border-b-[5px]">
      <div className="container mx-auto flex justify-center">
        <img src={logo} alt="Lens Logo" className="h-10" />
      </div>
    </nav>
  );
};

export default Navbar;
