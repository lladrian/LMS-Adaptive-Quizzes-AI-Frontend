// src/layouts/AdminLayout.jsx
import React from "react";
import Sidebar from "../../components/sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-indigo-50">
      <Sidebar />
      <main className="flex-grow p-6 overflow-auto">{children}</main>
    </div>
  );
}
