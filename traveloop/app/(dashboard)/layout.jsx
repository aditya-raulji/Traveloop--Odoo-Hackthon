import React from "react";
import Navbar from "@/components/layout/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Sticky top navbar */}
      <Navbar />
      
      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
