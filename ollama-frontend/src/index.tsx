import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx"; // Ensure this import is correct
import "./index.css"; // Ensure the CSS file exists

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
