import React from "react";
import logo1 from "../assets/logo1.png"; // Add your logo path

import UploadPDF from "./UploadPDF";

function Navbar() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between", // Ensures space between logo and file upload section
        alignItems: "center",
        padding: "5px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e5e5",
        marginLeft: "10px",
      }}
    >
      {/* Logo and Title */}
      <div >
        <img
          src={logo1}
          alt="Logo"
          style={{ width: "85px", height: "40px", marginRight: "10px" }}
        />
      </div>

      {/* Container for File Name and Upload Button */}
      <div
       
      >
        {/* PDF Info Section */}
        {/* <span
          style={{
            marginRight: "10px", // Space between file name and button
            fontSize: "14px",
            color: "#333",
            fontWeight: 500,
          }}
        >
          demo.pdf
        </span> */}

        {/* Upload Button */}
        
         <UploadPDF/>

        {/* <button
          style={{
            backgroundColor: "#00AB56",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          + Upload PDF
        </button> */}
      </div>
    </header>
  );
}

export default Navbar;
