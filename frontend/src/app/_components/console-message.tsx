"use client";

import type { Message as StreamMessage } from "@langchain/langgraph-sdk";

interface ConsoleMessageProps {
  message: StreamMessage;
}

export function ConsoleMessage({ message }: ConsoleMessageProps) {
  console.log("message", message);
  const isUser = message.type === "human";

  let content = "";
  if (typeof message.content === "string") {
    content = message.content;
  } else if (Array.isArray(message.content)) {
    content = message.content
      .map((part) => {
        if (typeof part === "string") return part;

        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof part.text === "string"
        )
          return part.text;
        return JSON.stringify(part);
      })
      .join("\n");
  } else if (message.content && typeof message.content === "object") {
    content = JSON.stringify(message.content);
  }

  // Only display human and AI messages with content.
  // System messages might be handled differently or not displayed directly in the chat log.
  if (!content || (message.type !== "human" && message.type !== "ai")) {
    return null;
  }

  return (
    <div className="text-foreground">
      <span
        className={`text-xs ${isUser ? "text-foreground" : "text-primary"}`}
      >
        {isUser ? "USER" : message.type?.toUpperCase() || "SYSTEM"}:
      </span>
      <p className="ml-5 mt-1 whitespace-pre-wrap">{content}</p>
    </div>
  );
}
