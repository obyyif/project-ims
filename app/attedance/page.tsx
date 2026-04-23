"use client";

import React, { useState, useEffect } from "react";

export default function HalamanKehadiran() {
  // 1. STATE MANAGEMENT
  const [tabAktif, setTabAktif] = useState("Teori");
  const [tanggalTerpilih, setTanggalTerpilih] = useState(new Date().getDate());
  const [bulanSekarang, setBulanSekarang] = useState(new Date().getMonth());
  const [tahunSekarang, setTahunSekarang] = useState(2026);
  const [isClient, setIsClient] = useState(false);

  // Mencegah error hidrasi Next.js
  useEffect(() => {
    setIsClient(true);
  }, []);

  const namaBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // 2. LOGIKA KALENDER
  const hariDalamBulan = new Date(tahunSekarang, bulanSekarang + 1, 0).getDate();
  const hariPertama = new Date(tahunSekarang, bulanSekarang, 1).getDay(); 

  const hariKalender = [];
  for (let i = 0; i < hariPertama; i++) {
    hariKalender.push(null); 
  }
  for (let i = 1; i <= hariDalamBulan; i++) {
    hariKalender.push(i);
  }

  // 3. FUNGSI NAVIGASI
  const bulanLalu = () => {
    if (bulanSekarang === 0) {
      setBulanSekarang(11);
      setTahunSekarang(tahunSekarang - 1);
    } else {
      setBulanSekarang(bulanSekarang - 1);
    }
  };

  const bulanDepan = () => {
    if (bulanSekarang === 11) {
      setBulanSekarang(0);
      setTahunSekarang(tahunSekarang + 1);
    } else {
      setBulanSekarang(bulanSekarang + 1);
    }
  };

  if (!isClient) return null;

  return (
    <div style={styles.container}>
      {/* AREA KONTEN - Border Hitam Sudah Dihapus */}
      <div style={styles.contentArea}>
        
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => alert("Kembali")} style={styles.btnAksi}>❮</button>
          <h2 style={{ fontSize: "16px", fontWeight: "800", margin: 0 }}>Riwayat Kehadiran</h2>
          <button onClick={() => alert("Pilih Tanggal")} style={styles.btnAksi}>📅</button>
        </div>

        {/* TAB SWITCHER */}
        <div style={styles.tabContainer}>
          <button 
            onClick={() => setTabAktif("Teori")}
            style={{ 
              ...styles.tabItem, 
              backgroundColor: tabAktif === "Teori" ? "white" : "transparent", 
              color: tabAktif === "Teori" ? "#3B82F6" : "#64748B", 
              boxShadow: tabAktif === "Teori" ? "0 4px 6px rgba(0,0,0,0.05)" : "none" 
            }}>
            Kelas Teori
          </button>
          <button 
            onClick={() => setTabAktif("Workshop")}
            style={{ 
              ...styles.tabItem, 
              backgroundColor: tabAktif === "Workshop" ? "white" : "transparent", 
              color: tabAktif === "Workshop" ? "#3B82F6" : "#64748B", 
              boxShadow: tabAktif === "Workshop" ? "0 4px 6px rgba(0,0,0,0.05)" : "none" 
            }}>
            Workshop (PKL)
          </button>
        </div>

        {/* KALENDER */}
        <div style={styles.calendarCard}>
          <div style={styles.calendarHeader}>
            <button onClick={bulanLalu} style={styles.navArrow}>❮</button>
            <div style={styles.dateDisplay}>
              <span>{namaBulan[bulanSekarang]} {tahunSekarang}</span>
            </div>
            <button onClick={bulanDepan} style={styles.navArrow}>❯</button>
          </div>

          <div style={styles.grid7}>
            {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(hari => (
              <div key={hari} style={styles.dayLabel}>{hari}</div>
            ))}
            {hariKalender.map((hari, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                {hari && (
                  <button 
                    onClick={() => setTanggalTerpilih(hari)}
                    style={{ 
                      ...styles.dayBtn,
                      backgroundColor: tanggalTerpilih === hari ? "#007AFF" : (hari === 9 || hari === 13) ? "#DBEAFE" : "transparent",
                      color: tanggalTerpilih === hari ? "white" : (hari === 9 || hari === 13) ? "#007AFF" : "#475569",
                    }}>
                    {hari}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RINGKASAN */}
        <h3 style={styles.sectionTitle}>Ringkasan Bulanan</h3>
        <div style={styles.summaryGrid}>
          <div style={{ ...styles.sumCard, border: "1px solid #E2E8F0" }}>
            <div style={styles.sumLabel}>TOTAL HARI</div>
            <div style={{ ...styles.sumVal, color: "#1E293B" }}>22</div>
          </div>
          <div style={{ ...styles.sumCard, backgroundColor: "#F0FDF4", border: "1px solid #DCFCE7" }}>
            <div style={{...styles.sumLabel, color: "#16A34A"}}>HADIR</div>
            <div style={{ ...styles.sumVal, color: "#16A34A" }}>22</div>
          </div>
          <div style={{ ...styles.sumCard, backgroundColor: "#FFFBEB", border: "1px solid #FEF3C7" }}>
            <div style={{ ...styles.sumLabel, color: "#F59E0B" }}>SAKIT</div>
            <div style={{ ...styles.sumVal, color: "#F59E0B" }}>1</div>
          </div>
          <div style={{ ...styles.sumCard, backgroundColor: "#FEF2F2", border: "1px solid #FEE2E2" }}>
            <div style={{ ...styles.sumLabel, color: "#EF4444" }}>ALPA</div>
            <div style={{ ...styles.sumVal, color: "#EF4444" }}>1</div>
          </div>
        </div>

        {/* AKTIVITAS */}
        <h3 style={styles.sectionTitle}>Aktivitas Terakhir</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={styles.activityRow}>
            <div style={{ ...styles.iconBox, backgroundColor: "#22C55E" }}>➔</div>
            <div style={{ flex: 1 }}>
              <div style={styles.activityDate}>Tgl {tanggalTerpilih} {namaBulan[bulanSekarang]}</div>
              <div style={styles.activityTime}>Masuk pada 10.45 WIB</div>
            </div>
            <div style={styles.statusTag}>TEPAT WAKTU</div>
          </div>
        </div>

        {/* KEBIJAKAN */}
        <div style={styles.policyBox}>
          <div style={styles.policyHeader}>KEBIJAKAN SMK <span>ⓘ</span></div>
          <p style={styles.policyText}>Minimal kehadiran 90% untuk syarat kelulusan semester.</p>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", backgroundColor: "white", minHeight: "100vh", fontFamily: "Arial, sans-serif" },
  contentArea: { width: "100%", maxWidth: "400px", padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  btnAksi: { background: "#f8faf9", border: "1px solid #eee", borderRadius: "10px", width: "35px", height: "35px", cursor: "pointer" },
  tabContainer: { display: "flex", border: "2px dashed #3B82F6", borderRadius: "15px", padding: "3px", marginBottom: "20px", backgroundColor: "#eff6ff" },
  tabItem: { flex: 1, padding: "10px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "11px" },
  calendarCard: { border: "1px solid #f1f5f9", borderRadius: "20px", padding: "15px", marginBottom: "20px" },
  calendarHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  dateDisplay: { fontWeight: "700", color: "#475569", fontSize: "14px" },
  navArrow: { background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: "16px" },
  grid7: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" },
  dayLabel: { textAlign: "center", fontSize: "11px", color: "#94a3b8", fontWeight: "600", paddingBottom: "8px" },
  dayBtn: { width: "34px", height: "34px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  sectionTitle: { fontSize: "14px", fontWeight: "800", marginBottom: "10px", color: "#333" },
  summaryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" },
  sumCard: { padding: "12px", borderRadius: "15px" },
  sumLabel: { fontSize: "8px", fontWeight: "800", color: "#64748b", marginBottom: "4px" },
  sumVal: { fontSize: "18px", fontWeight: "800" },
  activityRow: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "12px", borderRadius: "15px", border: "1px solid #f1f5f9" },
  iconBox: { width: "35px", height: "35px", borderRadius: "10px", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" },
  activityDate: { fontSize: "12px", fontWeight: "700" },
  activityTime: { fontSize: "10px", color: "#64748b" },
  statusTag: { fontSize: "8px", fontWeight: "800", backgroundColor: "#e2e8f0", padding: "4px 8px", borderRadius: "5px" },
  policyBox: { backgroundColor: "#4f46e5", color: "white", padding: "15px", borderRadius: "15px", marginTop: "15px" },
  policyHeader: { display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "800", marginBottom: "5px" },
  policyText: { fontSize: "10px", margin: 0, opacity: 0.9 }
};