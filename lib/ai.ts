import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GQOK_API_KEY,
});

export type AIModel = "fast" | "smart";

const MODELS = {
  fast: "llama-3.1-8b-instant",
  smart: "llama-3.3-70b-versatile",
};

export async function getAIResponse(
  prompt: string,
  systemPrompt: string = "You are a helpful AI life coach.",
  modelType: AIModel = "fast"
) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS[modelType],
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null,
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I'm having trouble thinking right now. Please try again later.";
  }
}

export async function getStreamingAIResponse(
  prompt: string,
  systemPrompt: string = "You are a helpful AI life coach.",
  modelType: AIModel = "fast"
) {
  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: MODELS[modelType],
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: true,
      stop: null,
    });
    return stream;
  } catch (error) {
    console.error("AI Stream Error:", error);
    throw error;
  }
}
