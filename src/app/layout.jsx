import "@/styles.css";
import AppShell from "./AppShell";

export const metadata = {
  title: "SMK Negeri 1 Beringin",
  description: "Profil SMK Negeri 1 Beringin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
