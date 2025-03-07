import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/token/", {
        username,
        password,
      });

      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);

      alert("Logged in!");
      navigate("/tailor-resume");
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow rounded-2xl dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6">
        Login
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
