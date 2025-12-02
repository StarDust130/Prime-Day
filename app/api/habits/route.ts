import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Habit } from "@/models/Habit";

const DEMO_USER_ID = "demo-user"; // replace with real auth later

// GET /api/habits
export async function GET() {
  try {
    await connectDB();
    const habits = await Habit.find({ userId: DEMO_USER_ID }).sort({ createdAt: -1 });
    return NextResponse.json(habits, { status: 200 });
  } catch (error) {
    console.error("GET /api/habits error:", error);
    return NextResponse.json({ message: "Failed to fetch habits" }, { status: 500 });
  }
}

// POST /api/habits
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, description, frequency, targetPerDay } = body;

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const habit = await Habit.create({
      userId: DEMO_USER_ID,
      name,
      description,
      frequency: frequency || "daily",
      targetPerDay,
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("POST /api/habits error:", error);
    return NextResponse.json({ message: "Failed to create habit" }, { status: 500 });
  }
}
