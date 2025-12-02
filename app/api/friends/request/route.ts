import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import FriendRequest from "@/lib/models/FriendRequest";
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
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target user required" },
        { status: 400 }
      );
    }

    if (userId === targetUserId) {
      return NextResponse.json(
        { error: "Cannot add yourself" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: userId, receiver: targetUserId },
        { sender: targetUserId, receiver: userId },
      ],
    });

    if (existingRequest) {
      if (existingRequest.status === "accepted") {
        return NextResponse.json({ error: "Already friends" }, { status: 400 });
      }
      if (existingRequest.status === "pending") {
        return NextResponse.json(
          { error: "Request already pending" },
          { status: 400 }
        );
      }
      // If rejected, we might allow resending, but for now let's say "Request previously rejected" or just reset it.
      // Let's update it to pending if it was rejected (optional logic)
      existingRequest.status = "pending";
      existingRequest.sender = userId; // Ensure sender is the one re-initiating
      existingRequest.receiver = targetUserId;
      await existingRequest.save();
      return NextResponse.json({ success: true, status: "pending" });
    }

    await FriendRequest.create({
      sender: userId,
      receiver: targetUserId,
      status: "pending",
    });

    return NextResponse.json({ success: true, status: "pending" });
  } catch (error) {
    console.error("Friend Request Error:", error);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    const { requestId, action } = await req.json(); // action: 'accept' | 'reject'

    await connectDB();

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Verify the receiver is the current user
    if (request.receiver.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (action === "accept") {
      request.status = "accepted";
    } else if (action === "reject") {
      request.status = "rejected";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await request.save();

    return NextResponse.json({ success: true, status: request.status });
  } catch (error) {
    console.error("Friend Request Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    await connectDB();

    // Get incoming pending requests
    const incoming = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "username _id");

    // Get outgoing pending requests
    const outgoing = await FriendRequest.find({
      sender: userId,
      status: "pending",
    }).populate("receiver", "username _id");

    return NextResponse.json({ incoming, outgoing });
  } catch (error) {
    console.error("Fetch Requests Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Allow sender to cancel
    if (request.sender.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Request Error:", error);
    return NextResponse.json(
      { error: "Failed to delete request" },
      { status: 500 }
    );
  }
}
