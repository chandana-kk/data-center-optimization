import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import { AppShell } from "./shell/AppShell";
import { Landing } from "./pages/Landing";
import { Auth } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { DigitalTwin } from "./pages/DigitalTwin";
import { Sandbox } from "./pages/Sandbox";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Chatbot } from "./pages/Chatbot";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/infrastructure" element={<AnalyticsPage type="infrastructure" />} />
          <Route path="/energy" element={<AnalyticsPage type="energy" />} />
          <Route path="/cooling" element={<AnalyticsPage type="cooling" />} />
          <Route path="/network" element={<AnalyticsPage type="network" />} />
          <Route path="/storage" element={<AnalyticsPage type="storage" />} />
          <Route path="/ai-recommendations" element={<AnalyticsPage type="recommendations" />} />
          <Route path="/predictions" element={<AnalyticsPage type="predictions" />} />
          <Route path="/optimization" element={<AnalyticsPage type="cloud" />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
