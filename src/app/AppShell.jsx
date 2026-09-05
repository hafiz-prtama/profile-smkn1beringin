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
  // Sembunyikan elemen global pada ruang chat BK (URL: /konseling/[ticketId])
  const isBkChatRoom = pathname.startsWith("/konseling/") && pathname.split("/").length > 2;

  return (
    <DataProvider>
      <div className={`app-shell ${isDashboard ? "app-shell--dashboard" : ""}`}>
        {!isDashboard && <Navbar />}
        <main>{children}</main>
        {!isDashboard && !isBkChatRoom && <ChatBox />}
        {!isDashboard && !isBkChatRoom && <Footer />}
      </div>
    </DataProvider>
  );
}
