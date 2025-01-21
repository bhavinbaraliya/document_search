import React from "react";
import Chatbot from "./Components/ChatBox";
import Navbar from "./Components/Navbar";
import UploadPDF from "./Components/UploadPDF";

function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Upload PDF Section */}
      
      <Navbar/>
     

      {/* Chatbot Section */}
      <div style={{ flex: 1, backgroundColor: "#F9FAFB", overflow: "hidden" }}>
        <Chatbot />
      </div>
    </div>
  );
}

export default App;