import React from "react";
import axios from "axios";

function UserSettings() {
  const backendUrl = "http://127.0.0.1:8000";

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmDelete) return;

    const authToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`${backendUrl}/api/delete-account/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Account deleted.");
      localStorage.clear();
      window.location.href = "/register";
    } catch (error) {
      console.error("Failed to delete account:", error.response);
      alert("Error deleting account.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <button
        onClick={handleDeleteAccount}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Delete Account
      </button>
    </div>
  );
}

export default UserSettings;
