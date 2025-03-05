import React from "react";
import { useState } from "react";
import axios from "axios";

function UploadJobDescription() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("pasted_text", text);

    await axios.post("/api/upload/job-description/", formData, {
      headers: {
        Authorization: `Bearer testtoken123`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Job description uploaded!");
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <textarea
        placeholder="Paste job description"
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleUpload}>Upload Job Description</button>
    </div>
  );
}

export default UploadJobDescription;
