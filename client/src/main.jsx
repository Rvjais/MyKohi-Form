import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import FormsPage from "./pages/FormsPage";
import FormPage from "./pages/FormPage";
import SubmissionsPage from "./pages/SubmissionsPage";
import SubmissionViewPage from "./pages/SubmissionViewPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import SettingsPage from "./pages/SettingsPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public form route - no sidebar */}
        <Route path="/form/:slug" element={<FormPage />} />

        {/* Dashboard routes with sidebar */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="flows" element={<FormsPage />} />
          <Route path="flows/new" element={<FormBuilderPage />} />
          <Route path="flows/:id/edit" element={<FormBuilderPage />} />
          <Route path="submissions" element={<SubmissionsPage />} />
          <Route path="submissions/:id" element={<SubmissionViewPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
