import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    const { targetUserId, action } = await req.json(); // action: 'follow' or 'unfollow'

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user required" },
        { status: 400 }
      );
    }

    await connectDB();

    if (action === "follow") {
      // Add target to current user's following
      await User.findByIdAndUpdate(userId, {
        $addToSet: { following: targetUserId },
      });
      // Add current user to target's followers
      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: userId },
      });
    } else if (action === "unfollow") {
      // Remove target from current user's following
      await User.findByIdAndUpdate(userId, {
        $pull: { following: targetUserId },
      });
      // Remove current user from target's followers
      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: userId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Follow Error:", error);
    return NextResponse.json(
      { error: "Failed to update follow status" },
      { status: 500 }
    );
  }
}
