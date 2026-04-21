"use client";

import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "../components/navbar";
import GhostMode from "../components/ghostmode"; // Make sure to import your new component
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap",
  variable: '--font-inter', 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`bg-black ${inter.variable}`}>
      <head>
        <meta name="google-site-verification" content="13-dsZSdni7qiK5Vtyl4YcMGrqgTiqtcw3mUOyeTdtE" />
        <meta name="description" content="Discord Porn" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <title>whxres</title>
      </head>
      <body
        className={`${inter.className} antialiased bg-black text-white selection:bg-white selection:text-black overflow-x-hidden`}
      >
        {/* 1. GLOBAL NAVIGATION */}
        <Navbar />

        {/* 2. THE NEW GHOST MODE (The subtle tab & Indeed redirect) */}
        <GhostMode />

        {/* 3. MAIN CONTENT */}
        <main>{children}</main>

        <Analytics />
      </body>
    </html>
  );
}