"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useQueryState } from "nuqs";
import { Fragment, useCallback, useRef, useEffect } from "react";
import { env } from "~/lib/constants";
import Terminal from "./Terminal";
import { TerminalInput } from "~/components/terminal/TerminalInput";
import TerminalMessage from "~/components/terminal/TerminalMessage";
import TerminalInterrupt, {
  InterruptValue,
  SubmitMetadata,
} from "~/components/terminal/TerminalInterrupt";

// Type guard to check if a value matches InterruptValue shape
function isInterruptValue(value: unknown): value is InterruptValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "tool_name" in value &&
    typeof value.tool_name === "string" &&
    "user_prompt" in value &&
    typeof value.user_prompt === "string" &&
    "allowed_responses" in value &&
    Array.isArray(value.allowed_responses)
  );
}

export default function TerminalChat() {
  const [threadId, setThreadId] = useQueryState("threadId");

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, []);

  const { submit, messages, isLoading, interrupt } = useStream({
    apiUrl: env.AGENT_BASE_URL,
    assistantId: env.AGENT_ASSISTANT_ID!,
    threadId,

    onThreadId(threadId) {
      setThreadId(threadId);
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const handleInterruptSubmit = useCallback(
    (response: string) => {
      submit(undefined, { command: { resume: response } });
    },
    [submit]
  );

  const handleSubmitMessage = useCallback(
    (content: string) => {
      if (interrupt?.resumable) {
        handleInterruptSubmit(content);
        return;
      }

      submit(
        {
          messages: [{ role: "human", content }],
        },
        {
          optimisticValues: () => {
            return {
              messages: [
                ...messages,
                { type: "human", content, id: "temp-message" },
              ],
            };
          },
        }
      );
    },
    [messages, submit]
  );

  // Check if the interrupt.value is a valid InterruptValue
  const interruptValue =
    interrupt?.value && isInterruptValue(interrupt.value)
      ? interrupt.value
      : null;

  return (
    <Terminal>
      <div
        ref={messagesContainerRef}
        className="flex flex-col gap-2 grow overflow-y-auto py-4 pr-2"
      >
        {messages.map((message, index) => (
          <Fragment key={message.id}>
            <TerminalMessage message={message} />
            {(message.type === "human" ||
              messages[index + 1]?.type === "human") && (
              <hr className="border-t-zinc-700" />
            )}
          </Fragment>
        ))}
        {isLoading && messages[messages.length - 1].type === "human" && (
          <TerminalMessage message={{ type: "ai", content: "Thinking..." }} />
        )}
        {interrupt?.resumable && interruptValue && (
          <TerminalInterrupt
            prompt={interruptValue.user_prompt}
            allowedResponses={interruptValue.allowed_responses}
            onSelectResponse={handleInterruptSubmit}
          />
        )}
      </div>
      <hr className="border-t-zinc-700" />
      <TerminalInput onSubmit={handleSubmitMessage} />
      <div className="bg-zinc-800 p-1 text-xs font-mono text-gray-400 flex justify-between border-t border-gray-700 flex-shrink-0">
        <div>
          <span className="mr-2">ctrl+? help</span>
          <span>Tokens: 0, Cost: $0.00</span>
        </div>
        <div className="text-gray-500">
          press <span className="text-white font-bold">enter</span> to send the
          message, write <span className="text-white font-bold">\</span> and
          enter to add a new line
        </div>
      </div>
    </Terminal>
  );
}
