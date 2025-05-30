// src/auth/options.ts
import type { NextAuthOptions, User, Account, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { db } from "@/lib/db"
import { providerConfig } from "./config"

export const authOptions: NextAuthOptions = {
  ...providerConfig,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user }) {
      // 首次登入建立本地 User（只存可公開欄位）
      const exists = await db.user.findUnique({ where: { id: user.id } })
      if (!exists) {
        await db.user.create({
          data: { id: user.id, email: user.email!, name: user.name },
        })
      }
      return true
    },

    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token
        token.expires_at   = account.expires_at
      }
      return token as JWT
    },

    async session({ session, token }) {
      if (session.user) session.user.id = token.sub as string
      session.accessToken = token.access_token
      session.expiresAt   = token.expires_at
      return session as Session
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
}
