"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // Used for styling the action button

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
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Password Reset</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการรีเซ็ตรหัสผ่านของ {customerName ? `"${customerName}"` : "this user"} ใช่หรือไม่?
            <br />
            (Are you sure you want to reset the password for {customerName ? `"${customerName}"` : "this user"}?)
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          {/* Apply custom styling to AlertDialogAction if direct className override is not enough */}
          <AlertDialogAction
            onClick={onConfirm}
            // The AlertDialogAction is already a button, but if we need specific styling from our Button component:
            // className={buttonVariants({ variant: "default" })} // This might conflict, direct style is safer
            style={{ backgroundColor: "#5B5FEE", color: "white" }} // Primary color
          >
            Reset Password
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
