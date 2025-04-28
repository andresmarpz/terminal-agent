"use client";

import React, { useState, KeyboardEvent, FormEvent, useRef } from "react";

interface TerminalInputProps {
  onSubmit: (input: string) => void;
}

export function TerminalInput({ onSubmit }: TerminalInputProps) {
  const [input, setInput] = useState("");
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
    <form onSubmit={handleSubmit} className="flex w-full items-center py-2">
      <div className="text-gray-500 text-right px-2 font-mono select-none">
        {">"}
      </div>
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="w-full bg-transparent text-gray-200 font-mono text-sm outline-none resize-none"
        rows={1}
        spellCheck="false"
      />
    </form>
  );
}
