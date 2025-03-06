import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const backendUrl = "http://127.0.0.1:8000";

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;

  try {
    const response = await axios.post(`${backendUrl}/api/token/refresh/`, {
      refresh: refreshToken,
    });
    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (err) {
    console.error("Failed to refresh token:", err.response);
    return false;
  }
}

function TailorResume() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You are not logged in!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    console.log("Fetching latest files...");
    const fetchFiles = async () => {
      const authToken = localStorage.getItem("access_token");
      if (!authToken) {
        console.error("No access token found!");
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/latest-files/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("Latest files loaded:", response.data);
        setResumeText(response.data.resume_text);
        setJobDescription(response.data.job_description);
      } catch (err) {
        console.error("Error fetching latest files:", err.response);
        setError("Failed to load latest files.");
      }
    };
    fetchFiles();
  }, []);

  const handleTailor = async (retry = false) => {
    setLoading(true);
    setError("");

    let authToken = localStorage.getItem("access_token");

    if (!resumeText || !jobDescription) {
      setError("One or both fields are empty. Please fill them in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/tailor-resume/`,
        {
          resume_text: resumeText,
          job_description: jobDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setTailoredResume(response.data.tailored_resume);
    } catch (err) {
      if (err.response && err.response.status === 401 && !retry) {
        console.warn("Access token expired. Refreshing...");
        const newToken = await refreshAccessToken();
        if (newToken) {
          await handleTailor(true); // Retry once with the new token
        } else {
          setError("Session expired. Please log in again.");
          navigate("/login");
        }
      } else {
        console.error("Error tailoring resume:", err.response);
        setError("Error tailoring resume. Please try again.");
      }
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const element = document.createElement("div");
    element.innerHTML = tailoredResume;
    const textOnly = element.innerText;
    doc.text(textOnly, 10, 10);
    doc.save("Tailored_Resume.pdf");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tailor Your Resume</h1>

      <textarea
        className="w-full p-2 border mb-4"
        placeholder="Paste your resume text here"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <textarea
        className="w-full p-2 border mb-4"
        placeholder="Paste the job description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => handleTailor()}
        disabled={loading}
      >
        {loading ? "Tailoring..." : "Tailor Resume"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {tailoredResume && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Tailored Resume</h2>

          <ReactQuill
            value={tailoredResume}
            onChange={setTailoredResume}
            className="bg-white"
            theme="snow"
          />

          <button
            className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            onClick={handleDownload}
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default TailorResume;
