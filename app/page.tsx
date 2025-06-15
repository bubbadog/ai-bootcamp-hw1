"use client";
import { useChat } from "ai/react";

export default function Chat() {
  // Only call useChat() once!
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat();

  const generatePoem = () => {
    append({
      role: "user",
      content: "Write a beautiful short poem about coding and AI",
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">AI Poem Generator</h1>

      <button
        onClick={generatePoem}
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
      >
        {isLoading ? "Generating..." : "Generate a Poem"}
      </button>

      <div className="mt-6">
        {messages.map((m) => (
          <div key={m.id} className="mb-4">
            {m.role === "assistant" && (
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap font-serif">
                  {m.content}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}