import React from "react";
import { Link } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="bg-blue-100 dark:bg-gray-800 py-4 shadow">
      <div className="container mx-auto flex justify-between items-center px-6">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-700 dark:text-blue-300"
        >
          CV Feedback App
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/tailor-resume">Tailor Resume</Link>
          <Link to="/version-history">Version History</Link>
          <Link to="/job-description-library">Job Library</Link>
          <Link to="/settings">Settings</Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-green-400 hover:bg-green-500 text-white rounded-xl"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
