import { Suspense } from "react";
import TerminalChat from "~/components/terminal/TerminalChat";

export default function ChatPage() {
  return (
    <Suspense fallback={<div></div>}>
      <TerminalChat />
    </Suspense>
  );
}
