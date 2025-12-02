import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Habit from "@/lib/models/Habit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { habitId, date } = body;

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Normalize date to start of day for comparison
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetISO = targetDate.toISOString();

    // Check if date exists in history
    const dateIndex = habit.completedDates.findIndex(
      (d: Date) => d.toISOString() === targetISO
    );

    let completed = false;

    if (dateIndex > -1) {
      // Remove date (Untoggle)
      habit.completedDates.splice(dateIndex, 1);
      completed = false;
    } else {
      // Add date (Toggle)
      habit.completedDates.push(targetISO);
      completed = true;
    }

    // Simple Streak Calculation
    habit.streak = habit.completedDates.length;

    await habit.save();

    return NextResponse.json({
      success: true,
      completed,
      streak: habit.streak,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to toggle habit" },
      { status: 500 }
    );
  }
}
