import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongodb";
import Habit from "@/lib/models/Habit";
import Goal from "@/lib/models/Goal";
import User from "@/lib/models/User";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    const user = await User.findById(userId).select("username email");
    const habits = await Habit.find({ userId });
    const goals = await Goal.find({ userId });

    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const activeHabits = habits.length;
    const completedToday = habits.filter((h) =>
      h.completedDates.includes(todayISO)
    ).length;

    const activeGoals = goals.filter((g) => g.status === "active").length;
    const upcomingGoals = goals
      .filter((g) => g.status === "active" && g.deadline)
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
      .slice(0, 3);

    return NextResponse.json({
      success: true,
      data: {
        user,
        stats: {
          activeHabits,
          completedToday,
          activeGoals,
        },
        upcomingGoals,
        todaysHabits: habits.slice(0, 3), // Just show a few
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
