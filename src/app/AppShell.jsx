"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatBox from "@/components/ChatBox";
import IntroPreloader from "@/components/IntroPreloader";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dshbd23";
  const isHome = pathname === "/";
  // Sembunyikan elemen global pada ruang chat BK (URL: /konseling/[ticketId])
  const isBkChatRoom = pathname.startsWith("/konseling/") && pathname.split("/").length > 2;

  const [showIntro, setShowIntro] = useState(true);

  // Listener untuk memutar ulang intro jika tombol replay diklik di footer
  useEffect(() => {
    const handleReplay = () => {
      setShowIntro(true);
      window.scrollTo(0, 0);
    };
    window.addEventListener("replay-intro", handleReplay);
    return () => window.removeEventListener("replay-intro", handleReplay);
  }, []);

  return (
    <DataProvider>
      <div className={`app-shell ${isDashboard ? "app-shell--dashboard" : ""}`}>
        {isHome && showIntro && (
          <IntroPreloader onComplete={() => setShowIntro(false)} />
        )}
        {!isDashboard && <Navbar />}
        <main>{children}</main>
        {!isDashboard && !isBkChatRoom && <ChatBox />}
        {!isDashboard && !isBkChatRoom && <Footer />}
      </div>
    </DataProvider>
  );
}
