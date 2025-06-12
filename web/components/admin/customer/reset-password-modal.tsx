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

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
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
          <Input
            type="password"
            placeholder="รหัสผ่านใหม่"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
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
            onClick={() => onConfirm()}
            className="hover:scale-105 transition-transform"
          >
            ยืนยัน 💾
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
