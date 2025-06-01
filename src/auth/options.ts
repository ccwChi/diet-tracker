// src/auth/options.ts
import type { NextAuthOptions, User, Account, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { db } from "@/lib/db";
import { providerConfig } from "./config";

export const authOptions: NextAuthOptions = {
  ...providerConfig,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async signIn() {
      // 只要回 true 代表允許登入。
      // 如果要「拒絕」(return false)，就先做黑名單／付費判斷等。 
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.expires_at   = account.expires_at;
      }
      return token as JWT;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub as string;
      session.accessToken = token.access_token;
      session.expiresAt   = token.expires_at;
      return session as Session;
    },
  },
  events: {
    async signIn({ user }) {
      // 1) upsert user：確保 profile 與 avatar 都存到 user table
      await db.user.upsert({
        where: { id: user.id },
        create: {
          id:         user.id,
          cognitoSub: user.id,
          email:      user.email!,
          name:       user.name!,
          avatarUrl:  (user.image as string) || null,
        },
        update: {
          email:     user.email!,
          name:      user.name!,
          avatarUrl: (user.image as string) || null,
          updatedAt: new Date(),
        },
      });

      // 2) upsert preference：確保這個 userId 一定有一筆偏好設定
      await db.userPreference.upsert({
        where: { userId: user.id },
        create: {
          userId:          user.id,
          calorieGoal:     null,
          isVegetarian:    false,
          language:        "zh-TW",
          measurementUnit: "metric",
          theme:           "system",
        },
        update: {
          // 不強迫更新任何欄位
        },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
};
