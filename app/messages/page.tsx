"use client";

import React, { useState } from "react";

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeNav, setActiveNav] = useState("Courses");

  const messagesData = [
    { id: 1, category: "Teachers", name: "Andriansyah Maulana", message: "Guys MBG udah ada?", time: "10.45 AM", unread: 1, avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, category: "Groups", name: "XI-PPL 2 BURONAN WARGA", message: "Messi: Jadwal besok apa coo", time: "9.12 AM", unread: 0, avatar: "https://i.pravatar.cc/150?u=2", status: "unread_blue" },
    { id: 3, category: "Teachers", name: "Heti Kusmawati", message: "Sampah sampah , baju rapihkan", time: "Yesterday", unread: 0, avatar: "https://i.pravatar.cc/150?u=3", status: "read" },
    { id: 4, category: "Teachers", name: "Eky Ayu Puspitasari", message: "Hayuu Di antos di perpuss...", time: "Tuesday", unread: 0, avatar: "https://i.pravatar.cc/150?u=4", status: "read" },
    { id: 5, category: "Teachers", name: "Revy Cahya Alamsyah", message: "Kalian buka ya vs code nya", time: "Monday", unread: 0, avatar: "https://i.pravatar.cc/150?u=5", status: "read" },
  ];

  const filteredMessages = messagesData.filter((msg) => {
    const matchesTab = activeTab === "All" || msg.category === activeTab;
    const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // --- TAMPILAN ROOM CHAT ---
  if (selectedChat) {
    return (
      <div style={{ maxWidth: "400px", margin: "0 auto", backgroundColor: "#f9f9f9", minHeight: "100vh", fontFamily: "sans-serif", border: "1px solid #ddd" }}>
        <div style={{ display: "flex", alignItems: "center", padding: "15px", backgroundColor: "white", borderBottom: "1px solid #eee", sticky: "top" }}>
          <button 
            onClick={() => setSelectedChat(null)} 
            style={{ border: "none", background: "#eee", borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer", marginRight: "10px", fontWeight: "bold" }}
          >
            ←
          </button>
          <img src={selectedChat.avatar} style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "12px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>{selectedChat.name}</div>
            <div style={{ fontSize: "11px", color: "green" }}>Online</div>
          </div>
          <button onClick={() => alert("Call Feature")} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>📞</button>
        </div>

        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "15px", borderTopLeftRadius: 0, fontSize: "13px", maxWidth: "80%", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
            {selectedChat.message}
          </div>
          <div style={{ backgroundColor: "#007AFF", color: "white", padding: "12px", borderRadius: "15px", borderTopRightRadius: 0, fontSize: "13px", maxWidth: "80%", alignSelf: "flex-end" }}>
            Siap, segera meluncur! 🚀
          </div>
        </div>

        {/* Fake Input Chat */}
        <div style={{ position: "fixed", bottom: 0, maxWidth: "400px", width: "100%", padding: "15px", backgroundColor: "white", display: "flex", gap: "10px", borderTop: "1px solid #eee" }}>
          <input placeholder="Type here..." style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid #ddd", outline: "none" }} />
          <button onClick={() => alert("Sent!")} style={{ border: "none", background: "#007AFF", color: "white", padding: "0 15px", borderRadius: "20px", fontWeight: "bold" }}>Send</button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN DAFTAR PESAN ---
  return (
    <div style={{ 
      maxWidth: "400px", margin: "0 auto", backgroundColor: "white", 
      minHeight: "100vh", position: "relative", fontFamily: "sans-serif",
      border: "1px solid #ddd", overflowX: "hidden"
    }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", alignItems: "center" }}>
        <button onClick={() => alert("Buka Settings")} style={{ background: "#f5f5f5", border: "none", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", fontSize: "18px" }}>⚙️</button>
        <h1 style={{ fontSize: "18px", fontWeight: "900", margin: 0, letterSpacing: "-0.5px" }}>Messages</h1>
        <button onClick={() => alert("Tulis Pesan Baru")} style={{ background: "#f5f5f5", border: "none", width: "40px", height: "40px", borderRadius: "12px", cursor: "pointer", fontSize: "18px" }}>📝</button>
      </div>

      {/* Search Bar - Interactive */}
      <div style={{ padding: "0 20px 15px" }}>
        <div style={{ backgroundColor: "#f2f2f2", borderRadius: "15px", padding: "12px", display: "flex", alignItems: "center", border: "1px solid transparent" }}>
          <span style={{ opacity: 0.5 }}>🔍</span>
          <input 
            type="text" 
            placeholder="Search teacher or group..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: "none", background: "transparent", marginLeft: "10px", width: "100%", outline: "none", fontWeight: "500" }} 
          />
          {searchTerm && <button onClick={() => setSearchTerm("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#999" }}>✕</button>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 20px", gap: "25px", marginBottom: "15px" }}>
        {["All", "Teachers", "Groups"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            style={{ 
              fontSize: "15px", border: "none", background: "none", cursor: "pointer", 
              fontWeight: "900", color: activeTab === tab ? "black" : "#ccc",
              borderBottom: activeTab === tab ? "3px solid black" : "none",
              paddingBottom: "8px", transition: "0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div style={{ padding: "0 20px 120px" }}>
        {filteredMessages.map((msg) => (
          <div 
            key={msg.id} 
            onClick={() => setSelectedChat(msg)} 
            style={{ 
              display: "flex", gap: "15px", padding: "15px 0", cursor: "pointer", 
              alignItems: "center", borderBottom: "1px solid #f8f8f8",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <img src={msg.avatar} alt="p" style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", backgroundColor: "#eee" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <b style={{ fontSize: "14px", fontWeight: "900" }}>{msg.name}</b>
                <span style={{ fontSize: "10px", color: "#bbb", fontWeight: "bold" }}>{msg.time}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "12px", color: "#777", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {msg.message}
                </span>
                {msg.unread > 0 ? (
                  <div style={{ backgroundColor: "#ff3b30", color: "white", borderRadius: "10px", minWidth: "18px", height: "18px", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px", fontWeight: "bold" }}>
                    {msg.unread}
                  </div>
                ) : (
                  <span style={{ color: msg.status === "unread_blue" ? "#007AFF" : "#ddd", fontSize: "14px" }}>●</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => alert("Fitur Tambah Chat")}
        style={{ 
          position: "fixed", bottom: "100px", left: "50%", transform: "translateX(130px)", 
          width: "50px", height: "50px", borderRadius: "50%", border: "2px solid black", 
          backgroundColor: "white", fontSize: "28px", fontWeight: "bold", cursor: "pointer", 
          zIndex: 100, boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >+</button>

      {/* Bottom Navigation */}
      <div style={{ 
        position: "fixed", bottom: "15px", left: "50%", transform: "translateX(-50%)", 
        width: "90%", maxWidth: "360px", height: "70px", backgroundColor: "white", 
        borderRadius: "22px", display: "flex", justifyContent: "space-around", 
        alignItems: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)", zIndex: 1000,
        border: "1px solid #f0f0f0"
      }}>
        {[
          { name: "Home", icon: "🏠" },
          { name: "Teachers", icon: "👥" },
          { name: "Courses", icon: "🎓" },
          { name: "Profile", icon: "👤" }
        ].map((nav) => (
          <div 
            key={nav.name}
            onClick={() => setActiveNav(nav.name)}
            style={{ 
              textAlign: "center", cursor: "pointer", 
              color: activeNav === nav.name ? "#0084ff" : "#bbb",
              transition: "0.3s"
            }}
          >
            <div style={{ fontSize: "22px" }}>{nav.icon}</div>
            <div style={{ fontSize: "10px", fontWeight: activeNav === nav.name ? "900" : "bold", marginTop: "2px" }}>{nav.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}