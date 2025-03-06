import React, { useState, useEffect } from "react";
import axios from "axios";

function VersionHistory() {
  const [versions, setVersions] = useState([]);
  const backendUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchVersions = async () => {
      const authToken = localStorage.getItem("access_token");
      const response = await axios.get(`${backendUrl}/api/versions/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setVersions(response.data);
    };
    fetchVersions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Version History</h1>
      <ul>
        {versions.map((version) => (
          <li key={version.id} className="mb-4 p-4 border rounded">
            <p>
              <strong>Created:</strong>{" "}
              {new Date(version.created_at).toLocaleString()}
            </p>
            <pre className="whitespace-pre-wrap">{version.tailored_resume}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VersionHistory;
