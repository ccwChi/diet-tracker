// src/auth/config.ts
import Cognito from "next-auth/providers/cognito"
import type { NextAuthOptions } from "next-auth"

export const providerConfig = {
  providers: [
    Cognito({
      clientId:     process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer:       process.env.COGNITO_ISSUER!,
      profile(profile) {
        return {
          id:    profile.sub,
          name:  profile.name,
          email: profile.email,
          image: profile.picture,   // 根據 Cognito 回傳的 JSON 結構調整
        };
      },
    }),
  ],
} satisfies Pick<NextAuthOptions, "providers">
