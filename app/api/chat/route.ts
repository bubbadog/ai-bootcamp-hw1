import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json();
    console.log("API called with messages:", messages);

    const result = streamText({
      model: openai("gpt-4o-mini"), // Changed to gpt-4o-mini for better reliability
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ 
      message: "Chat API is working",
      hasApiKey: !!process.env.OPENAI_API_KEY 
    }), 
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}