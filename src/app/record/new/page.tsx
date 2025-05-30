"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function NewRecordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [mealTime, setMealTime] = useState("早餐");
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      // Optional: 自動呼叫 AI API 分析圖片
      // callAI(selected);
    }
  };

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">新增飲食紀錄</h1>

      <div className="space-y-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <Card>
            <CardContent className="p-4">
              <Image
                src={preview}
                alt="preview"
                width={400}
                height={300}
                className="rounded object-cover"
              />
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">用餐時間</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
            >
              <option>早餐</option>
              <option>午餐</option>
              <option>晚餐</option>
              <option>點心</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">熱量（大卡）</label>
            <Input
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">餐點內容</label>
          <Textarea
            rows={2}
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder="例如：雞胸肉飯、青菜、味噌湯"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">蛋白質 (g)</label>
            <Input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">碳水 (g)</label>
            <Input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">脂肪 (g)</label>
            <Input type="number" value={fat} onChange={(e) => setFat(e.target.value)} />
          </div>
        </div>

        <Button className="mt-4 w-full" disabled={loading}>
          {loading ? "儲存中..." : "儲存紀錄"}
        </Button>
      </div>
    </main>
  );
}
