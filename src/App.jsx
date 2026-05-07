import React from "react";
import SourcePanel from "./components/SourcePanel.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import ChartsPanel from "./components/ChartsPanel.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#8b5cf6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>DataMocha</span>
        </div>
        <div className="header-actions">
          <button className="btn-ghost">Share</button>
          <button className="btn-primary">New Project</button>
        </div>
      </header>
      <main className="panels">
        <SourcePanel />
        <ChatPanel />
        <ChartsPanel />
      </main>
    </div>
  );
}
