"use client";

import { CornerDownLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";

interface ConsoleInputProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

export function ConsoleInput({ onSubmit, isLoading }: ConsoleInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input.trim() && !isLoading) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !isLoading) {
      event.preventDefault();
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        placeholder="Enter command..."
        rows={3}
        className="h-[4lh]"
        value={input}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button
        type="submit"
        className="aspect-square h-[4lh] w-auto"
        disabled={isLoading}
      >
        <div>
          <CornerDownLeftIcon />
        </div>
      </Button>
    </form>
  );
}
