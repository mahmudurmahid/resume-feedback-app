import React, { useState, useEffect } from "react";
import axios from "axios";

function VersionHistory() {
  const [versions, setVersions] = useState([]);
  const backendUrl = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchVersions = async () => {
      const authToken = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${backendUrl}/api/versions/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setVersions(response.data);
      } catch (error) {
        console.error("Failed to fetch versions:", error.response);
      }
    };
    fetchVersions();
  }, []);

  const handleDelete = async (id) => {
    const authToken = localStorage.getItem("access_token");
    if (!window.confirm("Delete this version?")) return;

    try {
      await axios.delete(`${backendUrl}/api/versions/${id}/delete/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setVersions(versions.filter((v) => v.id !== id));
      alert("Version deleted!");
    } catch (error) {
      console.error("Delete failed:", error.response);
    }
  };

  const handleRestore = async (id) => {
    const authToken = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/versions/${id}/restore/`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      await navigator.clipboard.writeText(response.data.tailored_resume);
      alert("Tailored resume copied to clipboard!");
    } catch (error) {
      console.error("Restore failed:", error.response);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-heading font-bold mb-6">Version History</h1>
      {versions.length === 0 ? (
        <p>No versions saved yet.</p>
      ) : (
        versions.map((version) => (
          <div
            key={version.id}
            className="p-4 mb-4 border rounded bg-white shadow"
          >
            <p className="text-sm text-gray-600">
              Created: {new Date(version.created_at).toLocaleString()}
            </p>
            <pre className="whitespace-pre-wrap p-2 bg-gray-100 rounded my-2">
              {version.tailored_resume}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => handleRestore(version.id)}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Restore
              </button>
              <button
                onClick={() => handleDelete(version.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default VersionHistory;
