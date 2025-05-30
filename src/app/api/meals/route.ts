import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/auth/options"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 })

  const meals = await prisma.meal.findMany({
    where: { userId: session.user.id },
    include: { foods: true },
    orderBy: { takenAt: "desc" },
  })
  return NextResponse.json(meals)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "unauth" }, { status: 401 })

  const body = await req.json()
  const { takenAt, note, foods, imageKey } = body

  const meal = await prisma.meal.create({
    data: {
      userId:  session.user.id,
      takenAt: new Date(takenAt),
      note,
      imageKey,
      foods: { create: foods },
    },
    include: { foods: true },
  })
  return NextResponse.json(meal, { status: 201 })
}
