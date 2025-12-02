import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { HabitTrack } from "@/models/HabitTrack";

const DEMO_USER_ID = "demo-user";

// GET /api/habits/history?habitId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const habitId = searchParams.get("habitId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const query: any = { userId: DEMO_USER_ID };
    if (habitId) query.habitId = habitId;

    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }

    const history = await HabitTrack.find(query).sort({ date: 1 });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error("GET /api/habits/history error:", error);
    return NextResponse.json({ message: "Failed to fetch habit history" }, { status: 500 });
  }
}
