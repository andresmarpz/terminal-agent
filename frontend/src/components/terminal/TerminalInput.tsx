"use client";

import React, { useState, KeyboardEvent, FormEvent, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Textarea } from "~/components/ui/textarea";

interface TerminalInputProps {
  onSubmit: (input: string) => void;
}

export function TerminalInput({ onSubmit }: TerminalInputProps) {
  const [input, setInput] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full p-2">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          const currentValue = e.target.value;

          setInput(currentValue);

          if (currentValue === "/") {
            setMenuOpen(true);
          } else {
            setMenuOpen(false);
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full bg-transparent text-gray-200 font-mono text-sm outline-none resize-none border-0"
        rows={1}
        spellCheck="false"
      />

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuContent>
          <DropdownMenuItem>Lets test!</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
}
