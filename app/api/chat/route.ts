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
    console.log("Received messages:", JSON.stringify(messages, null, 2));

    console.log("Creating OpenAI stream...");
    
    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    console.log("Stream created, returning response");
    
    // This is the key fix - ensure proper streaming response
    const response = result.toDataStreamResponse();
    
    // Add proper headers for CORS if needed
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    
    return response;
    
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

// Add OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}