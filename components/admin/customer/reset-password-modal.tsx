"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPassword: string) => void;
  customerName?: string;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}: ResetPasswordModalProps) {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const isValid = password.length > 0 && password === confirm;
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="soft-ui-modal">
        <AlertDialogHeader>
          <AlertDialogTitle>
            🔒 รีเซ็ตรหัสผ่าน
          </AlertDialogTitle>
          <AlertDialogDescription>
            กรุณากรอกรหัสผ่านใหม่สำหรับ {customerName ? `"${customerName}"` : "ผู้ใช้งาน"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 py-2">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่านใหม่"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="ยืนยันรหัสผ่าน"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
          {!isValid && confirm.length > 0 && (
            <p className="text-sm text-red-500">รหัสผ่านไม่ตรงกัน</p>
          )}
        </div>
        <div className="flex justify-between pt-2">
          <AlertDialogCancel className="hover:scale-105 transition-transform" onClick={onClose}>
            ยกเลิก ×
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={!isValid}
            onClick={() => onConfirm(password)}
            className="hover:scale-105 transition-transform"
          >
            ยืนยัน 💾
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
