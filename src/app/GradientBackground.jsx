"use client";
import { usePathname } from "next/navigation";
import { GradientWave } from "@/components/ui/gradient-wave";

/**
 * GradientBackground — wrapper client component untuk gradient wave.
 * Dipasang langsung di <body> (di luar app-shell) agar tidak terpotong
 * oleh overflow:hidden pada .app-shell.
 */
export default function GradientBackground() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dshbd23";
  const isMaintenance = pathname === "/maintenance";

  if (isDashboard || isMaintenance) return null;

  return (
    <GradientWave
      opacity={0.30}
      colors={["#adb0b3ff", "#bcc3f0c3", "#c2eaffdd", "#a2d6e8c2", "#ffffffff", "#c8e8f8"]}
      noiseSpeed={0.000012}
      noiseFrequency={[0.00014, 0.00030]}
      deform={{ incline: 0, noiseAmp: 280, noiseFlow: 5 }}
    />
  );
}
