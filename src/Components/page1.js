import React from "react";
import Navbar from "./Navbar"; // Adjust the path based on your file structure

const Page1 = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          backgroundColor: "#f9f9f9",
          padding: "20px",
        }}
      >
        {/* Empty space for future content */}
      </main>

      {/* Footer */}
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          borderTop: "1px solid #eee",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          placeholder="Send a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ddd",
            marginRight: "10px",
          }}
        />
        <button
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </footer>
    </div>
  );
};

export default Page1;
