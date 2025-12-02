import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/lib/models/User";
import FriendRequest from "@/lib/models/FriendRequest";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ users: [] });
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");
    let currentUserId = null;

    if (userCookie) {
      const { userId } = JSON.parse(userCookie.value);
      currentUserId = userId;
    }

    await connectDB();

    // Find users matching the query, excluding the current user
    const users = await User.find({
      username: { $regex: query, $options: "i" },
      _id: { $ne: currentUserId },
    })
      .select("username _id")
      .limit(10);

    // Check friend status for each user
    const results = await Promise.all(
      users.map(async (user) => {
        let status = "none"; // none, pending_sent, pending_received, accepted

        if (currentUserId) {
          const request = await FriendRequest.findOne({
            $or: [
              { sender: currentUserId, receiver: user._id },
              { sender: user._id, receiver: currentUserId },
            ],
          });

          if (request) {
            if (request.status === "accepted") {
              status = "accepted";
            } else if (request.status === "pending") {
              status =
                request.sender.toString() === currentUserId
                  ? "pending_sent"
                  : "pending_received";
            }
          }
        }

        return {
          _id: user._id,
          username: user.username,
          status,
        };
      })
    );

    return NextResponse.json({ users: results });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search users" },
      { status: 500 }
    );
  }
}
