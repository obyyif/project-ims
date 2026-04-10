"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function AssignmentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[350px] bg-white rounded-2xl shadow-lg p-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => router.back()}>☰</button>
          <h1 className="font-semibold">Assignment</h1>
          <img
            src="https://i.pravatar.cc/40"
            className="w-8 h-8 rounded-full"
          />
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 text-sm mb-3">
          <button
            className="flex-1 bg-white rounded-md py-1"
            onClick={() => alert("History clicked")}
          >
            History
          </button>
          <button
            className="flex-1 text-gray-400"
            onClick={() => alert("Completed clicked")}
          >
            Completed
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-3 text-xs">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-lg"
            onClick={() => alert("All Subject")}
          >
            All Subject
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded-lg"
            onClick={() => alert("Priority")}
          >
            ! Priority
          </button>
          <button
            className="bg-gray-200 px-3 py-1 rounded-lg"
            onClick={() => alert("Automotive")}
          >
            Automotive
          </button>
        </div>

        {/* Due Soon */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm">Due Soon</h3>
            <span className="text-xs text-blue-500">2 Pending</span>
          </div>

          {/* Card 1 */}
          <div
            className="bg-gray-100 rounded-xl p-3 mb-3 cursor-pointer"
            onClick={() => alert("Open Assignment 1")}
          >
            <p className="text-xs text-blue-600">Network & Security</p>
            <h2 className="font-semibold text-sm">
              Configuring PPL 2
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Praktek Lab PPL 2 for packet Switching
            </p>

            <div className="flex justify-between mt-2 text-xs">
              <span>Today, 5:00 PM</span>
              <span className="text-red-500">4h Left</span>
            </div>

            <button
              className="mt-2 text-xs bg-white px-2 py-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                alert("To Do clicked");
              }}
            >
              To Do
            </button>
          </div>

          {/* Card 2 */}
          <div
            className="bg-gray-100 rounded-xl p-3 mb-3 cursor-pointer"
            onClick={() => alert("Open Assignment 2")}
          >
            <p className="text-xs text-blue-600">
              Mechanical Engineering
            </p>
            <h2 className="font-semibold text-sm">
              Rapat Penting PPL 2
            </h2>

            <div className="flex justify-between mt-2 text-xs">
              <span>3 Files attached</span>
              <span className="text-yellow-500">Tomorrow</span>
            </div>

            <button
              className="mt-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
              onClick={(e) => {
                e.stopPropagation();
                alert("In Progress");
              }}
            >
              In Progress
            </button>
          </div>
        </div>

        {/* Next Week */}
        <div>
          <h3 className="font-semibold text-sm mb-2">Next Week</h3>

          <div
            className="bg-gray-100 rounded-xl p-3 cursor-pointer flex justify-between items-center"
            onClick={() => alert("Open Technical Meeting")}
          >
            <div>
              <p className="text-xs text-gray-500">Basic Laravel</p>
              <h2 className="font-semibold text-sm">
                Technical Meeting
              </h2>
              <p className="text-xs text-gray-400">
                Due: Oct 28 2026
              </p>
            </div>
            <span className="text-2xl">📘</span>
          </div>
        </div>

        {/* Bottom Nav */}
        <div className="flex justify-between mt-4 border-t pt-3 text-xs">
          <button onClick={() => alert("Home")}>🏠 Home</button>
          <button onClick={() => alert("Teachers")}>👨‍🏫 Teachers</button>
          <button onClick={() => alert("Courses")}>📦 Courses</button>
          <button onClick={() => alert("Profile")}>👤 Profile</button>
        </div>

      </div>
    </div>
  );
}
