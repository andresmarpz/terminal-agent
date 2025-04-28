import { Message } from "@langchain/langgraph-sdk";
import { TerminalLine } from "./TerminalLine";

export default function TerminalMessage({ message }: { message: Message }) {
  // Convert the message content to string
  const content =
    typeof message.content === "string"
      ? message.content
      : message.content
          .map((c) => (c.type === "text" ? c.text : c.type))
          .join("\n");

  // For user messages, add a minimal prefix; for AI responses, no prefix
  const formattedContent = message.type === "human" ? `> ${content}` : content;

  // Split the content into lines
  const lines = formattedContent.split("\n");

  return (
    <div className="w-full">
      {lines.map((line, index) => (
        <TerminalLine key={index} content={line} type={message.type} />
      ))}
    </div>
  );
}
