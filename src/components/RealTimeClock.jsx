"use client";
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function RealTimeClock({ className = "" }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    // Untuk menghindari hydration mismatch, kita set waktu awal di useEffect
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`realtime-clock ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
      <Clock size={16} />
      <span>{time || "..."}</span>
    </div>
  );
}
