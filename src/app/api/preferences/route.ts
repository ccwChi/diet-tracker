// src/app/api/preferences/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/options";

type PreferencePayload = {
  calorieGoal?: number;
  isVegetarian?: boolean;
  language?: string;
  measurementUnit?: string;
  theme?: "light" | "dark" | "system";
};

export async function GET(req: NextRequest) {
  // 1. 驗證 session，拿到 user.id
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const userId = session.user.id;

  // 2. 從 DB 找出該 user 的 preferences
  const pref = await db.userPreference.findUnique({
    where: { userId },
    select: {
      calorieGoal: true,
      isVegetarian: true,
      language: true,
      measurementUnit: true,
      theme: true, // 一併選回 theme
    },
  });

  // 3. 如果 DB 裡沒有任何記錄，就回傳預設值 object
  //    預設 theme = "system"，其他欄位可視需求設 null 或預先定義
  if (!pref) {
    return NextResponse.json({
      calorieGoal: null,
      isVegetarian: false,
      language: "zh-TW",
      measurementUnit: "metric",
      theme: "system",
    });
  }

  // 4. 回傳 preferences
  return NextResponse.json(pref || {});
}

export async function PUT(req: NextRequest) {
  // 1. 驗證 session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const userId = session.user.id;
  let payload: PreferencePayload = {};
  try {
    payload = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "無效的 JSON" }, { status: 400 });
  }

  // 3. 驗證各欄位
  if (payload.theme && !["light", "dark", "system"].includes(payload.theme)) {
    return NextResponse.json(
      { error: "無效的 theme，僅可為 light、dark 或 system" },
      { status: 400 }
    );
  }

  // 2. 用 upsert：若無則建立，若有則更新
  const updated = await db.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      calorieGoal: payload.calorieGoal ?? undefined,
      isVegetarian: payload.isVegetarian ?? undefined,
      language: payload.language ?? undefined,
      measurementUnit: payload.measurementUnit ?? undefined,
      theme: payload.theme ?? "system",
    },
    update: {
      calorieGoal: payload.calorieGoal ?? undefined,
      isVegetarian: payload.isVegetarian ?? undefined,
      language: payload.language ?? undefined,
      measurementUnit: payload.measurementUnit ?? undefined,
      theme:           payload.theme ?? undefined,
      updatedAt:       new Date(),
    },
  });

  return NextResponse.json(updated);
}
