import "@/styles.css";
import AppShell from "./AppShell";
import GradientBackground from "./GradientBackground";

export const metadata = {
  title: "SMK Negeri 1 Beringin",
  description: "Profil SMK Negeri 1 Beringin",
  icons: {
    icon: '/logosmk.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {/* GradientWave dipasang di luar app-shell agar tidak terpotong overflow:hidden */}
        <GradientBackground />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

