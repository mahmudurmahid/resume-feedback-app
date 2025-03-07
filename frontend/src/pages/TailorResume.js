import React, { useState, useEffect } from "react";
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
        console.error(err);
        setError("Failed to load latest files.");
      }
    };
    fetchFiles();
  }, []);

  const handleTailor = async () => {
    setLoading(true);
    const authToken = localStorage.getItem("access_token");
    try {
      const response = await axios.post(
        `${backendUrl}/api/tailor-resume/`,
        { resume_text: resumeText, job_description: jobDescription },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setTailoredResume(response.data.tailored_resume);
    } catch (err) {
      console.error(err);
      setError("Error tailoring resume.");
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(tailoredResume, 10, 10);
    doc.save("Tailored_Resume.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-heading font-bold mb-6">
        Tailor Your Resume
      </h1>
      <textarea
        className="w-full p-3 border rounded mb-4"
        placeholder="Paste your resume text"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
      <textarea
        className="w-full p-3 border rounded mb-4"
        placeholder="Paste the job description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
      <button
        onClick={handleTailor}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-6"
      >
        {loading ? "Tailoring..." : "Tailor Resume"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {tailoredResume && (
        <>
          <ReactQuill
            theme="snow"
            value={tailoredResume}
            onChange={setTailoredResume}
            className="mb-4 bg-white"
          />
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Download as PDF
          </button>
        </>
      )}
    </div>
  );
}

export default TailorResume;
