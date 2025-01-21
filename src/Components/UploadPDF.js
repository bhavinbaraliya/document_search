import React, { useState } from "react";
import Group from "../assets/Group.png"; // Ensure correct path to the image

function UploadPDF() {
  const [fileName, setFileName] = useState("demo.pdf");

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name); // Update file name
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://127.0.0.1:8000/upload/", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          console.log("File uploaded successfully");
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={Group}
          alt="Group"
          style={{
            width: "10px",
            height: "15px",
            marginRight: "10px",
          }}
        />
        <span style={{ fontSize: "16px", fontWeight: "500", color: "green" }}>
          {fileName}
        </span>
      </div>

      <button
        onClick={triggerFileInput}
        style={{
          backgroundColor: "#ffffff",
          color: "black",
          fontWeight: "bold",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "2px solid black",
          cursor: "pointer",
        }}
      >
        &#8853; Upload PDF
      </button>

      <input
        type="file"
        id="fileInput"
        accept=".pdf"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
    </div>
  );
}

export default UploadPDF;
