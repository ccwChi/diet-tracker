// src/app/settings/page.tsx
import PreferencesForm from "@/components/ui/prefereces-form";
import React from "react";


export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        使用者偏好設定
      </h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <PreferencesForm />
      </div>
    </div>
  );
}
