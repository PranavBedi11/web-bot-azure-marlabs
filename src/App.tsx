import { useState } from "react";

const AZURE_FUNCTION_URL = `https://marlabs-server-webbot.azurewebsites.net/api/HttpTrigger1?code=YXSCAUXr5wu2qsi9A0bRhq1qPYgiSgbPN8x-u_Segl2qAzFuprs8Dg==`;

type Message = {
  type: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const response = await fetch(AZURE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: input,
          history: messages,
        }),
      });

      const data = await response.json();
      const botMsg: Message = { type: "bot", text: data.reply || "No response." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = { type: "bot", text: "Error contacting server." };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.type === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ width: "80%" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
