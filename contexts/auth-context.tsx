"use client";

import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

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

interface AuthContextType {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: any; // ปรับ type ตามโครงสร้าง user ของคุณ
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, isInitializing, checkAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isInitializing, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const withAuth = (Component: React.ComponentType) => {
  return function WrappedComponent(props: any) {
    return (
      <AuthProvider>
        <Component {...props} />
      </AuthProvider>
    );
  };
}; 