"use client"; // Required for useEffect and other client-side hooks

import type React from "react";
import { useEffect } from "react"; // Import useEffect
// import type { Metadata } from "next"; // Metadata can be used differently with client components or in page.tsx
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { GlobalErrorSonner } from "@/components/ui/GlobalErrorSonner";
import { useAuthStore } from "@/stores/auth-store"; // Import auth store
import { useRouter, usePathname } from "next/navigation"; // Import for redirection
import type { Metadata } from "next"; // Import Metadata type for static metadata

// Metadata can be exported from page.tsx or defined statically if not dynamic
// Since this is a Client Component ("use client"), static metadata export is ignored.
// We will set title and favicon dynamically using useEffect.
// export const metadata: Metadata = {
//   title: "Plearn Tracking",
//   description: "ระบบจัดการเลขพัสดุ",
//   icons: {
//     icon: "/plearn-logo.png", // Path to your logo in the public folder
//     // apple: "/apple-icon.png", // Example for apple touch icon
//   },
// };

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  display: 'swap',
  variable: '--font-noto-sans-thai',
});

// กำหนด route configuration
const ROUTES = {
  login: "/login",
  protected: {
    admin: ["/admin"],
    customer: ["/dashboard"]
  },
  home: {
    admin: "/admin",
    customer: "/dashboard"
  }
} as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isInitializing, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

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

  // เช็ค auth state เฉพาะตอน mount component
  useEffect(() => {
    checkAuth();
  }, []);

  // จัดการ route protection
  useEffect(() => {
    if (isInitializing) {
      return;
    }

    const currentPath = pathname === "/" ? ROUTES.login : pathname;
    const isLoginPage = currentPath === ROUTES.login;

    // ถ้าไม่ได้ login -> ไปหน้า login
    if (!isAuthenticated) {
      if (!isLoginPage) {
        router.replace(ROUTES.login);
      }
      return;
    }

    // ถ้า login แล้ว
    const role = user?.role || 'customer';

    // ถ้าอยู่หน้า login -> ไปหน้าหลักตาม role
    if (isLoginPage) {
      router.replace(ROUTES.home[role as keyof typeof ROUTES.home]);
      return;
    }

    // เช็คว่าอยู่ในหน้าที่มีสิทธิ์เข้าถึงหรือไม่
    const allowedRoutes = role === 'admin'
      ? [...ROUTES.protected.admin, ...ROUTES.protected.customer]  // admin เข้าได้ทั้ง 2 ส่วน
      : ROUTES.protected.customer;  // customer เข้าได้แค่ส่วน customer

    const hasAccess = allowedRoutes.some(route => currentPath.startsWith(route));

    if (!hasAccess) {
      router.replace(ROUTES.home[role as keyof typeof ROUTES.home]);
    }
  }, [isAuthenticated, user?.role, pathname, isInitializing]);

  // แสดง loading state ถ้ากำลัง initialize
  if (isInitializing) {
    return (
      <html lang="th" className={notoSansThai.variable}>
        <body className='font-sans'>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className='font-sans'>
        {children}
        <GlobalErrorSonner />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
