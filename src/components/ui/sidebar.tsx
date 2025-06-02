"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  PencilLine,
  ImagePlus,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Search,
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);

  const handleLogout = async () => {
    // 1. 清掉 NextAuth 的 session cookie
    await signOut({ redirect: false });
    // 2. 導到 Cognito logout endpoint（請先在 .env 加入 NEXT_PUBLIC_ 前綴的環境變數）
    const issuer   = process.env.NEXT_PUBLIC_COGNITO_ISSUER!;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const logoutUri = encodeURIComponent(
      (process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? window.location.origin) + "/login"
    );
    window.location.href = `${issuer}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div
        className={`fixed top-0 left-0 h-screen transition-all z-50 ${
          isOpen ? "w-64" : "w-14"
        } bg-white dark:bg-neutral-800 border-r`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-2 overflow-hidden">
            <Image src={isDark? "/logo_dark.webp": "/logo_light.webp"} alt="Logo" width={isOpen ? 40 : 30} height={isOpen ? 40 :30} />
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  DietTracker
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  健康飲食紀錄
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-all ${
              !isOpen ? "translate-x-8" : "translate-x-0"
            }`}
          >
            <ChevronRight
              className={`w-4 h-4 transform transition-transform ${
                isOpen ? "rotate-180" : "rotate-0 "
              }`}
            />
          </button>
        </div>

        <div className="px-2">
          <div
            onClick={() => setIsOpen(true)}
            className="flex items-center px-2 py-2 mb-2 bg-gray-100 dark:bg-neutral-700 rounded cursor-pointer"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            {isOpen && (
              <input
                className="ml-2 bg-transparent outline-none w-full text-sm text-gray-700 dark:text-gray-100"
                placeholder="搜尋..."
              />
            )}
          </div>

          <ul className="space-y-1">
            {[
              { icon: LayoutDashboard, text: "今日飲食", href: "/dashboard" },
              { icon: PencilLine, text: "新增紀錄", href: "/record/new" },
              {
                icon: ImagePlus,
                text: "AI辨識上傳",
                href: "/upload-image",
              },
              { icon: BarChart3, text: "飲食統計", href: "/stats" },
              { icon: Users, text: "好友與分享", href: "/friends" },
              { icon: Settings, text: "帳號設定", href: "/settings" },
            ].map(({ icon: Icon, text, href }) => (
              <li key={text}>
                <a
                  href={href}
                  className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded hover:bg-indigo-500 hover:text-white dark:hover:text-white"
                >
                  <Icon className="w-4 h-4" />
                  {isOpen && (
                    <span className="ml-3 text-sm font-medium">{text}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-2 pb-4">
        <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-gray-700 dark:text-gray-200 rounded hover:bg-red-500 hover:text-white transition"
          >
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="ml-3 text-sm font-medium">登出</span>}
          </button>

          {/* <div className="mt-3 flex items-center justify-between px-3 py-2 rounded bg-gray-100 dark:bg-neutral-700">
            <div className="flex items-center space-x-2">
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              {isOpen && (
                <span className="text-sm">
                  {isDark ? "亮色模式" : "暗色模式"}
                </span>
              )}
            </div>
            <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                id="toggle"
                checked={isDark}
                onChange={() => setIsDark(!isDark)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer left-0 top-0"
              />
              <label
                htmlFor="toggle"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
              ></label>
            </div>
          </div> */}
        </div>
      </div>

      <main className={`ml-${isOpen ? "64" : "20"}`}>
        <div className="p-8 text-2xl font-semibold text-gray-800 dark:text-gray-100">
          DietTracker 主畫面
        </div>
      </main>
    </div>
  );
}
