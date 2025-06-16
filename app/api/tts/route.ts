import { openai } from "@ai-sdk/openai";
import OpenAI from 'openai';

export const maxDuration = 30;

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("TTS API route called");
    
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

    const { text, voice = 'alloy' } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = validVoices.includes(voice) ? voice : 'alloy';

    console.log(`Generating speech for text length: ${text.length}, voice: ${selectedVoice}`);

    const mp3 = await openaiClient.audio.speech.create({
      model: "tts-1",
      voice: selectedVoice as any, // OpenAI voice type
      input: text,
      speed: 0.9, // Slightly slower for poetry
    });

    console.log("Speech generated successfully");

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: { 
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
      }
    });
    
  } catch (error) {
    console.error("TTS API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error details:", errorMessage);
    
    return new Response(
      JSON.stringify({ 
        error: "Text-to-speech generation failed", 
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