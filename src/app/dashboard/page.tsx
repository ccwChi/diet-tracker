"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";
import Sidebar from "@/components/ui/sidebar";

const nutrientData = [
  { name: "蛋白質", value: 30 },
  { name: "碳水", value: 50 },
  { name: "脂肪", value: 20 },
];

const COLORS = ["#4ade80", "#60a5fa", "#facc15"];

const recentMeals = [
  {
    id: 1,
    time: "早餐",
    name: "雞胸肉便當",
    calories: 450,
    image: "/sample1.jpg",
  },
  {
    id: 2,
    time: "午餐",
    name: "牛肉燴飯",
    calories: 600,
    image: "/sample2.jpg",
  },
  {
    id: 3,
    time: "晚餐",
    name: "水煮鮭魚",
    calories: 520,
    image: "/sample3.jpg",
  },
];

export default function DashboardPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">今日總覽</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">攝取熱量</h2>
            <p className="text-3xl font-bold text-green-600">1570 大卡</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">營養素比例</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutrientData}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {nutrientData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">今日飲食紀錄</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {recentMeals.map((meal) => (
            <Card key={meal.id}>
              <CardContent className="p-4">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
                <h3 className="text-md font-bold">{meal.time}：{meal.name}</h3>
                <p className="text-sm text-gray-500">熱量：{meal.calories} 大卡</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <Link href="/record/new">
          <Button className="rounded-full w-14 h-14 text-2xl shadow-lg">＋</Button>
        </Link>
      </div>
    </main>
  );
}
