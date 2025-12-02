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
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    await connectDB();
    const onboarding = await Onboarding.findOne({ userId });

    let prompt = "";

    if (onboarding) {
      prompt = `
      User Profile:
      - Goals: ${onboarding.focus.join(", ")}
      - Sleep: ${onboarding.sleep}
      - Obstacles: ${onboarding.obstacles.join(", ")}
      - Vision: ${onboarding.longTermVision || "Not specified"}
      - Routine: ${onboarding.dailyRoutine || "Not specified"}
      - Struggles: ${onboarding.specificStruggles || "Not specified"}
      ${category ? `- Focus Category: ${category}` : ""}

      Based on this profile${
        category ? ` and the focus category "${category}"` : ""
      }, suggest 3 specific, actionable habits this user should start.
      Format the response as a JSON array of objects with 'name' (string) and 'icon' (emoji string) properties.
      Example: [{"name": "Drink 2L Water", "icon": "💧"}, ...]
      Do not include any markdown formatting or explanation, just the raw JSON array.
    `;
    } else {
      prompt = `
      Suggest 3 highly effective, general habits for a user who wants to improve their life${
        category ? ` in the category of "${category}"` : ""
      }.
      Format the response as a JSON array of objects with 'name' (string) and 'icon' (emoji string) properties.
      Example: [{"name": "Drink 2L Water", "icon": "💧"}, ...]
      Do not include any markdown formatting or explanation, just the raw JSON array.
      `;
    }

    const response = await getAIResponse(
      prompt,
      "You are an expert habit building coach. Output JSON only.",
      "smart"
    );

    // Clean up response if it contains markdown code blocks
    const cleanResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const suggestions = JSON.parse(cleanResponse);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
