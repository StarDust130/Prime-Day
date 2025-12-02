import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Goal from "@/lib/models/Goal";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: goals });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, type, deadline, icon, color } = body;

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    const newGoal = await Goal.create({
      userId,
      title,
      description,
      type: type || "short",
      deadline: deadline ? new Date(deadline) : null,
      icon: icon || "🎯",
      color: color || "bg-[#38BDF8]",
      status: "active",
      progress: 0,
    });

    return NextResponse.json({ success: true, data: newGoal });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
