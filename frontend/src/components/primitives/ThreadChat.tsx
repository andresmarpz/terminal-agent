"use client";

import { useStream } from "@langchain/langgraph-sdk/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatMessage from "~/components/primitives/ChatMessage";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/lib/constants";

export default function ThreadChat({
  initialThreadId,
}: {
  initialThreadId?: string;
}) {
  const param = useParams();
  const threadIdParam = param.id as string;
  const [threadId, setThreadId] = useState(initialThreadId ?? threadIdParam);

  const pathname = usePathname();
  const router = useRouter();
  const { submit, messages, isLoading, history } = useStream({
    apiUrl: env.AGENT_BASE_URL,
    assistantId: env.AGENT_ASSISTANT_ID!,
    threadId,
  });

  useEffect(() => {
    if (history && history.length && !threadId) {
      const threadFromHistory = history[0].checkpoint.thread_id;
      setThreadId(threadFromHistory);

      if (pathname === "/thread/new") {
        router.push(`/thread/${threadFromHistory}`);
      }
    }
  }, [history, pathname, router, threadId]);

  return (
    <Card className="flex flex-col gap-4 m-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Thread: {initialThreadId ?? "New"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id ?? "temporary-message-id"}
            message={message}
          />
        ))}
      </CardContent>

      <CardFooter className="w-full flex flex-col gap-2">
        <form
          className="w-full flex flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            submit({
              messages: [
                {
                  type: "human",
                  content: (event.target as HTMLFormElement).message.value,
                },
              ],
            });
          }}
        >
          <Textarea
            className="resize-none"
            name="message"
            placeholder="Type your message here..."
          />
          <Button type="submit" disabled={isLoading} className="self-end">
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
