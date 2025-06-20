import { NextResponse } from "next/server"
import type { User } from "@/lib/types"
import { mockAdminUser, mockCustomerUser } from "../utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Simple validation
    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
        },
        { status: 400 },
      )
    }

    // Mock authentication
    let user: User | null = null

    if (username.toLowerCase() === "admin" && password === "password") {
      user = mockAdminUser
    } else if (username.toLowerCase() === "customer" && password === "password") {
      user = mockCustomerUser
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      user,
      message: "เข้าสู่ระบบสำเร็จ",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
