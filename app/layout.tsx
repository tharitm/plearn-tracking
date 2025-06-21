import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Thai } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner" // Keep this for sonner's toast rendering
import { GlobalErrorSonner } from "@/components/ui/GlobalErrorSonner" // Import the new component

export const metadata: Metadata = {
  title: "Plearn Tracking",
  description: "ระบบจัดการเลขพัสดุ",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className='font-sans'>
        {children}
        <GlobalErrorSonner /> {/* Add the GlobalErrorSonner component here */}
        <Toaster richColors position="top-right" /> {/* This is sonner's provider, keep it */}
      </body>
    </html>
  )
}
