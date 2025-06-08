import type React from "react";
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // Import Toaster
import { ThemeProvider } from "@/components/theme-provider"; // Import ThemeProvider

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Parcel Management Dashboard",
  description: "ระบบจัดการเลขพัสดุ",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning> {/* Added suppressHydrationWarning for next-themes */}
      <body className={notoSansThai.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
