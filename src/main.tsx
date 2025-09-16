import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// PWA service worker register
import { registerSW } from "virtual:pwa-register";
import PWAPrompt from "./components/PWAPrompt";
import { DraftsProvider } from "./context/DraftsContext";

registerSW();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DraftsProvider>
        <App />
      </DraftsProvider>
      <PWAPrompt />
    </BrowserRouter>
  </React.StrictMode>
);

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
