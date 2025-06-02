import AppProvider from "@context/context-provider.jsx";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { StrictMode } from "react";
import "./index.css";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </StrictMode>
  </HashRouter>
);
