"use client";

import type React from "react";
import { useEffect } from "react";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalErrorSonner } from "@/components/ui/GlobalErrorSonner";
import { AuthProvider } from "@/contexts/auth-context";

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = "Plearn Tracking";
    let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (favicon) {
      favicon.href = "/plearn-logo.png";
      favicon.type = "image/png";
    } else {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.href = "/plearn-logo.png";
      favicon.type = "image/png";
      document.head.appendChild(favicon);
    }
  }, []);

  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className='font-sans'>
        <AuthProvider>
          {children}
          <GlobalErrorSonner />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
