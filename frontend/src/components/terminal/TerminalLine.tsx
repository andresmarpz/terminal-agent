import { Message } from "@langchain/langgraph-sdk";
import { cn } from "~/lib/utils";

interface TerminalLineProps {
  type: Message["type"];
  content: string;
  highlight?: boolean;
}

export function TerminalLine({
  type,
  content,
  highlight = false,
}: TerminalLineProps) {
  const isHuman = type === "human";
  const isAI = type === "ai";

  return (
    <div
      className={cn(
        "flex text-sm font-mono group hover:bg-zinc-800 py-1 pl-2",
        highlight && "bg-zinc-800",
        isHuman && "border-l-2 border-l-[#89B3FA]/85",
        isAI && "border-l-2 border-l-[#FAB283]/85"
      )}
    >
      <div className={cn("text-gray-200", isHuman && "text-gray-400")}>
        {content}
      </div>
    </div>
  );
}
