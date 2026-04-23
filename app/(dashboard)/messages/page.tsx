"use client";

import { useState } from "react";

const messageData = [
  { id: 1, category: "Guru", name: "Andriansyah Maulana", msg: "Guys MBG udah ada?", time: "10.45", unread: 1, initial: "A", color: "bg-sky-500" },
  { id: 2, category: "Grup", name: "XI-PPL 2 BURONAN WARGA", msg: "Messi: Jadwal besok apa coo", time: "09.12", unread: 0, initial: "X", color: "bg-violet-500" },
  { id: 3, category: "Guru", name: "Heti Kusmawati", msg: "Sampah sampah, baju rapihkan", time: "Kemarin", unread: 0, initial: "H", color: "bg-amber-500" },
  { id: 4, category: "Guru", name: "Eky Ayu Puspitasari", msg: "Hayuu di antos di perpus...", time: "Selasa", unread: 0, initial: "E", color: "bg-emerald-500" },
  { id: 5, category: "Guru", name: "Revy Cahya Alamsyah", msg: "Kalian buka ya vs code nya", time: "Senin", unread: 0, initial: "R", color: "bg-rose-500" },
];

type MessageType = typeof messageData[0];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedChat, setSelectedChat] = useState<MessageType | null>(null);

  const tabs = ["Semua", "Guru", "Grup"];

  const filtered = messageData.filter((m) => {
    const matchTab = activeTab === "Semua" || m.category === activeTab;
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  // Chat view
  if (selectedChat) {
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
        {/* Chat header */}
        <div className="flex items-center gap-3 rounded-3xl bg-white p-4 card-float mb-4">
          <button
            onClick={() => setSelectedChat(null)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className={`h-10 w-10 rounded-xl ${selectedChat.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {selectedChat.initial}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm">{selectedChat.name}</p>
            <p className="text-xs text-emerald-500 font-medium">Online</p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 rounded-3xl bg-white p-6 card-float space-y-4 overflow-y-auto">
          <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
            {selectedChat.msg}
          </div>
          <div className="max-w-[80%] ml-auto rounded-2xl rounded-tr-md bg-sky-500 px-4 py-3 text-sm text-white">
            Siap, segera meluncur! 🚀
          </div>
        </div>

        {/* Input */}
        <div className="mt-4 flex items-center gap-3 rounded-3xl bg-white p-3 card-float">
          <input
            placeholder="Ketik pesan..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 transition focus:border-sky-400 focus:bg-white"
          />
          <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 active:scale-[0.97] shrink-0">
            Kirim
          </button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pesan</h1>
        <p className="text-sm text-slate-400 mt-1">Komunikasi dengan guru dan grup kelas</p>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
        <input
          type="text"
          placeholder="Cari guru atau grup..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm placeholder:text-slate-400 card-float transition focus:border-sky-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-bold pb-2 transition border-b-2 ${
              activeTab === tab
                ? "text-slate-900 border-slate-900"
                : "text-slate-300 border-transparent hover:text-slate-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Message list */}
      <div className="space-y-2">
        {filtered.map((msg) => (
          <button
            key={msg.id}
            onClick={() => setSelectedChat(msg)}
            className="w-full flex items-center gap-4 rounded-2xl bg-white p-4 card-float transition hover:-translate-y-0.5 text-left"
          >
            <div className={`h-12 w-12 rounded-xl ${msg.color} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}>
              {msg.initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-slate-900 text-sm truncate">{msg.name}</p>
                <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-2">{msg.time}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-slate-400 truncate">{msg.msg}</p>
                {msg.unread > 0 && (
                  <span className="shrink-0 ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white px-1.5">
                    {msg.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
