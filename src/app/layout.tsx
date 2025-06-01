//src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { auth } from "@/auth/auth";

import { ThemeProvider } from "@/providers/theme-provider";
import { SessionWrapper } from "@/providers/session-provider";
import { QueryProvider } from "@/providers/query-provider";

const geistSans = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "飲食app",
  description: "紀錄小知識",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionWrapper session={session}>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="fubone-blog"
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </SessionWrapper>
  );
}
