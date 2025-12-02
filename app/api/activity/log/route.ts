import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { Activity } from "@/models/Activity";

const DEMO_USER_ID = "demo-user";

// POST /api/activity/log
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, title, startTime, endTime, durationMinutes, notes } = body;

    if (!type) {
      return NextResponse.json({ message: "type is required" }, { status: 400 });
    }

    const activity = await Activity.create({
      userId: DEMO_USER_ID,
      type,
      title,
      startTime: startTime ? new Date(startTime) : new Date(),
      endTime: endTime ? new Date(endTime) : undefined,
      durationMinutes,
      notes,
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("POST /api/activity/log error:", error);
    return NextResponse.json({ message: "Failed to log activity" }, { status: 500 });
  }
}
