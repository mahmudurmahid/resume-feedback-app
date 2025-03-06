import React, { useState, useEffect } from "react";
import axios from "axios";

function JobDescriptionLibrary() {
  const [descriptions, setDescriptions] = useState([]);
  const backendUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchDescriptions = async () => {
      const authToken = localStorage.getItem("access_token");
      const response = await axios.get(`${backendUrl}/api/job-descriptions/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setDescriptions(response.data);
    };
    fetchDescriptions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Description Library</h1>
      {descriptions.length === 0 ? (
        <p>No job descriptions saved yet.</p>
      ) : (
        <ul>
          {descriptions.map((desc) => (
            <li
              key={desc.id}
              className="mb-4 p-4 border rounded bg-white shadow"
            >
              <pre className="whitespace-pre-wrap">
                {desc.pasted_text || "Uploaded file (download link here later)"}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobDescriptionLibrary;
