import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import UploadJobDescription from "./pages/UploadJobDescription";
import TailorResume from "./pages/TailorResume";
import DownloadResume from "./pages/DownloadResume";
import VersionHistory from "./pages/VersionHistory";
import JobDescriptionLibrary from "./pages/JobDescriptionLibrary";
import UserSettings from "./pages/UserSettings";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/upload-resume", element: <UploadResume /> },
  { path: "/upload-job-description", element: <UploadJobDescription /> },
  { path: "/tailor-resume", element: <TailorResume /> },
  { path: "/download-resume", element: <DownloadResume /> },
  { path: "/version-history", element: <VersionHistory /> },
  { path: "/job-description-library", element: <JobDescriptionLibrary /> },
  { path: "/settings", element: <UserSettings /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
