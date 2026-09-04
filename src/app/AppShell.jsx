"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";

  return (
    <DataProvider>
      <div className={`app-shell ${isDashboard ? "app-shell--dashboard" : ""}`}>
        {!isDashboard && <Navbar />}
        <main>{children}</main>
        {!isDashboard && <ChatBox />}
        {!isDashboard && <Footer />}
      </div>
    </DataProvider>
  );
}
