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

// Metadata can be exported from page.tsx or defined statically if not dynamic
// export const metadata: Metadata = {
//   title: "Plearn Tracking",
//   description: "ระบบจัดการเลขพัสดุ",
// };

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
  const { isAuthenticated, checkAuth, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth(); // Check authentication status when the app loads/hydrates
  }, [checkAuth]);

  useEffect(() => {
    // Define public paths that don't require authentication
    const publicPaths = ["/login"];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isAuthenticated && !pathIsPublic) {
      router.push("/login");
    } else if (isAuthenticated && pathIsPublic) {
      // If authenticated and on a public path (like login), redirect to appropriate dashboard
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, user]);


  // Optional: Render a loading state or null while checking auth to prevent flicker
  // This depends on how quickly `checkAuth` resolves and updates `isAuthenticated`
  // For a simple check like this, it might be quick enough.
  // Consider this if you see a flash of content before redirection.

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
