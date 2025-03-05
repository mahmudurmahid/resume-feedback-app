import React, { useState } from "react";
import axios from "axios";

function UploadJobDescription() {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const backendUrl = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    const authToken = localStorage.getItem("access_token");

    if (!authToken) {
      alert("You must be logged in to upload a job description.");
      return;
    }

    if (!file && !pastedText) {
      alert("Please select a file or paste a job description.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (pastedText) formData.append("pasted_text", pastedText);

    try {
      await axios.post(`${backendUrl}/api/upload/job-description/`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Job description uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.response);
      alert("Failed to upload job description.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload Job Description</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block mb-4"
      />
      <textarea
        placeholder="Or paste the job description here"
        value={pastedText}
        onChange={(e) => setPastedText(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload Job Description
      </button>
    </div>
  );
}

export default UploadJobDescription;
