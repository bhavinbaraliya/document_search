import React, { useState } from "react";
import f1 from "../assets/f1.png";
import u1 from "../assets/u1.png";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { type: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/generate-response/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      
      if (response.ok) {
        const { response: botResponse } = await response.json();  // Adjusted key here
        const botMessage = { type: "bot", text: botResponse };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        const botMessage = {
          type: "bot",
          text: "Sorry, there was an error processing your request.",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", marginLeft: "100px" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", backgroundColor: "#F9FAFB" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "15px",
              justifyContent: "flex-start",
            }}
          >
            {message.type === "bot" && (
              <img
                src={f1}
                alt="Bot"
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
            )}
            {message.type === "user" && (
              <img
                src={u1}
                alt="User"
                style={{
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                  borderRadius: "50%",
                }}
              />
            )}
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor: message.type === "user" ? "#E5E7EB" : "#00AB56",
                color: message.type === "user" ? "#000" : "#FFFFFF",
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px",
          backgroundColor: "#FFFFFF",
          position: "relative",
          marginLeft: "100px",
          marginRight: "100px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          style={{
            flex: 1,
            padding: "10px 15px",
            border: "1px solid #E5E7EB",
            borderRadius: "4px",
            fontSize: "14px",
            paddingRight: "50px",
            outline: "none",
            marginLeft: "20px",
          }}
        />

        <button
          onClick={handleSendMessage}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "1px 20px",
            backgroundColor: "#ffffff",
            color: "black",
            border: "2px solid transparent",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "20px",
            marginLeft: "10px",
          }}
        >
          &#11162;
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
