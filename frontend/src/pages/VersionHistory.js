import React, { useState, useEffect } from "react";
import axios from "axios";

function VersionHistory() {
  const [versions, setVersions] = useState([]);
  const backendUrl = "http://127.0.0.1:8000";

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

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleDelete = async (id) => {
    const authToken = localStorage.getItem("access_token");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this version?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${backendUrl}/api/versions/${id}/delete/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Version deleted!");
      fetchVersions(); // Refresh the list after deleting
    } catch (error) {
      console.error("Failed to delete version:", error.response);
      alert("Error deleting version.");
    }
  };

  const handleRestore = async (id) => {
    const authToken = localStorage.getItem("access_token");

    try {
      const response = await axios.get(
        `${backendUrl}/api/versions/${id}/restore/`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const restoredText = response.data.tailored_resume;
      await navigator.clipboard.writeText(restoredText);
      alert("Tailored resume copied to clipboard! Paste it into your editor.");
    } catch (error) {
      console.error("Failed to restore version:", error.response);
      alert("Error restoring version.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Version History</h1>
      {versions.length === 0 ? (
        <p>No versions saved yet.</p>
      ) : (
        <ul>
          {versions.map((version) => (
            <li
              key={version.id}
              className="mb-4 p-4 border rounded bg-white shadow"
            >
              <p className="text-sm text-gray-600 mb-2">
                <strong>Created:</strong>{" "}
                {new Date(version.created_at).toLocaleString()}
              </p>
              <pre className="whitespace-pre-wrap p-2 bg-gray-100 rounded mb-2">
                {version.tailored_resume}
              </pre>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRestore(version.id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(version.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VersionHistory;
