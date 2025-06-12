import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, AlertTriangle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-orange-500" />
          </div>
          <div>
            <CardTitle className="text-2xl">404</CardTitle>
            <CardDescription className="text-lg">ไม่พบหน้านี้</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">ขออภัย หน้าที่คุณกำลังมองหาไม่มีอยู่ในระบบ</p>
          <Link href="/" className="flex justify-center">
            <Button className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>กลับหน้าหลัก</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
