"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import { fetchUserProfile } from "@/services/authService"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserProfileModalProps {
  open: boolean
  onClose: () => void
}

// Profile form schema
const profileSchema = z.object({
  firstName: z.string().min(1, "กรุณาใส่ชื่อ-นามสกุล"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").nullable(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const { user } = useAuthStore()
  const { profile, setProfile, updateProfile } = useUserStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      email: profile?.email || null,
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id && open) {
        try {
          setIsLoading(true)
          const userData = await fetchUserProfile(user.id)

          // Update form with fetched data
          profileForm.reset({
            firstName: userData.firstName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          })

          // Update profile in store
          setProfile({
            id: String(userData.id),
            firstName: userData.firstName,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          })
        } catch (error) {
          toast({
            variant: "destructive",
            title: "เกิดข้อผิดพลาด",
            description: "ไม่สามารถดึงข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
          })
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchProfile()
  }, [user?.id, open, setProfile, profileForm, toast])

  const handleFormSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      // Update profile in user store
      updateProfile({
        firstName: data.firstName,
        email: data.email,
        phone: data.phone,
        address: data.address,
      })

      toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลส่วนตัวของคุณถูกอัพเดทเรียบร้อยแล้ว",
      })

      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>จัดการข้อมูลส่วนตัว</DialogTitle>
          <DialogDescription>แก้ไขข้อมูลส่วนตัวของคุณ</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={profileForm.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">ชื่อ-นามสกุล</Label>
                <Input
                  id="firstName"
                  {...profileForm.register("firstName")}
                  className="bg-gray-50/50"
                />
                {profileForm.formState.errors.firstName && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  type="email"
                  {...profileForm.register("email")}
                  className="bg-gray-50/50"
                />
                {profileForm.formState.errors.email && (
                  <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทร</Label>
                <Input
                  id="phone"
                  {...profileForm.register("phone")}
                  className="bg-gray-50/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Input
                  id="address"
                  {...profileForm.register("address")}
                  className="bg-gray-50/50"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="hover:scale-105 transition-transform"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                className="hover:scale-105 transition-transform"
                style={{ backgroundColor: "#5B5FEE" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  "บันทึกข้อมูล"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
