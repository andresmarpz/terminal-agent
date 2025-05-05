export interface InterruptValue {
  tool_name: string;
  user_prompt: string;
  allowed_responses: string[];
}

export interface SubmitMetadata {
  command: {
    resume: string;
  };
}

export default function TerminalInterrupt({
  prompt,
  allowedResponses,
  onSelectResponse,
}: {
  prompt: string;
  allowedResponses: string[];
  onSelectResponse: (response: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 font-mono text-sm">
      <div className="text-yellow-400">$ {prompt}</div>
      <div className="flex flex-col">
        {allowedResponses.map((response, index) => (
          <div
            key={index}
            onClick={() => onSelectResponse(response)}
            className="cursor-pointer hover:bg-gray-800 px-2 py-0.5"
          >
            <span className="text-green-400">[{index + 1}]</span>{" "}
            <span className="text-white">{response}</span>
          </div>
        ))}
      </div>
      <div className="text-gray-500 text-xs mt-2">
        Click an option to continue...
      </div>
    </div>
  );
}
