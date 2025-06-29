"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, LogIn } from "lucide-react";
// No longer importing User from lib/types, as auth-store will use User from authService

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, isAuthenticated, isLoading, error: authError, user } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null); // Clear local error

    if (!username || !password) {
      setLocalError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    try {
      await login(username, password);
      // Navigation is handled by the useEffect hook
    } catch (err) {
      // Error is already set in authStore, but if we want to display it locally too:
      // The authStore's error is already available as `authError`
      // If `login` service re-throws, we might not need to do much here
      // as `authError` will be updated.
      // setLocalError(authError || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm rounded-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
            <CardDescription>Plearn Tracking</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input
                id="username"
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                disabled={isLoading}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>

            {(localError || authError) && <p className="text-sm text-red-600">{localError || authError}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              <span>{isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}</span>
            </Button>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Demo Account:</p>
              <p>Username: admin หรือ customer</p>
              <p>Password: password</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
