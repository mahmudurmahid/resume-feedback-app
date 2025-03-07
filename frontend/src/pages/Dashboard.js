import React from "react";

function Dashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded-2xl dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-4">
        Dashboard
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Welcome to your dashboard! Navigate using the menu to tailor your
        resume, view version history, and manage your settings.
      </p>
    </div>
  );
}

export default Dashboard;
