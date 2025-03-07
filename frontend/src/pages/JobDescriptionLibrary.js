import React, { useState, useEffect } from "react";
import axios from "axios";

function JobDescriptionLibrary() {
  const [descriptions, setDescriptions] = useState([]);
  const backendUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchDescriptions = async () => {
      const authToken = localStorage.getItem("access_token");
      try {
        const response = await axios.get(
          `${backendUrl}/api/job-descriptions/`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setDescriptions(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDescriptions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-heading font-bold mb-6">
        Job Description Library
      </h1>
      {descriptions.length === 0 ? (
        <p>No job descriptions saved yet.</p>
      ) : (
        descriptions.map((desc) => (
          <div
            key={desc.id}
            className="p-4 mb-4 border rounded bg-white shadow"
          >
            <pre className="whitespace-pre-wrap">{desc.pasted_text}</pre>
          </div>
        ))
      )}
    </div>
  );
}

export default JobDescriptionLibrary;
