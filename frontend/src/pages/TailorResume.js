import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const backendUrl = "http://127.0.0.1:8000";

function TailorResume() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("access_token");
    if (!authToken) {
      alert("You are not logged in!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchFiles = async () => {
      const authToken = localStorage.getItem("access_token");
      try {
        const response = await axios.get(`${backendUrl}/api/latest-files/`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setResumeText(response.data.resume_text);
        setJobDescription(response.data.job_description);
      } catch (err) {
        setError("Failed to load latest files.");
      }
    };
    fetchFiles();
  }, []);

  const handleTailor = async () => {
    setLoading(true);
    setError("");
    const authToken = localStorage.getItem("access_token");

    try {
      const response = await axios.post(
        `${backendUrl}/api/tailor-resume/`,
        { resume_text: resumeText, job_description: jobDescription },
        {
          headers: {
            Authorization: `Bearer ${authToken}"`,
            "Content-Type": "application/json",
          },
        }
      );
      setTailoredResume(response.data.tailored_resume);
    } catch (err) {
      setError("Error tailoring resume. Please try again.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const tempElement = document.createElement("div");
    tempElement.innerHTML = tailoredResume;
    doc.text(tempElement.innerText, 10, 10);
    doc.save("Tailored_Resume.pdf");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded-2xl dark:bg-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-6">
        Tailor Your Resume
      </h1>

      <textarea
        className="w-full p-3 border rounded-xl mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
        placeholder="Paste your resume text here"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <textarea
        className="w-full p-3 border rounded-xl mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
        placeholder="Paste the job description here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleTailor}
        disabled={loading}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl"
      >
        {loading ? "Tailoring..." : "Tailor Resume"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {tailoredResume && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Tailored Resume
          </h2>
          <ReactQuill
            value={tailoredResume}
            onChange={setTailoredResume}
            className="bg-white dark:bg-gray-700"
            theme="snow"
          />
          <button
            onClick={handleDownload}
            className="mt-4 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
          >
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default TailorResume;
