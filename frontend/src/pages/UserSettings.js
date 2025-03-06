import React, { useState, useEffect } from "react";
import axios from "axios";

function UserSettings() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const backendUrl = "http://127.0.0.1:8000";

  // ✅ Get user email on page load
  useEffect(() => {
    const fetchProfile = async () => {
      const authToken = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${backendUrl}/api/profile/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEmail(response.data.email);
      } catch (err) {
        console.error("Failed to fetch profile:", err.response);
      }
    };
    fetchProfile();
  }, []);

  // ✅ Change password
  const handlePasswordChange = async () => {
    const authToken = localStorage.getItem("access_token");
    try {
      await axios.post(
        `${backendUrl}/api/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Password change failed:", err.response);
      alert("Failed to change password.");
    }
  };

  // ✅ Delete account
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

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* ✅ Show email */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Email</h2>
        <p>{email || "Loading..."}</p>
      </div>

      {/* ✅ Change password */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="block mb-2 p-2 border w-full"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="block mb-4 p-2 border w-full"
        />
        <button
          onClick={handlePasswordChange}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Change Password
        </button>
      </div>

      {/* ✅ Actions */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Actions</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-500 text-white rounded mr-2"
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default UserSettings;
