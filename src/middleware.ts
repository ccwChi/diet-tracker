import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server"

export default withAuth({
  pages: { signIn: "/login" },

  // 只要 token 存在就視為已登入；否則未授權
  callbacks: {
    authorized({ req, token }) {
      // 1. API 登入路由一律放行
      if (req.nextUrl.pathname.startsWith("/api/auth")) {
        return true
      }
      // 2. 其餘頁面 / API 只要有 session 就通過
      return !!token
    },
  },
})

export const config = {
  /*
    /dashboard/*         → 受保護頁面
    /api/*               → 受保護 API，但 /api/auth/* 由上面 callbacks 放行
    其他像 /_next/*、/favicon.ico 會被 look-ahead 排除
  */
  matcher: [
    "/dashboard/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
