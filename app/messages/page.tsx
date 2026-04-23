"use client";

import React, { useState } from "react";

export default function HalamanPesan() {
  const [tabAktif, setTabAktif] = useState("Semua");
  const [kataKunci, setKataKunci] = useState("");
  const [chatTerpilih, setChatTerpilih] = useState(null);
  const [navAktif, setNavAktif] = useState("Kursus");

  const dataPesan = [
    { id: 1, kategori: "Guru", nama: "Andriansyah Maulana", pesan: "Guys MBG udah ada?", waktu: "10.45", belumDibaca: 1, avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, kategori: "Grup", nama: "XI-PPL 2 BURONAN WARGA", pesan: "Messi: Jadwal besok apa coo", waktu: "09.12", belumDibaca: 0, avatar: "https://i.pravatar.cc/150?u=2", status: "unread_blue" },
    { id: 3, kategori: "Guru", nama: "Heti Kusmawati", pesan: "Sampah sampah , baju rapihkan", waktu: "Kemarin", belumDibaca: 0, avatar: "https://i.pravatar.cc/150?u=3", status: "read" },
    { id: 4, kategori: "Guru", nama: "Eky Ayu Puspitasari", pesan: "Hayuu Di antos di perpuss...", waktu: "Selasa", belumDibaca: 0, avatar: "https://i.pravatar.cc/150?u=4", status: "read" },
    { id: 5, kategori: "Guru", nama: "Revy Cahya Alamsyah", pesan: "Kalian buka ya vs code nya", waktu: "Senin", belumDibaca: 0, avatar: "https://i.pravatar.cc/150?u=5", status: "read" },
  ];

  const pesanTerfilter = dataPesan.filter((msg) => {
    const cocokTab = tabAktif === "Semua" || msg.kategori === tabAktif;
    const cocokCari = msg.nama.toLowerCase().includes(kataKunci.toLowerCase());
    return cocokTab && cocokCari;
  });

  // --- TAMPILAN RUANG CHAT ---
  if (chatTerpilih) {
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "#f9f9f9", minHeight: "100vh", fontFamily: "sans-serif" }}>
        {/* Header Chat */}
        <div style={{ display: "flex", alignItems: "center", padding: "15px", backgroundColor: "white", borderBottom: "1px solid #eee" }}>
          <button 
            onClick={() => setChatTerpilih(null)} 
            style={{ border: "none", background: "#eee", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", marginRight: "10px", fontWeight: "bold" }}
          >
            ←
          </button>
          <img src={chatTerpilih.avatar} style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "12px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>{chatTerpilih.nama}</div>
            <div style={{ fontSize: "11px", color: "green" }}>Online</div>
          </div>
          <button onClick={() => alert("Fitur Telepon")} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>📞</button>
        </div>

        {/* Isi Chat */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "15px", borderTopLeftRadius: 0, fontSize: "13px", maxWidth: "80%", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
            {chatTerpilih.pesan}
          </div>
          <div style={{ backgroundColor: "#007AFF", color: "white", padding: "12px", borderRadius: "15px", borderTopRightRadius: 0, fontSize: "13px", maxWidth: "80%", alignSelf: "flex-end" }}>
            Siap, segera meluncur! 🚀
          </div>
        </div>

        {/* Input Chat */}
        <div style={{ position: "fixed", bottom: 0, maxWidth: "400px", width: "100%", padding: "15px", backgroundColor: "white", display: "flex", gap: "10px", borderTop: "1px solid #eee" }}>
          <input placeholder="Ketik pesan..." style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ddd", outline: "none" }} />
          <button onClick={() => alert("Terkirim!")} style={{ border: "none", background: "#007AFF", color: "white", padding: "0 15px", borderRadius: "20px", fontWeight: "bold" }}>Kirim</button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN DAFTAR PESAN ---
  return (
    <div style={{ 
      maxWidth: "400px", margin: "0 auto", backgroundColor: "white", 
      minHeight: "100vh", position: "relative", fontFamily: "sans-serif",
      overflowX: "hidden"
    }}>
      
      {/* Header Utama */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", alignItems: "center" }}>
        <button onClick={() => alert("Pengaturan")} style={{ background: "#f5f5f5", border: "none", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", fontSize: "18px" }}>⚙️</button>
        <h1 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>Pesan</h1>
        <button onClick={() => alert("Pesan Baru")} style={{ background: "#f5f5f5", border: "none", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", fontSize: "18px" }}>📝</button>
      </div>

      {/* Pencarian */}
      <div style={{ padding: "0 20px 15px" }}>
        <div style={{ backgroundColor: "#f2f2f2", borderRadius: "15px", padding: "12px", display: "flex", alignItems: "center" }}>
          <span style={{ opacity: 0.5 }}>🔍</span>
          <input 
            type="text" 
            placeholder="Cari guru atau grup..." 
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            style={{ border: "none", background: "transparent", marginLeft: "10px", width: "100%", outline: "none", fontWeight: "500" }} 
          />
          {kataKunci && <button onClick={() => setKataKunci("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#999" }}>✕</button>}
        </div>
      </div>

      {/* Tab Kategori */}
      <div style={{ display: "flex", padding: "0 20px", gap: "25px", marginBottom: "15px" }}>
        {["Semua", "Guru", "Grup"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setTabAktif(tab)} 
            style={{ 
              fontSize: "15px", border: "none", background: "none", cursor: "pointer", 
              fontWeight: "900", color: tabAktif === tab ? "black" : "#ccc",
              borderBottom: tabAktif === tab ? "3px solid black" : "none",
              paddingBottom: "8px"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Daftar Chat */}
      <div style={{ padding: "0 20px 120px" }}>
        {pesanTerfilter.map((msg) => (
          <div 
            key={msg.id} 
            onClick={() => setChatTerpilih(msg)} 
            style={{ 
              display: "flex", gap: "15px", padding: "15px 0", cursor: "pointer", 
              alignItems: "center", borderBottom: "1px solid #f8f8f8"
            }}
          >
            <img src={msg.avatar} alt="p" style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", backgroundColor: "#eee" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b style={{ fontSize: "14px", fontWeight: "900" }}>{msg.nama}</b>
                <span style={{ fontSize: "10px", color: "#bbb", fontWeight: "bold" }}>{msg.waktu}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "12px", color: "#777", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.pesan}
                </span>
                {msg.belumDibaca > 0 ? (
                  <div style={{ backgroundColor: "#ff3b30", color: "white", borderRadius: "10px", minWidth: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", fontWeight: "bold" }}>
                    {msg.belumDibaca}
                  </div>
                ) : (
                  <span style={{ color: msg.status === "unread_blue" ? "#007AFF" : "#ddd", fontSize: "14px" }}>●</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol Tambah Chat Melayang */}
      <button 
        onClick={() => alert("Tambah Chat Baru")}
        style={{ 
          position: "fixed", bottom: "100px", right: "20px", 
          width: "50px", height: "50px", borderRadius: "50%", border: "2px solid black", 
          backgroundColor: "white", fontSize: "28px", fontWeight: "bold", cursor: "pointer", 
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >+</button>

      {/* Navigasi Bawah */}
      <div style={{ 
        position: "fixed", bottom: "15px", left: "50%", transform: "translateX(-50%)", 
        width: "90%", maxWidth: "360px", height: "70px", backgroundColor: "white", 
        borderRadius: "22px", display: "flex", justifyContent: "space-around", 
        alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid #f0f0f0"
      }}>
        {[
          { name: "Beranda", icon: "🏠" },
          { name: "Guru", icon: "👥" },
          { name: "Kursus", icon: "🎓" },
          { name: "Profil", icon: "👤" }
        ].map((nav) => (
          <div 
            key={nav.name}
            onClick={() => setNavAktif(nav.name)}
            style={{ 
              textAlign: "center", cursor: "pointer", 
              color: navAktif === nav.name ? "#0084ff" : "#bbb"
            }}
          >
            <div style={{ fontSize: "22px" }}>{nav.icon}</div>
            <div style={{ fontSize: "10px", fontWeight: "bold" }}>{nav.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}