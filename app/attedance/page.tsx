"use client";

import React, { useState, useEffect } from "react";

export default function AttendancePage() {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState("Theory");
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(2026);
  const [isClient, setIsClient] = useState(false);

  // Mencegah error hidrasi Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // 2. LOGIKA KALENDER (Otomatis hitung jumlah hari & posisi)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null); 
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // 3. FUNGSI NAVIGASI
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  if (!isClient) return null;

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => alert("Kembali ke Dashboard")} style={styles.btnAction}>❮</button>
          <h2 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>Attendance Records</h2>
          <button onClick={() => alert("Pilih Tanggal")} style={styles.btnAction}>📅</button>
        </div>

        {/* TAB SWITCHER */}
        <div style={styles.tabContainer}>
          <button 
            onClick={() => setActiveTab("Theory")}
            style={{ ...styles.tabItem, backgroundColor: activeTab === "Theory" ? "white" : "transparent", color: activeTab === "Theory" ? "#3B82F6" : "#64748B", boxShadow: activeTab === "Theory" ? "0 4px 6px rgba(0,0,0,0.05)" : "none" }}>
            Theory Class
          </button>
          <button 
            onClick={() => setActiveTab("Workshop")}
            style={{ ...styles.tabItem, backgroundColor: activeTab === "Workshop" ? "white" : "transparent", color: activeTab === "Workshop" ? "#3B82F6" : "#64748B", boxShadow: activeTab === "Workshop" ? "0 4px 6px rgba(0,0,0,0.05)" : "none" }}>
            Workshop (PKL)
          </button>
        </div>

        {/* CALENDAR BOX */}
        <div style={styles.calendarCard}>
          <div style={styles.calendarHeader}>
            <button onClick={handlePrevMonth} style={styles.navArrow}>❮</button>
            <div style={styles.dateDisplay}>
              <span>{monthNames[currentMonth]} {currentYear}</span>
            </div>
            <button onClick={handleNextMonth} style={styles.navArrow}>❯</button>
          </div>

          <div style={styles.grid7}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
              <div key={d} style={styles.dayLabel}>{d}</div>
            ))}
            {calendarDays.map((day, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                {day && (
                  <button 
                    onClick={() => setSelectedDate(day)}
                    style={{ 
                      ...styles.dayBtn,
                      backgroundColor: selectedDate === day ? "#007AFF" : (day === 9 || day === 13) ? "#DBEAFE" : "transparent",
                      color: selectedDate === day ? "white" : (day === 9 || day === 13) ? "#007AFF" : "#475569",
                    }}>
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <h3 style={styles.sectionTitle}>Monthly Summary</h3>
        <div style={styles.summaryGrid}>
          <div onClick={() => alert("Total Hari: 22")} style={{ ...styles.sumCard, border: "1px solid #E2E8F0" }}>
            <div style={styles.sumLabel}>📋 TOTAL DAYS</div>
            <div style={{ ...styles.sumVal, color: "#1E293B" }}>22</div>
          </div>
          <div onClick={() => alert("Hadir: 22")} style={{ ...styles.sumCard, backgroundColor: "#F0FDF4", border: "1px solid #DCFCE7" }}>
            <div style={{...styles.sumLabel, color: "#16A34A"}}>PRESENT</div>
            <div style={{ ...styles.sumVal, color: "#16A34A" }}>22</div>
          </div>
          <div onClick={() => alert("Izin/Sakit: 1")} style={{ ...styles.sumCard, backgroundColor: "#FFFBEB", border: "1px solid #FEF3C7" }}>
            <div style={{ ...styles.sumLabel, color: "#F59E0B" }}>SICK</div>
            <div style={{ ...styles.sumVal, color: "#F59E0B" }}>1</div>
          </div>
          <div onClick={() => alert("Alpa: 1")} style={{ ...styles.sumCard, backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}>
            <div style={{ ...styles.sumLabel, color: "#EF4444" }}>ABSENT</div>
            <div style={{ ...styles.sumVal, color: "#EF4444" }}>1</div>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <h3 style={styles.sectionTitle}>Recent Activity</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div onClick={() => alert("Detail Masuk")} style={styles.activityRow}>
            <div style={{ ...styles.iconBox, backgroundColor: "#22C55E" }}>➔</div>
            <div style={{ flex: 1 }}>
              <div style={styles.activityDate}>Tgl {selectedDate} {monthNames[currentMonth]}</div>
              <div style={styles.activityTime}>Checked in at 10.45 AM</div>
            </div>
            <div style={styles.statusTag}>ON TIME</div>
          </div>
          
          <div onClick={() => alert("Detail Keluar")} style={styles.activityRow}>
            <div style={{ ...styles.iconBox, backgroundColor: "#3B82F6" }}>←</div>
            <div style={{ flex: 1 }}>
              <div style={styles.activityDate}>Tgl 5 {monthNames[currentMonth]}</div>
              <div style={styles.activityTime}>Checked out at 04.05 PM</div>
            </div>
            <div style={styles.statusTag}>DONE</div>
          </div>
        </div>

        {/* POLICY BOX */}
        <div onClick={() => alert("Info Kebijakan SMK")} style={styles.policyBox}>
          <div style={styles.policyHeader}>SMK POLICY <span>ⓘ</span></div>
          <p style={styles.policyText}>Minimal kehadiran 90% untuk lulus semester.</p>
        </div>

      </div>
    </div>
  );
}

// 4. SEMUA STYLE DIKUMPULKAN DI SINI (Agar Rapih & Gak Error)
const styles = {
  container: { display: "flex", justifyContent: "center", padding: "20px", backgroundColor: "#f3f4f6", minHeight: "100vh" },
  phoneFrame: { width: "100%", maxWidth: "380px", backgroundColor: "white", borderRadius: "30px", padding: "20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "4px solid #333" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  btnAction: { background: "#f8faf9", border: "1px solid #eee", borderRadius: "10px", width: "35px", height: "35px", cursor: "pointer" },
  tabContainer: { display: "flex", border: "2px dashed #3B82F6", borderRadius: "15px", padding: "3px", marginBottom: "20px", backgroundColor: "#eff6ff" },
  tabItem: { flex: 1, padding: "10px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "12px" },
  calendarCard: { border: "1px solid #f1f5f9", borderRadius: "20px", padding: "15px", marginBottom: "20px" },
  calendarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  dateDisplay: { fontWeight: "700", color: "#475569", fontSize: "15px" },
  navArrow: { background: "#f1f5f9", border: "none", borderRadius: "8px", width: "30px", height: "30px", cursor: "pointer" },
  grid7: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" },
  dayLabel: { textAlign: "center", fontSize: "11px", color: "#94a3b8", fontWeight: "600", paddingBottom: "8px" },
  dayBtn: { width: "34px", height: "34px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" },
  sectionTitle: { fontSize: "14px", fontWeight: "800", marginBottom: "10px" },
  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  sumCard: { padding: "12px", borderRadius: "15px", cursor: "pointer" },
  sumLabel: { fontSize: "9px", fontWeight: "800", color: "#64748b" },
  sumVal: { fontSize: "22px", fontWeight: "800" },
  activityRow: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "15px", cursor: "pointer", border: "1px solid #f1f5f9" },
  iconBox: { width: "35px", height: "35px", borderRadius: "10px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  activityDate: { fontSize: "12px", fontWeight: "700" },
  activityTime: { fontSize: "10px", color: "#64748b" },
  statusTag: { fontSize: "8px", fontWeight: "800", backgroundColor: "#e2e8f0", padding: "4px 8px", borderRadius: "5px" },
  policyBox: { backgroundColor: "#4f46e5", color: "white", padding: "15px", borderRadius: "15px", marginTop: "15px", cursor: "pointer" },
  policyHeader: { display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "800", marginBottom: "5px" },
  policyText: { fontSize: "10px", margin: 0, opacity: 0.9 }
};