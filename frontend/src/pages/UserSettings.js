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
        console.error("Failed to fetch profile:", err.response);
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
      alert("Password changed!");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert("Failed to change password.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    const authToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`${backendUrl}/api/delete-account/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Account deleted.");
      localStorage.clear();
      window.location.href = "/register";
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Account Settings
      </h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">Email</h2>
        <p className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
          {email || "Loading..."}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="block mb-2 p-3 border rounded w-full"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="block mb-4 p-3 border rounded w-full"
        />
        <button
          onClick={handlePasswordChange}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Change Password
        </button>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Delete Account
          </button>
        </div>
      </section>
    </div>
  );
}

export default UserSettings;
