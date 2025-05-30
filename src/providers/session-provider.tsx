// src/components/SessionWrapper.tsx
"use client"; // ✅ 這是一個 Client Component

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface Props {
  session: Session | null;
  children: React.ReactNode;
}

export function SessionWrapper({ session, children }: Props) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
