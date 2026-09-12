"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { GradientWave } from "@/components/ui/gradient-wave";

/**
 * GradientBackground — wrapper client component untuk gradient wave.
 * Pada perangkat mobile (< 768px), WebGL dinonaktifkan dan diganti
 * dengan CSS gradient murni yang sangat ringan untuk menghemat CPU & baterai.
 */
export default function GradientBackground() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dshbd23";
  const isMaintenance = pathname === "/maintenance";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isDashboard || isMaintenance) return null;

  if (isMobile) {
    return (
      <div
        className="mobile-gradient-bg"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background: "radial-gradient(circle at 80% 20%, #EAF4FB 0%, #F0F7FF 45%, #FFFFFF 100%)",
          opacity: 0.85,
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <GradientWave
      opacity={0.55}
      colors={["#F0F7FF", "#FFFFFF", "#EAF4FB", "#5B9BD5", "#7EB8D8", "#A8CFEA"]}
      noiseSpeed={0.000012}
      noiseFrequency={[0.00014, 0.00030]}
      deform={{ incline: 0, noiseAmp: 280, noiseFlow: 5 }}
    />
  );
}
