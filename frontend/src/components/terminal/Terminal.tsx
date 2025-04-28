/**
 * This component simulates a Terminal.
 */
import { ReactNode } from "react";

interface TerminalProps {
  children: ReactNode;
}

export default function Terminal({ children }: TerminalProps) {
  return (
    <div className="bg-zinc-900 w-full h-full flex flex-col font-mono">
      {children}
    </div>
  );
}
