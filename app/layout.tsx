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


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isInitializing } = useAuthStore(); // Added isInitializing, removed checkAuth as it's not used here
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Set document title
    document.title = "Plearn Tracking";

    // Set favicon
    let favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (favicon) {
      favicon.href = "/plearn-logo.png";
      favicon.type = "image/png"; // Ensure type is correct
    } else {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      favicon.href = "/plearn-logo.png";
      favicon.type = "image/png";
      document.head.appendChild(favicon);
    }

    // The checkAuth call was removed from auth-store's immediate execution.
    // If it's intended to run on layout mount, it can be kept here.
    // However, the rehydration logic in auth-store might cover initial auth state.
    // For now, let's assume rehydration handles the initial isAuthenticated state.
    // If checkAuth() is meant to be a periodic token validation, its placement might differ.
    // useAuthStore.getState().checkAuth(); // Re-evaluating if this is needed or how it should work with isInitializing
  }, []); // Empty dependency array: run once on mount

  useEffect(() => {
    // Wait for auth store to initialize before attempting to redirect
    if (isInitializing) {
      return;
    }

    const publicPaths = ["/login"];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!isAuthenticated && !pathIsPublic) {
      router.push("/login");
    } else if (isAuthenticated && pathIsPublic) {
      // If authenticated and on a public path, redirect to the appropriate dashboard
      if (user?.role === "admin") {
        router.push("/admin");
      } else { // Assuming default role is customer or similar
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, pathname, router, user, isInitializing]); // Added isInitializing to dependencies


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
