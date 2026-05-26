import type { Metadata } from "next";
import { Kanit, Comfortaa } from "next/font/google";
import "./globals.css";

const kanit = Kanit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-display", display: "swap" });
const comfortaa = Comfortaa({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "MaintainIQ — Anticipez la panne 72h avant qu'elle arrive",
  description: "Maintenance prédictive IA — analyse vibratoire, thermique et électrique pour machines industrielles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${kanit.variable} ${comfortaa.variable}`}>
      <body style={{ fontFamily: "var(--font-body)", background: "#fff7ed" }}>{children}</body>
    </html>
  );
}
