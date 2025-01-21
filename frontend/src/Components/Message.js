import React from "react";

function Message({ sender, text }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 15px",
          borderRadius: "8px",
          backgroundColor: sender === "S" ? "#e8f5e9" : "#f1f1f1",
          color: "#000000",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <strong>{sender}: </strong>
        {text}
      </div>
    </div>
  );
}

export default Message;