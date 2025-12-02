import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Onboarding from "@/lib/models/Onboarding";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, focus, sleep, obstacles } = body;

    await connectDB();

    // Create entry
    const newEntry = await Onboarding.create({
      userId,
      focus,
      sleep,
      obstacles,
    });

    // --- NEW: Update Cookie to unlock Dashboard ---
    const cookieStore = await cookies();

    // Update the existing cookie
    const updatedCookieData = JSON.stringify({
      userId: userId,
      hasOnboarded: true,
    });

    cookieStore.set("prime_user", updatedCookieData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
