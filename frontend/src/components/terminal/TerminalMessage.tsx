import { Message } from "@langchain/langgraph-sdk";
import { cn } from "~/lib/utils";
import { CogIcon } from "lucide-react";

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
            <div
              key={`${message.id}-${index}`}
              className={cn(
                "text-zinc-200 flex items-center gap-2",
                message.type === "human" && "text-stone-100",
                message.type === "tool" && "text-zinc-400",
                message.type === "ai" &&
                  message.tool_calls?.length &&
                  "text-zinc-400"
              )}
            >
              {isToolCall && <CogIcon className="w-4 h-4" />}
              {line}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
