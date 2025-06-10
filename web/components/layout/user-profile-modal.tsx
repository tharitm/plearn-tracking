"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, RefreshCw } from "lucide-react"

interface UserProfileModalProps {
  open: boolean
  onClose: () => void
}

interface ProfileFormData {
  name: string
  email: string
  phone: string
  address: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function UserProfileModal({ open, onClose }: UserProfileModalProps) {
  const { user, login } = useAuthStore()
  const { profile, setProfile, updateProfile } = useUserStore()
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [avatarStyle, setAvatarStyle] = useState<string>("avataaars")

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  })

  const passwordForm = useForm<PasswordFormData>()

  useEffect(() => {
    if (user && !profile) {
      // Initialize profile from user data
      setProfile({
        id: user.id,
        name: user.name,
        email: `${user.id}@example.com`,
        phone: "",
        address: "",
      })
    }
  }, [user, profile, setProfile])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAvatarPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = (data: ProfileFormData) => {
    // Update user name in auth store
    if (user) {
      login({ ...user, name: data.name })
    }

    // Update profile in user store
    updateProfile({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      avatar: avatarPreview || profile?.avatar,
    })

    alert("บันทึกข้อมูลสำเร็จ!")
  }

  const handlePasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("รหัสผ่านใหม่ไม่ตรงกัน")
      return
    }

    // Mock password change
    console.log("Password change:", data)
    alert("เปลี่ยนรหัสผ่านสำเร็จ!")
    passwordForm.reset()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Generate DiceBear avatar URL based on user ID or name
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
                    />
                  </label>
                  <button
                    onClick={generateRandomAvatar}
                    className="bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700"
                    title="สร้างอวาตาร์สุ่ม"
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
                    {...profileForm.register("name", { required: "กรุณาใส่ชื่อ-นามสกุล" })}
                    placeholder="ชื่อ-นามสกุล"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email", { required: "กรุณาใส่อีเมล" })}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" {...profileForm.register("phone")} placeholder="08X-XXX-XXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerCode">รหัสลูกค้า</Label>
                  <Input id="customerCode" value={user?.customerCode || "N/A"} disabled />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Input id="address" {...profileForm.register("address")} placeholder="ที่อยู่สำหรับจัดส่ง" />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  ยกเลิก
                </Button>
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>บันทึก</span>
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
                  {...passwordForm.register("currentPassword", { required: "กรุณาใส่รหัสผ่านปัจจุบัน" })}
                  placeholder="รหัสผ่านปัจจุบัน"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">รหัสผ่านใหม่ *</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...passwordForm.register("newPassword", {
                    required: "กรุณาใส่รหัสผ่านใหม่",
                    minLength: { value: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
                  })}
                  placeholder="รหัสผ่านใหม่"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่ *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...passwordForm.register("confirmPassword", { required: "กรุณายืนยันรหัสผ่านใหม่" })}
                  placeholder="ยืนยันรหัสผ่านใหม่"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• ความยาวอย่างน้อย 6 ตัวอักษร</li>
                  <li>• ควรมีตัวอักษรพิมพ์ใหญ่และพิมพ์เล็ก</li>
                  <li>• ควรมีตัวเลขและอักขระพิเศษ</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  ยกเลิก
                </Button>
                <Button type="submit" className="flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>เปลี่ยนรหัสผ่าน</span>
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
