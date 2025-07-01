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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, RefreshCw, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserProfileModalProps {
  open: boolean
  onClose: () => void
}

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(1, "กรุณาใส่ชื่อ-นามสกุล"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง").min(1, "กรุณาใส่อีเมล"),
  phone: z.string().optional(),
  address: z.string().optional(),
})

// Password form schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "กรุณาใส่รหัสผ่านปัจจุบัน"),
  newPassword: z.string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .regex(/[A-Z]/, "ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว")
    .regex(/[a-z]/, "ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว")
    .regex(/[0-9]/, "ต้องมีตัวเลขอย่างน้อย 1 ตัว")
    .regex(/[^A-Za-z0-9]/, "ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว"),
  confirmPassword: z.string().min(1, "กรุณายืนยันรหัสผ่านใหม่"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const { user } = useAuthStore()
  const { profile, setProfile, updateProfile } = useUserStore()
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarStyle, setAvatarStyle] = useState<string>("avataaars")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id && open) {
        try {
          setIsLoading(true)
          const userData = await fetchUserProfile(user.id)

          // Update form with fetched data
          profileForm.reset({
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            address: userData.address,
          })

          // Update profile in store
          setProfile({
            id: String(userData.id),
            name: userData.name,
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "ขนาดไฟล์เกินกำหนด",
          description: "กรุณาเลือกไฟล์ขนาดไม่เกิน 5MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      // TODO: Implement API call to update profile
      // const response = await apiService.updateProfile({
      //   ...data,
      //   avatar: avatarPreview || profile?.avatar,
      // })

      // Update profile in user store
      updateProfile({
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        avatar: avatarPreview || profile?.avatar,
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

  const handlePasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsSubmitting(true)

      // TODO: Implement API call to change password
      // await apiService.changePassword({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // })

      toast({
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        description: "รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว",
      })

      passwordForm.reset()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const generateRandomAvatar = () => {
    const styles = ["avataaars", "bottts", "pixel-art", "lorelei", "micah", "personas", "thumbs"]
    const randomStyle = styles[Math.floor(Math.random() * styles.length)]
    setAvatarStyle(randomStyle)

    const seed = user?.id || user?.name || "default" + Math.random().toString(36).substring(2, 8)
    const avatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}`
    setAvatarPreview(avatarUrl)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>จัดการข้อมูลส่วนตัว</DialogTitle>
          <DialogDescription>แก้ไขข้อมูลส่วนตัวและตั้งค่าความปลอดภัย</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
              <TabsTrigger value="password">เปลี่ยนรหัสผ่าน</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={
                        avatarPreview ||
                        profile?.avatar ||
                        `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(user?.id || "default")}`
                      }
                      alt={user?.name}
                    />
                    <AvatarFallback className="bg-blue-600 text-white text-xl">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 right-0 flex space-x-1">
                    <label
                      htmlFor="avatar-upload"
                      className="bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isSubmitting}
                      />
                    </label>
                    <button
                      onClick={generateRandomAvatar}
                      className="bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 disabled:opacity-50"
                      title="สร้างอวาตาร์สุ่ม"
                      disabled={isSubmitting}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">คลิกที่ไอคอนเพื่อเปลี่ยนรูปโปรไฟล์หรือสร้างอวาตาร์สุ่ม</p>
              </div>

              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อ-นามสกุล *</Label>
                    <Input
                      id="name"
                      {...profileForm.register("name")}
                      placeholder="ชื่อ-นามสกุล"
                      disabled={isSubmitting}
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      placeholder="example@email.com"
                      disabled={isSubmitting}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      {...profileForm.register("phone")}
                      placeholder="08X-XXX-XXXX"
                      disabled={isSubmitting}
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-red-500">{profileForm.formState.errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerCode">รหัสลูกค้า</Label>
                    <Input id="customerCode" value={user?.customerCode || "N/A"} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input
                    id="address"
                    {...profileForm.register("address")}
                    placeholder="ที่อยู่สำหรับจัดส่ง"
                    disabled={isSubmitting}
                  />
                  {profileForm.formState.errors.address && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.address.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center space-x-2"
                    disabled={!profileForm.formState.isDirty || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isSubmitting ? "กำลังบันทึก..." : "บันทึก"}</span>
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="password" className="space-y-6">
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน *</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    placeholder="รหัสผ่านปัจจุบัน"
                    disabled={isSubmitting}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">รหัสผ่านใหม่ *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    placeholder="รหัสผ่านใหม่"
                    disabled={isSubmitting}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่ *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    disabled={isSubmitting}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• ความยาวอย่างน้อย 6 ตัวอักษร</li>
                    <li>• ต้องมีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว</li>
                    <li>• ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว</li>
                    <li>• ต้องมีตัวเลขอย่างน้อย 1 ตัว</li>
                    <li>• ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center space-x-2"
                    disabled={!passwordForm.formState.isDirty || isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isSubmitting ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}</span>
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
