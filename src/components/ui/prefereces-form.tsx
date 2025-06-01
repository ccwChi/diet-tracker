// src/components/ui/preferences-form.tsx
"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";

type PreferencePayload = {
  calorieGoal?: number;
  isVegetarian?: boolean;
  language?: string;
  measurementUnit?: string;
  theme?: "light" | "dark" | "system";
};

async function fetchPreferences(): Promise<PreferencePayload> {
  const res = await fetch("/api/preferences");
  if (!res.ok) {
    throw new Error("無法取得偏好設定");
  }
  return res.json();
}

async function updatePreferences(
  payload: PreferencePayload
): Promise<PreferencePayload> {
  const res = await fetch("/api/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "更新偏好設定失敗");
  }
  return res.json();
}

export default function PreferencesForm() {
  const queryClient = useQueryClient();
  const { theme: currentTheme, setTheme } = useTheme();

  // useQuery 只接受一個 object 參數
  const {
    data: prefData,
    isLoading,
    isError,
    error,
  } = useQuery<PreferencePayload, Error>({
    queryKey: ["preferences"],
    queryFn: fetchPreferences,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // useMutation 也改成 object 參數
  const mutation = useMutation<PreferencePayload, Error, PreferencePayload>({
    mutationFn: (newPrefs: PreferencePayload) => updatePreferences(newPrefs),

    onSuccess(updated: PreferencePayload) {
      queryClient.setQueryData<PreferencePayload>(["preferences"], updated);
    },

    onError(err: Error) {
      console.error("更新偏好設定錯誤：", err.message);
    },
  });

  const [calorieGoal, setCalorieGoal] = useState<number | "">("");
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("zh-TW");
  const [measurementUnit, setMeasurementUnit] = useState<string>("metric");
  const [themeValue, setThemeValue] = useState<"light" | "dark" | "system">(
    "system"
  );

  useEffect(() => {
    if (prefData) {
      setCalorieGoal(prefData.calorieGoal ?? "");
      setIsVegetarian(prefData.isVegetarian ?? false);
      setLanguage(prefData.language ?? "zh-TW");
      setMeasurementUnit(prefData.measurementUnit ?? "metric");
      setThemeValue(prefData.theme ?? "system");
      setTheme(prefData.theme ?? "system");
    }
  }, [prefData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: PreferencePayload = {
      calorieGoal: calorieGoal === "" ? undefined : Number(calorieGoal),
      isVegetarian,
      language,
      measurementUnit,
      theme: themeValue,
    };

    try {
      await mutation.mutateAsync(payload);
      setTheme(themeValue);
      alert("偏好設定已更新");
    } catch (err: any) {
      alert("更新失敗: " + err.message);
    }
  };

  if (isLoading) {
    return <p>載入中...</p>;
  }
  if (isError) {
    return <p>載入偏好設定失敗: {error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label htmlFor="calorieGoal" className="block font-medium">
          每日熱量目標 (kcal)
        </label>
        <input
          type="number"
          id="calorieGoal"
          value={calorieGoal}
          onChange={(e) =>
            setCalorieGoal(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="mt-1 p-2 border rounded w-full"
          placeholder="例如：2000"
        />
      </div>

      {/* 是否為素食者 */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isVegetarian"
          checked={isVegetarian}
          onChange={(e) => setIsVegetarian(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isVegetarian" className="font-medium">
          我是素食者
        </label>
      </div>

      {/* 語言選擇 */}
      <div>
        <label htmlFor="language" className="block font-medium">
          顯示語言
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
          {/* 若將來要加其他語系，可在此補充 */}
        </select>
      </div>

      {/* 單位選擇 */}
      <div>
        <label htmlFor="measurementUnit" className="block font-medium">
          度量單位
        </label>
        <select
          id="measurementUnit"
          value={measurementUnit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
        >
          <option value="metric">公制 (kg, cm)</option>
          <option value="imperial">英制 (lb, in)</option>
        </select>
      </div>

      {/* 主題 (theme) */}
      <div>
        <label className="block font-medium">主題</label>
        <div className="mt-1 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="theme"
              value="light"
              checked={themeValue === "light"}
              onChange={() => setThemeValue("light")}
              className="mr-1"
            />
            淺色 (Light)
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={themeValue === "dark"}
              onChange={() => setThemeValue("dark")}
              className="mr-1"
            />
            深色 (Dark)
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="theme"
              value="system"
              checked={themeValue === "system"}
              onChange={() => setThemeValue("system")}
              className="mr-1"
            />
            系統預設 (System)
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={mutation.isPending}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {mutation.isPending ? "儲存中…" : "儲存偏好設定"}
      </button>
      {mutation.isError && (
        <p className="text-red-600">
          更新失敗: {(mutation.error as Error).message}
        </p>
      )}
    </form>
  );
}
