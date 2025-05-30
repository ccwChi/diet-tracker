"use client"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      console.log("已登入，重定向到首頁")
      console.log("Session Data:", session)
      router.replace("/dashboard") // 使用 replace 以避免返回到登入頁面
    }
  }, [status, router])

  if (status === "authenticated") {
    return null // 可選，避免畫面閃爍
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">登入飲食紀錄</h1>
      <button
        onClick={() => signIn("cognito")}
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        使用 Cognito 帳號登入
      </button>
    </div>
  )
}
