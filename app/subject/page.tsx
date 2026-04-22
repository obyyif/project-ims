"use client";

import React, { useState } from "react";

export default function SubjectPage() {
  const [activeSemester, setActiveSemester] = useState("Current");

  // Data
  const coreVocational = [
    { id: 1, title: "Web Development", teacher: "Bpk. andriansyah maulana", icon: "🌐" },
    { id: 2, title: "Flutter", teacher: "Ibu. Revy Cahya", icon: "💙" },
    { id: 3, title: "Database system", teacher: "Bpk. Asep ulumudin", icon: "🗄️" },
  ];

  const generalEducation = [
    { id: 4, title: "Profesional Matematika", teacher: "Ibu. Heti Kusmawati", icon: "🧠" }
  ];

  return (
    <div style={{ 
      maxWidth: "400px", margin: "0 auto", minHeight: "100vh", backgroundColor: "white", 
      fontFamily: "sans-serif", position: "relative", border: "1px solid #eee"
    }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "15px 20px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => alert("Menu")} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>☰</button>
          <img src="https://ui-avatars.com/api/?name=User" alt="avatar" style={{ width: "35px", height: "35px", borderRadius: "50%" }} />
        </div>
        <button onClick={() => alert("Search")} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>🔍</button>
      </div>

      <div style={{ padding: "0 20px 100px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>My Subjects</h1>
        
        {/* SEMESTER TABS */}
        <div style={{ display: "flex", backgroundColor: "#f0f0f0", borderRadius: "12px", padding: "4px", margin: "20px 0" }}>
          {["Current", "Semester 1", "Semester 2"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSemester(tab)}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: "8px", cursor: "pointer",
                backgroundColor: activeSemester === tab ? "white" : "transparent",
                color: activeSemester === tab ? "#0084ff" : "#888",
                fontWeight: "bold", zIndex: 10
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CORE VOCATIONAL */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", borderBottom: "3px solid #0084ff" }}>Core Vocational</h2>
          <span style={{ fontSize: "11px", backgroundColor: "#7EBEFF", color: "white", padding: "3px 10px", borderRadius: "8px" }}>3 Subject</span>
        </div>

        {coreVocational.map((sub) => (
          <div key={sub.id} style={{ display: "flex", backgroundColor: "#F9F9F9", padding: "15px", borderRadius: "20px", marginBottom: "15px", border: "1px solid #f0f0f0" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "15px", margin: "0 0 5px 0" }}>{sub.title}</h3>
              <p style={{ fontSize: "12px", color: "#888", margin: "0 0 10px 0" }}>{sub.teacher}</p>
              <button 
                onClick={() => alert(`Materi ${sub.title}`)} 
                style={{ backgroundColor: "#0084ff", color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }}
              >
                View Material
              </button>
            </div>
            <div style={{ width: "60px", height: "60px", backgroundColor: "white", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>{sub.icon}</div>
          </div>
        ))}

        {/* GENERAL EDUCATION */}
        <h2 style={{ fontSize: "18px", fontWeight: "bold", marginTop: "20px" }}>General Education</h2>
        {generalEducation.map((sub) => (
          <div key={sub.id} style={{ display: "flex", backgroundColor: "#F9F9F9", padding: "15px", borderRadius: "20px", marginTop: "15px" }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "15px", margin: "0" }}>{sub.title}</h3>
              <p style={{ fontSize: "12px", color: "#888" }}>{sub.teacher}</p>
              <button 
                onClick={() => alert("Materi Matematika")} 
                style={{ backgroundColor: "#7EBEFF", color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", cursor: "pointer" }}
              >
                View Material &gt;
              </button>
            </div>
            <div style={{ width: "60px", height: "60px", backgroundColor: "white", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" }}>{sub.icon}</div>
          </div>
        ))}
      </div>

      {/* NAVIGASI BAWAH - DIPERBAIKI AREA KLIKNYA */}
      <div style={{ 
        position: "fixed", bottom: "10px", left: "50%", transform: "translateX(-50%)", 
        width: "90%", maxWidth: "360px", height: "70px", backgroundColor: "white", 
        borderRadius: "20px", display: "flex", boxShadow: "0 5px 20px rgba(0,0,0,0.1)", 
        border: "1px solid #eee", zIndex: 9999, overflow: "hidden" 
      }}>
        {["🏠 Home", "👥 Teachers", "🎓 Courses", "👤 Profile"].map((item, idx) => (
          <div 
            key={item}
            onClick={() => alert(`Ke ${item}`)}
            style={{ 
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", 
              justifyContent: "center", cursor: "pointer", pointerEvents: "auto",
              color: idx === 2 ? "#0084ff" : "#aaa"
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.split(' ')[0]}</span>
            <span style={{ fontSize: "10px" }}>{item.split(' ')[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}