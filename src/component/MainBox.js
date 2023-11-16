import React, { useState } from "react";
import axios from "axios";
import "./Chatbot.css";
const API_KEY =
  "***************************************************************************************************************************************************";
const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const chatWithGPT3 = async (userInput) => {
    const apiEndpoint = "https://api.edenai.run/v2/text/chat/stream";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    };

    const data = {
      response_as_dict: true,
      attributes_as_list: false,
      show_original_response: false,
      temperature: 0,
      max_tokens: 150,
      fallback_type: "continue",
      providers: "openai",
      chatbot_global_action:
        "You are a helpful assistant and answer questions realted to CSS if user asks other than CSS then say I am not trained for this. ",
      text: userInput,
    };
    try {
      const response = await axios.post(apiEndpoint, data, { headers });

      return response.data;
    } catch (error) {
      console.error("Error communicating with the API:", error.message);
      return "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don't send an empty message
    if (!input.trim()) return;
    // Add the message to the list of messages
    const userMessage = { text: input, user: true };
    // setMessages([...messages, userMessage]);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    // Clear the input field
    const aiMessage = { text: "...", user: false };
    //
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    const response = await chatWithGPT3(input);

    const newAiMessage = { text: response, user: false };
    setMessages((prevMessages) => [...prevMessages.slice(0, -1), newAiMessage]);
    setInput("");
  };
  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.user ? "user-message" : "ai-message"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form className="chatbot-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};
export default Chatbot;
