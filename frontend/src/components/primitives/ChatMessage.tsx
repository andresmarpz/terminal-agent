import { Message } from "@langchain/langgraph-sdk";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function ChatMessage({ message }: { message: Message }) {
  if (message.type === "human") {
    return (
      <Card className="max-w-[80%] w-full ml-auto">
        <CardHeader>
          <span className="flex gap-2 items-center">You</span>
        </CardHeader>
        <CardContent>
          {typeof message.content === "string"
            ? message.content
            : message.content.map((c) => (c.type === "text" ? c.text : c.type))}
        </CardContent>
      </Card>
    );
  }

  return (
    <p className="py-8">
      {typeof message.content === "string"
        ? message.content
        : message.content.map((c) => (c.type === "text" ? c.text : c.type))}
    </p>
  );
}
