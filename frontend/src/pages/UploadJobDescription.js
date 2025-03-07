import React, { useState } from "react";
import axios from "axios";

function UploadJobDescription() {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const backendUrl = "http://127.0.0.1:8000";

  const handleUpload = async () => {
    const authToken = localStorage.getItem("access_token");
    if (!authToken) {
      alert("You must be logged in.");
      return;
    }
    if (!file && !pastedText) {
      alert("Please provide a file or paste text.");
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
      alert("Job description uploaded!");
    } catch (err) {
      alert("Upload failed.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow rounded-2xl dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6">
        Upload Job Description
      </h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-3 border rounded-xl mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
      />
      <textarea
        placeholder="Or paste job description here"
        value={pastedText}
        onChange={(e) => setPastedText(e.target.value)}
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

export default UploadJobDescription;
