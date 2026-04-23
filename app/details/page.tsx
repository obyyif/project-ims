"use client";

import React, { useState } from "react";

const AssignmentDetails: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) {
      alert("Pilih file dulu!");
      return;
    }
    alert(`File "${file.name}" berhasil dikirim!`);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => alert("Back clicked")} style={styles.backBtn}>
          ← Back
        </button>
        <h3>Assignment Details</h3>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.badges}>
          <span style={styles.badgeBlue}>Networking Lab</span>
          <span style={styles.badgeOrange}>In Progress</span>
        </div>

        <h2>Praktik Instalasi Komputer Dasar</h2>

        {/* Timer */}
        <div style={styles.timer}>
          {["03", "09", "30", "00"].map((t, i) => (
            <div key={i} style={styles.timeBox}>
              {t}
            </div>
          ))}
        </div>

        {/* Instruction */}
        <div style={styles.section}>
          <h4>Instruction</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Resources */}
        <div style={styles.section}>
          <h4>Teacher’s Resources</h4>
          <button
            style={styles.resourceBtn}
            onClick={() => alert("Download PDF")}
          >
            📄 Panduan_Instalasi_v1.pdf
          </button>

          <button
            style={styles.resourceBtn}
            onClick={() => alert("Open Video")}
          >
            🔗 Video Tutorial Konfigurasi
          </button>
        </div>

        {/* Upload */}
        <div style={styles.section}>
          <h4>Your Submission</h4>

          <label style={styles.uploadBox}>
            <input type="file" onChange={handleFileChange} hidden />
            <span>
              {file ? file.name : "Tap to upload your file (max 25MB)"}
            </span>
          </label>
        </div>

        {/* Submit */}
        <button style={styles.submitBtn} onClick={handleSubmit}>
          Submit Assignment ✈
        </button>
      </div>
    </div>
  );
};

export default AssignmentDetails;

// 🎨 Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
    background: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    position: "absolute",
    top: 10,
    left: 20,
  },
  backBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 350,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  badges: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
  badgeBlue: {
    background: "#d0e7ff",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
  },
  badgeOrange: {
    background: "#ffe0b2",
    padding: "4px 8px",
    borderRadius: 8,
    fontSize: 12,
  },
  timer: {
    display: "flex",
    justifyContent: "space-between",
    margin: "15px 0",
  },
  timeBox: {
    background: "#e3f2fd",
    padding: 10,
    borderRadius: 8,
    width: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  section: {
    marginTop: 15,
  },
  resourceBtn: {
    display: "block",
    width: "100%",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fafafa",
    cursor: "pointer",
  },
  uploadBox: {
    display: "block",
    marginTop: 10,
    padding: 20,
    border: "2px dashed #ccc",
    borderRadius: 10,
    textAlign: "center",
    cursor: "pointer",
  },
  submitBtn: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#2196f3",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};