import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure CSS is imported
import logo from './lama.png'
interface Message {
  user: string;
  bot: string;
}

const App: React.FC = () => {
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/models")
      .then(response => setModels(response.data))
      .catch(error => console.error("Error fetching models:", error));
  }, []);

  const sendMessage = async () => {
    if (!input || !selectedModel) return;

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        model: selectedModel,
        message: input
      });

      let cleanedResponse = response.data.response
      .replace(/<think>.*?<\/think>/gis, "")  // Replace multiple new lines with a single new line
      .trim();                   // Remove leading/trailing whitespace


      setMessages([...messages, { user: input, bot: cleanedResponse }]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="container">
       {/* ✅ Display logo at the top */}
       <div className="logo-container">
        <img src={logo} alt="malama" className="logo" />
      </div>


      <div className="dropdown-container">
        <label htmlFor="model-select">Choose a Model:</label>
        <select
          id="model-select"
          value={selectedModel || ""}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="">-- Select a Model --</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {selectedModel && (
        <div className="chat-container">
          <h2>Chat with {selectedModel}</h2>
          <div className="chat-box" style={{border:"none"}}>
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <p><strong>You:</strong> {msg.user}</p>
                <p><strong>{selectedModel}:</strong> {msg.bot}</p>
              </div>
            ))}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
