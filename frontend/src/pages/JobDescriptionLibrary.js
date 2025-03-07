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
    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded-2xl dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6">
        Job Description Library
      </h1>
      {descriptions.length === 0 ? (
        <p className="text-lg text-gray-700 dark:text-gray-300">
          No job descriptions saved yet.
        </p>
      ) : (
        <ul className="space-y-4">
          {descriptions.map((desc) => (
            <li
              key={desc.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow"
            >
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
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
