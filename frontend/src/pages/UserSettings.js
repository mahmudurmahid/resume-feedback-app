import React, { useState, useEffect } from "react";
import axios from "axios";

function UserSettings() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const backendUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchProfile = async () => {
      const authToken = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${backendUrl}/api/profile/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setEmail(response.data.email);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async () => {
    const authToken = localStorage.getItem("access_token");
    try {
      await axios.post(
        `${backendUrl}/api/change-password/`,
        { old_password: oldPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
      alert("Password change failed.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account?")) return;
    const authToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`${backendUrl}/api/delete-account/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Account deleted.");
      localStorage.clear();
      window.location.href = "/register";
    } catch (err) {
      console.error(err);
      alert("Account deletion failed.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-heading font-bold mb-6">Account Settings</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Email</h2>
        <p>{email || "Loading..."}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="block w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handlePasswordChange}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Change Password
        </button>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-500 text-white rounded"
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
