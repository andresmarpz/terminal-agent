import { Message } from "@langchain/langgraph-sdk";
import { cn } from "~/lib/utils";
import { CogIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TYPE_COLOR_MAP: Record<Message["type"], string> = {
  human: "border-l-[#89B3FA]/85",
  ai: "border-l-[#FAB283]/85",
  tool: "border-l-emerald-500/85",
  function: "border-l-emerald-500/85",
  system: "border-l-zinc-200",
  remove: "border-l-zinc-200",
};

const LABEL_MAP: Record<Message["type"], string> = {
  human: "User",
  ai: "Assistant",
  tool: "Tool",
  function: "Function",
  system: "System",
  remove: "Remove",
};

export default function TerminalMessage({ message }: { message: Message }) {
  console.log(message);

  const formattedContent = (): string[] => {
    const flatContent =
      typeof message.content === "string"
        ? [message.content]
        : message.content.map((item) =>
            item.type === "text" ? item.text : "Unsupported content type"
          );

    switch (message.type) {
      case "ai":
        if (message.tool_calls && message.tool_calls.length > 0) {
          return [`Calling tool ${message.tool_calls[0].name}...`];
        }
        return flatContent;
      case "tool":
        return [`'${message.name}' tool: ${flatContent}`];
    }

    return flatContent;
  };

  const isToolCall =
    message.type === "ai" &&
    message.tool_calls &&
    message.tool_calls.length > 0;

  const renderContent = (content: string) => {
    if (message.type === "ai" && !isToolCall) {
      return (
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Override default components to maintain terminal styling
              p: ({ children }) => <div className="mt-1">{children}</div>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-5 mt-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-5 mt-1">{children}</ol>
              ),
              li: ({ children }) => <li className="mt-0.5">{children}</li>,
              code: ({ children }) => (
                <code className="bg-zinc-700 px-1 py-0.5 rounded text-zinc-200">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-zinc-800 p-2 rounded my-2 overflow-x-auto">
                  {children}
                </pre>
              ),
              h1: ({ children }) => (
                <h1 className="text-xl font-bold mt-2 mb-1">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-bold mt-2 mb-1">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-md font-bold mt-2 mb-1">{children}</h3>
              ),
              strong: ({ children }) => (
                <strong className="font-bold text-white">{children}</strong>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    return (
      <div
        className={cn(
          "text-zinc-200 flex items-center gap-2",
          message.type === "human" && "text-stone-100",
          message.type === "tool" && "text-zinc-400",
          message.type === "ai" && message.tool_calls?.length && "text-zinc-400"
        )}
      >
        {isToolCall && <CogIcon className="w-4 h-4" />}
        {content}
      </div>
    );
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col text-sm font-mono group hover:bg-zinc-800 py-1 pl-3 border-l-2 ml-2 text-white",
          TYPE_COLOR_MAP[message.type]
        )}
      >
        <div className="text-zinc-400">{LABEL_MAP[message.type]}:</div>
        <div>
          {formattedContent().map((line, index) => (
            <div key={`${message.id}-${index}`}>{renderContent(line)}</div>
          ))}
        </div>
      </div>
    </>
  );
}
