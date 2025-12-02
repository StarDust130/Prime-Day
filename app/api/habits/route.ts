import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Habit from "@/lib/models/Habit";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    const habits = await Habit.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: habits });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, icon, color, priority } = body;

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    const newHabit = await Habit.create({
      userId,
      name,
      icon: icon || "⚡",
      color: color || "bg-[#38BDF8]",
      priority: priority || "medium",
      completedDates: [],
      streak: 0,
    });

    return NextResponse.json(
      { success: true, data: newHabit },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
