import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("API route called");
    
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }), 
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const { messages } = await req.json();
    console.log("Received messages:", messages?.length, "messages");

    console.log("Creating OpenAI stream...");
    
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log("Stream created, returning response");
    
    // Use toDataStreamResponse which should be available in your AI SDK version
    return result.toDataStreamResponse();
    
  } catch (error) {
    console.error("API Route Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error details:", errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error", 
        details: errorMessage,
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ 
      message: "Chat API is working",
      hasApiKey: !!process.env.OPENAI_API_KEY,
      timestamp: new Date().toISOString(),
      model: "gpt-4o-mini"
    }), 
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}