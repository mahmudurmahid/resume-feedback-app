import React, { useState } from "react";
import axios from "axios";

function UploadJobDescription() {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const backendUrl = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    const authToken = localStorage.getItem("access_token");
    if (!file && !pastedText) return alert("Select a file or paste text.");
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
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-heading font-bold mb-4">
        Upload Job Description
      </h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-4"
      />
      <textarea
        placeholder="Or paste job description"
        value={pastedText}
        onChange={(e) => setPastedText(e.target.value)}
        className="block w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
    </div>
  );
}

export default UploadJobDescription;
