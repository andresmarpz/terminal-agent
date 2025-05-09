import { Button } from "~/components/ui/button";

interface ConsoleWelcomeMessageProps {
  onExampleCommandClick?: (commandText: string) => void;
}

const exampleCommands = [
  "Get all available coffee products",
  "Show me the list of clients",
  "Create a new invoice for client samantha.carter@acmeinc.com, she bought a Coffee Machine",
  "Check all shipments for client ABC Coffee",
];

export function ConsoleWelcomeMessage({
  onExampleCommandClick,
}: ConsoleWelcomeMessageProps) {
  return (
    <div className="text-foreground">
      <span className="text-xs text-primary select-none">SYSTEM:</span>
      <div className="ml-5 mt-1 space-y-2 whitespace-pre-wrap">
        <p>
          Hi! I&apos;m an AI Assistant powering the Coffee Service Terminal. I
          can help you manage your coffee service operations.
        </p>
        <br />
        <p>How it works:</p>
        <ul className="list-disc list-inside ml-2 space-y-0.5">
          <li>Type your request in natural language</li>
          <li>
            I&apos;ll process your request and interact with the Coffee Service
            API
          </li>
          <li>You may be prompted to confirm certain actions</li>
        </ul>
        <br />
        <p>Example commands:</p>
        <div className="space-y-0.5">
          {exampleCommands.map((command, index) => (
            <div key={index} className="flex items-baseline">
              <span className="text-primary mr-1.5 font-semibold select-none">
                &gt;
              </span>
              {onExampleCommandClick ? (
                <Button
                  variant="link"
                  onClick={() => onExampleCommandClick(command)}
                  className="h-auto p-0 text-left text-foreground hover:text-primary hover:underline transition-none"
                >
                  {command}
                </Button>
              ) : (
                <span>{command}</span>
              )}
            </div>
          ))}
        </div>
        <p className="italic">
          Type your request below and press Enter to begin.
        </p>
      </div>
    </div>
  );
}
