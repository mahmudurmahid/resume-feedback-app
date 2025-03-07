import React, { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const backendUrl = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    const authToken = localStorage.getItem("access_token");
    if (!authToken) {
      alert("You must be logged in.");
      return;
    }
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${backendUrl}/api/upload/resume/`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Resume uploaded!");
    } catch (err) {
      alert("Upload failed.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow rounded-2xl dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6">
        Upload Resume
      </h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-3 border rounded-xl mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
      />
      <button
        onClick={handleUpload}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl"
      >
        Upload
      </button>
    </div>
  );
}

export default UploadResume;
