import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Onboarding from "@/lib/models/Onboarding";
import { getAIResponse } from "@/lib/ai";
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
    const onboarding = await Onboarding.findOne({ userId });

    if (!onboarding) {
      return NextResponse.json({ tip: "Stay consistent today!" });
    }

    const prompt = `
      User Profile:
      - Goals: ${onboarding.focus.join(", ")}
      - Sleep: ${onboarding.sleep}
      - Obstacles: ${onboarding.obstacles.join(", ")}
      - Vision: ${onboarding.longTermVision || "Not specified"}
      - Struggles: ${onboarding.specificStruggles || "Not specified"}

      Generate a short, punchy, high-energy daily tip (max 20 words) for this user to help them crush their day. 
      Tone: Motivational, direct, like a tough but loving coach.
      Do not use quotes. Just the text.
    `;

    const tip = await getAIResponse(
      prompt,
      "You are a high-performance life coach.",
      "fast"
    );

    return NextResponse.json({ tip });
  } catch (error) {
    console.error("AI Tip Error:", error);
    return NextResponse.json({ tip: "Make today count!" });
  }
}
