// src/auth/config.ts
import Cognito from "next-auth/providers/cognito"
import type { NextAuthOptions } from "next-auth"

export const providerConfig = {
  providers: [
    Cognito({
      clientId:     process.env.COGNITO_CLIENT_ID!,
      clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer:       process.env.COGNITO_ISSUER!,
    }),
  ],
} satisfies Pick<NextAuthOptions, "providers">
