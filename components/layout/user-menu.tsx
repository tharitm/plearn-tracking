"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store"; // Assuming this is still needed for profile avatar, etc.
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, KeyRound } from "lucide-react";
import { UserProfileModal } from "./user-profile-modal";

export function UserMenu() {
  const { user, logout, isLoading } = useAuthStore(); // Added isLoading
  const { profile } = useUserStore();
  const router = useRouter();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout(); // logout is now async
      router.push("/login"); // Redirect after successful logout
    } catch (error) {
      // Error handling for logout (e.g., display a toast) is likely handled by withErrorHandling
      // or within the authStore itself. If not, add it here.
      console.error("Logout failed in UserMenu:", error);
      // Potentially show a toast message to the user
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getDiceBearAvatar = () => {
    const seed = user?.id || user?.name || "default";
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed as string)}`;
  };

  if (!user) {
    // Or a loading spinner, or null, depending on desired behavior before user is loaded
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar || getDiceBearAvatar()} alt={user.name || ""} />
              <AvatarFallback className="bg-blue-600 text-white">
                {user.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.role === "admin" ? "ผู้ดูแลระบบ" : `ลูกค้า: ${user.customerCode || ""}`}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfileModal(true)} disabled={isLoading}>
            <User className="mr-2 h-4 w-4" />
            <span>แก้ไขข้อมูลส่วนตัว</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowProfileModal(true)} disabled={isLoading}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>เปลี่ยนรหัสผ่าน</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={isLoading}>
            <Settings className="mr-2 h-4 w-4" />
            <span>ตั้งค่า</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoading}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoading ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfileModal open={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
