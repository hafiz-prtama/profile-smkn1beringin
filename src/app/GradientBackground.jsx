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
      opacity={0.45 }
      colors={["#9FC7E8", "#AEBDF0", "#B8E5F2", "#A6D9E8", "#ffffffff", "#C7E5F4"]}
      noiseSpeed={0.000012}
      noiseFrequency={[0.00014, 0.00030]}
      deform={{ incline: 0, noiseAmp: 280, noiseFlow: 5 }}
    />
  );
}
