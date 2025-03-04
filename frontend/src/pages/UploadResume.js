import React from "react";

export default function UploadResume() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Upload Your Resume</h1>
      <input type="file" accept=".pdf,.doc,.docx" />
    </div>
  );
}
