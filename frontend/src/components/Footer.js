import React from "react";

function Footer() {
  return (
    <footer className="bg-blue-100 dark:bg-gray-800 py-4">
      <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} CV Feedback App. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
