import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { HabitTrack } from "@/models/HabitTrack";

const DEMO_USER_ID = "demo-user";

// POST /api/habits/track
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { habitId, date, value } = body;

    if (!habitId) {
      return NextResponse.json({ message: "habitId is required" }, { status: 400 });
    }

    const day = date ? new Date(date) : new Date();
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const track = await HabitTrack.findOneAndUpdate(
      { userId: DEMO_USER_ID, habitId, date: dayStart },
      { $inc: { value: value || 1 } },
      { upsert: true, new: true }
    );

    return NextResponse.json(track, { status: 200 });
  } catch (error) {
    console.error("POST /api/habits/track error:", error);
    return NextResponse.json({ message: "Failed to track habit" }, { status: 500 });
  }
}
