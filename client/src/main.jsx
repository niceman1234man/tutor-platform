// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅ named import
import { TutorProvider } from "./context/TutorContext";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TutorProvider>
          <App />
        </TutorProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);