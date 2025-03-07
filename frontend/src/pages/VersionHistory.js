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
    } catch (err) {
      alert("Failed to fetch versions.");
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this version?"))
      return;
    const authToken = localStorage.getItem("access_token");
    try {
      await axios.delete(`${backendUrl}/api/versions/${id}/delete/`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      alert("Version deleted!");
      fetchVersions();
    } catch (err) {
      alert("Error deleting version.");
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
    } catch (err) {
      alert("Error restoring version.");
    }
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Version History
      </h1>
      {versions.length === 0 ? (
        <p>No versions saved yet.</p>
      ) : (
        <ul className="space-y-4">
          {versions.map((version) => (
            <li
              key={version.id}
              className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Created: {new Date(version.created_at).toLocaleString()}
              </p>
              <pre className="whitespace-pre-wrap p-3 bg-gray-100 dark:bg-gray-700 rounded mb-4">
                {version.tailored_resume}
              </pre>
              <div className="flex gap-4">
                <button
                  onClick={() => handleRestore(version.id)}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Restore
                </button>
                <button
                  onClick={() => handleDelete(version.id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
