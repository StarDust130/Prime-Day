import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FriendRequest from "@/lib/models/FriendRequest";
import User from "@/lib/models/User";
import Habit from "@/lib/models/Habit";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    // Find all accepted friend requests involving the current user
    const friendships = await FriendRequest.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: "accepted",
    }).populate("sender receiver", "username _id");

    const friendsData = [];

    for (const friendship of friendships) {
      // Determine which user is the "friend"
      const friend =
        friendship.sender._id.toString() === userId
          ? friendship.receiver
          : friendship.sender;

      // Get their stats
      const habits = await Habit.find({ userId: friend._id });
      const today = new Date().toISOString().split("T")[0];

      const completedToday = habits.filter((h) => {
        if (!Array.isArray(h.completedDates)) return false;
        return h.completedDates.some((d: any) => {
          if (typeof d === "string") return d.startsWith(today);
          if (d instanceof Date) return d.toISOString().startsWith(today);
          return false;
        });
      }).length;

      const maxStreak = habits.reduce(
        (max: number, h: any) => Math.max(max, h.streak || 0),
        0
      );

      friendsData.push({
        _id: friend._id,
        username: friend.username,
        completedToday,
        streak: maxStreak,
      });
    }

    return NextResponse.json({ friends: friendsData });
  } catch (error) {
    console.error("Friends Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch friends" },
      { status: 500 }
    );
  }
}
