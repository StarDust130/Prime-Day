import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Onboarding from "@/lib/models/Onboarding";
import { getAIResponse } from "@/lib/ai";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("prime_user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = JSON.parse(userCookie.value);
    const { message, history } = await req.json();

    await connectDB();
    const onboarding = await Onboarding.findOne({ userId });

    const context = onboarding
      ? `
      User Profile:
      - Goals: ${onboarding.focus.join(", ")}
      - Sleep: ${onboarding.sleep}
      - Obstacles: ${onboarding.obstacles.join(", ")}
      - Vision: ${onboarding.longTermVision || "Not specified"}
      - Routine: ${onboarding.dailyRoutine || "Not specified"}
      - Struggles: ${onboarding.specificStruggles || "Not specified"}
    `
      : "User profile not found.";

    const systemPrompt = `
      You are Prime Day's AI Coach. You are a wise, empathetic, but firm life coach.
      Your goal is to help the user achieve their goals and build better habits.
      
      ${context}

      Use the user's profile to give personalized advice.
      Keep responses concise (under 100 words) unless asked for a detailed plan.
      Be encouraging but realistic.
    `;

    // Construct conversation history for the prompt
    // Note: In a real app, we'd pass the full history array to the LLM if supported,
    // but here we'll just append the last few messages to the prompt or rely on the single turn if the API is stateless.
    // Groq API supports messages array, so let's use that in the lib if we can, but our lib helper is simple.
    // For now, we'll just send the current message with the system prompt.
    // To support history, we'd need to update the lib or just concatenate here.

    // Let's just use the simple helper for now, it's stateless per request but we can pass context.

    const response = await getAIResponse(message, systemPrompt, "smart");

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({
      response: "I'm having trouble connecting to my brain right now.",
    });
  }
}
