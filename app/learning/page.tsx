"use client";

import { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");

  const modules = [
    {
      title: "Module 1: Laravel & Basis Data",
      items: [
        { title: "Latihan_Basis_Data", size: "5.0MB", type: "PDF" },
        { title: "Video Laravel Dasar", size: "01:33", type: "VIDEO" },
      ],
    },
    {
      title: "Module 2: Flutter",
      items: [
        { title: "Latihan_Flutter", size: "4.9MB", type: "PDF" },
        { title: "Tutorial Flutter", size: "01:33", type: "VIDEO" },
      ],
    },
    {
      title: "Module 3: Github",
      locked: true,
    },
  ];

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <span style={{ fontSize: 20 }}>☰</span>
        <h3 style={{ margin: 0 }}>Learning Materials</h3>
      </div>

      {/* PROGRESS */}
      <div style={styles.card}>
        <div style={styles.row}>
          <b>Course Progress</b>
          <span>16/20 Materials</span>
        </div>

        <div style={styles.progressBar}>
          <div style={styles.progressFill}></div>
        </div>

        <small>65% of the syllabus complete</small>
      </div>

      {/* SEARCH */}
      <input
        style={styles.search}
        placeholder="🔍 Search Materials..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* MODULE LIST */}
      {modules.map((module, idx) => (
        <div key={idx}>
          <h4 style={styles.moduleTitle}>{module.title}</h4>

          {"locked" in module ? (
            <div style={styles.locked}>
              🔒 Complete previous module to unlock
            </div>
          ) : (
            module.items
              ?.filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, i) => (
                <div key={i} style={styles.item}>
                  {/* ICON */}
                  <div style={styles.icon}>
                    {item.type === "PDF" ? "📄" : "▶️"}
                  </div>

                  {/* TEXT */}
                  <div style={{ flex: 1 }}>
                    <b>{item.title}</b>
                    <p style={styles.subText}>
                      {item.size} • {item.type}
                    </p>
                  </div>

                  {/* BUTTON */}
                  <button
                    style={styles.button}
                    onClick={() => alert(item.title)}
                  >
                    {item.type === "PDF" ? "Open" : "Watch"}
                  </button>
                </div>
              ))
          )}
        </div>
      ))}

      {/* BOTTOM NAV */}
      <div style={styles.nav}>
        <span onClick={() => alert("Home")}>🏠</span>
        <span onClick={() => alert("Teachers")}>👨‍🏫</span>
        <span onClick={() => alert("Courses")}>📚</span>
        <span onClick={() => alert("Profile")}>👤</span>
      </div>
    </div>
  );
}

const styles: { [key: string]: any } = {
  container: {
    maxWidth: 375,
    margin: "0 auto",
    padding: 16,
    background: "#f5f5f5",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  card: {
    background: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 8,
    background: "#ddd",
    borderRadius: 10,
    margin: "8px 0",
  },
  progressFill: {
    width: "65%",
    height: "100%",
    background: "#2979ff",
    borderRadius: 10,
  },
  search: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    marginBottom: 10,
  },
  moduleTitle: {
    marginTop: 15,
    marginBottom: 5,
  },
  item: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  icon: {
    fontSize: 20,
  },
  subText: {
    margin: 0,
    fontSize: 12,
    color: "#666",
  },
  button: {
    background: "#2979ff",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
  },
  locked: {
    background: "#e0e0e0",
    padding: 12,
    borderRadius: 12,
    color: "#666",
  },
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-around",
    background: "#fff",
    padding: 10,
    borderTop: "1px solid #ddd",
    fontSize: 20,
  },
};