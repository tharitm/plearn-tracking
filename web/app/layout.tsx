import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Thai } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Parcel Management Dashboard",
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
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
