// import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";

// import { db } from "./lib/db";
// import { UserRole } from "@prisma/client";
// import authConfig from "./auth.config";
// import { getUserById } from "./data/auth-data/user";
// import { getAccountByUserId } from "./data/auth-data/account";
// import { getTwoFactorConfirmationByUserId } from "./data/auth-data/two-factor-confirmation";

// export const { auth, handlers, signIn, signOut } = NextAuth({
//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/error",
//   },
//   events: {
//     async linkAccount({ user }) {
//       await db.user.update({
//         where: { id: user.id },
//         data: { emailVerified: new Date() },
//       });
//     },
//   },
//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider !== "credentials") return true;
//       return true;
//     },
//     async session({ token, session }) {
//       return session;
//     },
//     async jwt({ token, user, profile }) {
//       return token;
//     },
//   },
//   adapter: PrismaAdapter(db),
//   session: { strategy: "jwt" },
//   ...authConfig,
// });
