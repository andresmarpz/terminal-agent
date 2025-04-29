"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useQueryState } from "nuqs";
import { useCallback, useRef } from "react";
import { env } from "~/lib/constants";
import Terminal from "./Terminal";
import { TerminalInput } from "~/components/terminal/TerminalInput";
import TerminalMessage from "~/components/terminal/TerminalMessage";

export default function TerminalChat() {
  const [threadId, setThreadId] = useQueryState("threadId");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { submit, messages, isLoading } = useStream({
    apiUrl: env.AGENT_BASE_URL,
    assistantId: env.AGENT_ASSISTANT_ID!,
    threadId,

    onThreadId(threadId) {
      setThreadId(threadId);
    },
  });

  const handleSubmitMessage = useCallback(
    (content: string) => {
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

  console.log(messages);

  return (
    <Terminal>
      <div className="flex flex-col gap-2 grow overflow-y-auto py-4">
        {messages.map((message, index) => (
          <>
            <TerminalMessage key={message.id} message={message} />
            {(message.type === "human" ||
              messages[index + 1]?.type === "human") && (
              <hr className="border-t-zinc-700" />
            )}
          </>
        ))}
        {isLoading && messages[messages.length - 1].type === "human" && (
          <TerminalMessage message={{ type: "ai", content: "Thinking..." }} />
        )}
      </div>
      <TerminalInput onSubmit={handleSubmitMessage} />

      <div ref={messagesEndRef} />

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
