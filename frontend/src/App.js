import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import UploadJobDescription from "./pages/UploadJobDescription";
import TailorResume from "./pages/TailorResume";
import DownloadResume from "./pages/DownloadResume";
import VersionHistory from "./pages/VersionHistory";
import UserSettings from "./pages/UserSettings";
import JobDescriptionLibrary from "./pages/JobDescriptionLibrary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "upload-resume", element: <UploadResume /> },
      { path: "upload-job", element: <UploadJobDescription /> },
      { path: "tailor-resume", element: <TailorResume /> },
      { path: "download-resume", element: <DownloadResume /> },
      { path: "versions", element: <VersionHistory /> },
      { path: "settings", element: <UserSettings /> },
      { path: "job-library", element: <JobDescriptionLibrary /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
