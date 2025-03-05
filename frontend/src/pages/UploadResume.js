import React, { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const backendUrl = "http://127.0.0.1:8000"; // ✅ Backend URL

  const handleUpload = async () => {
    const authToken = localStorage.getItem("access_token");

    if (!authToken) {
      alert("You must be logged in to upload a resume.");
      return;
    }

    if (!file) {
      alert("Please select a file before uploading.");
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
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.response);
      alert("Failed to upload resume.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload Resume
      </button>
    </div>
  );
}

export default UploadResume;
