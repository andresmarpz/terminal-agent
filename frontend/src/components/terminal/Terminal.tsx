/**
 * This component simulates a Terminal.
 */
import { ReactNode } from "react";

interface TerminalProps {
  children: ReactNode;
}

export default function Terminal({ children }: TerminalProps) {
  return (
    <div className="bg-neutral-900 flex flex-col font-mono m-8 rounded-lg border-2 border-neutral-700 shadow-xl grow">
      {children}
    </div>
  );
}
