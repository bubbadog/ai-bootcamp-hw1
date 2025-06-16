import { OpenAIStream, StreamingTextResponse } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';
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

    // Use OpenAI directly for better compatibility
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Convert the response to a streaming text response
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
    
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
      runtime: "edge"
    }), 
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}