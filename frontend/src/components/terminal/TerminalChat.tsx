"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useQueryState } from "nuqs";
import { Fragment, useCallback, useRef, useEffect } from "react";
import { env } from "~/lib/constants";
import Terminal from "./Terminal";
import { TerminalInput } from "~/components/terminal/TerminalInput";
import TerminalMessage from "~/components/terminal/TerminalMessage";
import TerminalInterrupt, {
  isTerminalInterruptSchema,
  InterruptResponse,
} from "~/components/terminal/TerminalInterrupt";

const WelcomeMessage = () => (
  <div className="terminal-welcome text-zinc-300 mb-4">
    <div className="text-green-400 font-bold mb-2">
      Welcome to Coffee Service Terminal v1.0.0
    </div>
    <p className="mb-2">
      This is an AI-powered terminal interface for managing your coffee service
      operations.
    </p>

    <div className="mb-2">
      <div className="text-yellow-400 font-bold">How it works:</div>
      <p>- Type your request in natural language</p>
      <p>
        - The agent will process your request and interact with the Coffee
        Service API
      </p>
      <p>- You may be prompted to confirm certain actions</p>
    </div>

    <div className="mb-2">
      <div className="text-yellow-400 font-bold">Example commands:</div>
      <p>- &ldquo;Get all available coffee products&rdquo;</p>
      <p>- &ldquo;Show me the list of clients&rdquo;</p>
      <p>
        - &ldquo;Create a new invoice for client samantha.carter@acmeinc.com,
        she bought a Coffee Machine&rdquo;
      </p>
      <p>- &ldquo;Check all shipments for client ABC Coffee&rdquo;</p>
    </div>

    <p className="text-zinc-400 italic">
      Type your request below and press Enter to begin.
    </p>
  </div>
);

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
    (response: InterruptResponse) => {
      console.log("Submitting interrupt response:", response);
      submit(undefined, { command: { resume: response } });
    },
    [submit]
  );

  const handleSubmitMessage = useCallback(
    (content: string) => {
      if (interrupt?.resumable) {
        handleInterruptSubmit({
          type: "response",
          args: content,
        });
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
    [messages, submit, interrupt, handleInterruptSubmit]
  );

  return (
    <Terminal>
      <div
        ref={messagesContainerRef}
        className="flex flex-col gap-2 grow overflow-y-auto p-4 pr-2"
      >
        {messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          messages.map((message, index) => (
            <Fragment key={message.id}>
              <TerminalMessage message={message} />
              {(message.type === "human" ||
                messages[index + 1]?.type === "human") && (
                <hr className="border-t-zinc-700" />
              )}
            </Fragment>
          ))
        )}
        {interrupt?.resumable && isTerminalInterruptSchema(interrupt.value) && (
          <TerminalInterrupt
            interrupt={
              Array.isArray(interrupt.value)
                ? interrupt.value[0]
                : interrupt.value
            }
            onSelectResponse={handleInterruptSubmit}
          />
        )}
      </div>
      <hr className="border-t-zinc-700" />
      <TerminalInput onSubmit={handleSubmitMessage} />
      <div className="bg-zinc-800 p-1 text-xs font-mono text-neutral-400 flex justify-between border-t border-neutral-700 flex-shrink-0">
        <div>
          <span className="mr-2">ctrl+? help</span>
          <span>Tokens: 0, Cost: $0.00</span>
        </div>
        <div className="text-neutral-500">
          press <span className="text-white font-bold">enter</span> to send the
          message, write <span className="text-white font-bold">\</span> and
          enter to add a new line
        </div>
      </div>
    </Terminal>
  );
}
