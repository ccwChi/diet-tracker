import { DefaultSession } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string          // Cognito sub
    } & DefaultSession["user"]
    accessToken?: string
    expiresAt?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token?: string
    expires_at?: number
  }
}
