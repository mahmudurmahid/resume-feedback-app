import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow container mx-auto px-6 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
