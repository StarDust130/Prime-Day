import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Activity } from "@/models/Activity";

const DEMO_USER_ID = "demo-user";

// GET /api/activity/today
export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const activities = await Activity.find({
      userId: DEMO_USER_ID,
      startTime: { $gte: start, $lte: end },
    }).sort({ startTime: -1 });

    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    console.error("GET /api/activity/today error:", error);
    return NextResponse.json({ message: "Failed to fetch today activities" }, { status: 500 });
  }
}
