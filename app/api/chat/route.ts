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

    console.log("Stream created, returning response with error handling");
    
    // THE KEY FIX: Add getErrorMessage to unmask errors
    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error("Streaming error:", error);
        
        // Type guard to check if error is an Error instance
        if (error instanceof Error) {
          // Return specific error messages for debugging
          if (error.message?.includes('rate limit')) {
            return 'Rate limit exceeded. Please try again later.';
          }
          if (error.message?.includes('API key')) {
            return 'Invalid API key. Please check your configuration.';
          }
          if (error.message?.includes('network')) {
            return 'Network error. Please check your connection.';
          }
          
          // For development, return the actual error message
          // For production, you might want to return a generic message
          return process.env.NODE_ENV === 'development' 
            ? `Error: ${error.message}` 
            : 'An error occurred while generating the poem. Please try again.';
        }
        
        // Fallback for non-Error objects
        return 'An unexpected error occurred.';
      }
    });
    
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