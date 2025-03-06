import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

function Layout() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
          <Link to="/" className="text-2xl font-extrabold text-blue-600">
            CV Feedback
          </Link>
          <div className="flex flex-wrap gap-4 items-center">
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/upload-resume" className="hover:underline">
              Upload Resume
            </Link>
            <Link to="/upload-job" className="hover:underline">
              Upload Job
            </Link>
            <Link to="/tailor-resume" className="hover:underline">
              Tailor Resume
            </Link>
            <Link to="/versions" className="hover:underline">
              History
            </Link>
            <Link to="/settings" className="hover:underline">
              Settings
            </Link>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-5 h-5 text-gray-800" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4 text-center text-sm">
        © {new Date().getFullYear()} CV Feedback App. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;
