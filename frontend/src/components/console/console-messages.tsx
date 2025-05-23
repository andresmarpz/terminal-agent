"use client";

import type { Message } from "@langchain/langgraph-sdk";
import React, { useEffect, useRef } from "react";
import { ConsoleMessage } from "./console-message";
import { ConsoleWelcomeMessage } from "./console-welcome-message";

interface ConsoleMessagesProps {
  messages: Message[];
  onExampleCommandSubmit?: (commandText: string) => void;
}

export function ConsoleMessages({
  messages,
  onExampleCommandSubmit,
}: ConsoleMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-grow overflow-y-auto mb-3 p-3 border border-muted/70 bg-background/50 rounded-sm min-h-0 pb-8"
    >
      <div className="space-y-4">
        {messages.length === 0 ? (
          <ConsoleWelcomeMessage
            onExampleCommandClick={onExampleCommandSubmit}
          />
        ) : (
          messages.map((msg, index) => (
            <ConsoleMessage key={msg.id || `msg-${index}`} message={msg} />
          ))
        )}
      </div>
    </div>
  );
}
