"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import type { Message } from "@langchain/langgraph-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ConsoleInput } from "./console-input";
import { ConsoleMessages } from "./console-messages";

export default function Console() {
  const { submit, messages, isLoading, error } = useStream<{
    messages: Message[];
    // You can define other parts of your state here if your agent returns more than messages
  }>({
    apiUrl: process.env.NEXT_PUBLIC_AGENT_BASE_URL,
    assistantId: process.env.NEXT_PUBLIC_AGENT_ASSISTANT_ID!,
    // streamMode: ["messages"], // streamMode is not a direct option for useStream hook itself, it's inferred by messagesKey
    messagesKey: "messages", // This tells the hook to populate `messages` based on streamed message events
  });

  const handleSubmit = (input: string) => {
    submit({
      messages: [{ type: "human", content: input, id: crypto.randomUUID() }],
    });
  };

  const displayMessages = messages || [];

  let errorMessage: string | null = null;
  if (error) {
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = "An unknown error occurred.";
      }
    }
  }

  return (
    <Card className="lg:col-span-6 row-span-2 flex flex-col min-h-0 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-primary">CONSOLE</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col min-h-0">
        {errorMessage && (
          <div className="text-red-500 p-2 border border-red-500 bg-red-100 rounded-md mb-2">
            <p>Error: {errorMessage}</p>
          </div>
        )}
        <ConsoleMessages messages={displayMessages} />
        <ConsoleInput onSubmit={handleSubmit} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}
