import React, { useState } from "react";
import axios from "axios";

function UploadResume() {
  const [file, setFile] = useState(null);
  const backendUrl = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    const authToken = localStorage.getItem("access_token");
    if (!file) return alert("Select a file first!");
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
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 class="text-2xl font-heading font-bold mb-4 text-primary">
        Upload Resume
      </h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-4"
      />
      <button class="px-4 py-2 bg-secondary text-white rounded-xl hover:bg-primary">
        Upload
      </button>
    </div>
  );
}

export default UploadResume;
