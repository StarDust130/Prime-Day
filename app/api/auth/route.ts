import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../../lib/models/User";
import Onboarding from "../../../lib/models/Onboarding";
import { cookies } from "next/headers"; // Import cookies



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, birthday } = body;

    if (!username || !birthday) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if username exists (Enforce Uniqueness)
    const existingUser = await User.findOne({ username });

    let user = null;
    let isLogin = false;
    let hasOnboarded = false;

    if (existingUser) {
      // --- CASE A: LOGIN ATTEMPT ---

      // Check if the provided birthday matches the stored one
      // (Simple way to verify identity without a password)
      const inputDate = new Date(birthday).toISOString().split("T")[0];
      const storedDate = new Date(existingUser.birthday)
        .toISOString()
        .split("T")[0];

      if (inputDate !== storedDate) {
        // Username exists, but birthday is wrong.
        // Since this is a combined page, we treat this as "Username Taken"
        return NextResponse.json(
          {
            error:
              "Username is already taken. If this is you, check your birthday.",
          },
          { status: 401 }
        );
      }

      // Credentials match!
      user = existingUser;
      isLogin = true;

      // Check if they have finished onboarding previously
      const onboardingData = await Onboarding.findOne({ userId: user._id });
      if (onboardingData) {
        hasOnboarded = true;
      }
    } else {
      // --- CASE B: SIGNUP (NEW USER) ---
      user = await User.create({
        username,
        birthday: new Date(birthday),
      });
      // New users obviously haven't onboarded
      hasOnboarded = false;
    }

    // 2. Set the Secure Cookie (Crucial for Middleware)
    const cookieStore = await cookies();
    const cookieData = JSON.stringify({ userId: user._id, hasOnboarded });

    cookieStore.set("prime_user", cookieData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 Days
    });

    // 3. Respond
    return NextResponse.json(
      {
        success: true,
        userId: user._id,
        hasOnboarded: hasOnboarded,
        message: isLogin ? "Welcome back!" : "Profile created!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle duplicate key error explicitly (Double safety)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }
    console.error("Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}