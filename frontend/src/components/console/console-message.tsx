"use client";

import type {
  Message,
  Message as StreamMessage,
} from "@langchain/langgraph-sdk";
import { cn } from "~/lib/utils";

interface ConsoleMessageProps {
  message: StreamMessage;
}

const MESSAGE_TYPE_LABEL_MAP: Record<Message["type"], string> = {
  ai: "ASSISTANT",
  human: "USER",
  system: "SYSTEM",
  tool: "TOOL",
  remove: "REMOVE",
  function: "FUNCTION",
};

export function ConsoleMessage({ message }: ConsoleMessageProps) {
  const isUser = message.type === "human";

  let renderedContent: React.ReactNode | React.ReactNode[] = null;

  if (typeof message.content === "string") {
    renderedContent = message.content;
  } else if (Array.isArray(message.content)) {
    renderedContent = message.content.map((part, index) => {
      if (typeof part === "string") {
        return <div key={index}>{part}</div>;
      }
      // Check if part is an object that has a 'text' property (like TextContentPart)
      if (
        part &&
        typeof part === "object" &&
        "text" in part &&
        typeof (part as { text?: unknown }).text === "string"
      ) {
        return <div key={index}>{(part as { text: string }).text}</div>;
      }
      // Fallback for other complex part structures
      return <div key={index}>{JSON.stringify(part)}</div>;
    });
  } else if (message.content && typeof message.content === "object") {
    // This case might handle things like AIMessage.tool_calls if not filtered earlier
    renderedContent = <div>{JSON.stringify(message.content)}</div>;
  }

  if (Array.isArray(renderedContent)) {
    const filteredContent = renderedContent.filter(Boolean);
    if (filteredContent.length === 0) {
      renderedContent = null;
    } else {
      renderedContent = filteredContent;
    }
  }

  // Only display human and AI messages that end up with actual content.
  if (!renderedContent || (message.type !== "human" && message.type !== "ai")) {
    return null;
  }

  return (
    <div className="text-foreground">
      <span
        className={cn(
          "text-xs",
          isUser ? "text-foreground" : "text-primary",
          "select-none"
        )}
      >
        {MESSAGE_TYPE_LABEL_MAP[message.type]}:
      </span>
      <div className="ml-5 mt-1 whitespace-pre-wrap">{renderedContent}</div>
    </div>
  );
}
