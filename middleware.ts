import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login'

  // ถ้าไม่มี token และไม่ได้อยู่ที่หน้า login ให้ redirect ไปหน้า login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ถ้ามี token แล้วพยายามเข้าหน้า login ให้ redirect ไปหน้า dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 