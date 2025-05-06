import { HumanInterrupt as HumanInterruptBase } from "@langchain/langgraph/prebuilt";
import { useState } from "react";

export type HumanInterrupt = HumanInterruptBase & {
  config: {
    allow_respond: boolean;
    allow_accept: boolean;
    allow_edit: boolean;
    allow_ignore: boolean;
    allow_deny: boolean;
  };
};

export type InterruptResponse = {
  type: "accept" | "edit" | "response" | "deny" | "ignore";
  args?: Record<string, unknown> | string;
};

export function isTerminalInterruptSchema(
  value: unknown
): value is HumanInterrupt | HumanInterrupt[] {
  const valueAsObject = Array.isArray(value) ? value[0] : value;
  return (
    valueAsObject &&
    typeof valueAsObject === "object" &&
    "action_request" in valueAsObject &&
    typeof valueAsObject.action_request === "object" &&
    "config" in valueAsObject &&
    typeof valueAsObject.config === "object" &&
    "allow_respond" in valueAsObject.config &&
    "allow_accept" in valueAsObject.config &&
    "allow_edit" in valueAsObject.config &&
    "allow_ignore" in valueAsObject.config &&
    "allow_deny" in valueAsObject.config
  );
}

export interface SubmitMetadata {
  command: {
    resume: string;
  };
}

// Recursive type for the EditableValue hierarchy
type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

type EditableValue = {
  path: string;
  key: string;
  value: JsonValue;
  type: string;
  parentType?: string;
  parentPath?: string;
  arrayIndex?: number;
  originalKey?: string;
};

export default function TerminalInterrupt({
  interrupt,
  onSelectResponse,
}: {
  interrupt: HumanInterrupt;
  onSelectResponse: (response: InterruptResponse) => void;
}) {
  const [showEditInput, setShowEditInput] = useState(false);
  const [showResponseInput, setShowResponseInput] = useState(false);
  const [editableValues, setEditableValues] = useState<EditableValue[]>([]);
  const [userResponse, setUserResponse] = useState("");

  // Extract prompt from the interrupt
  const prompt =
    interrupt.description ||
    interrupt.action_request.action ||
    "Confirm action";

  // Format the arguments for display
  const formatArgs = () => {
    if (interrupt.action_request.args) {
      if (typeof interrupt.action_request.args === "string") {
        return interrupt.action_request.args;
      } else {
        return JSON.stringify(interrupt.action_request.args, null, 2);
      }
    }
    return "No arguments provided";
  };

  // Get options, fallback to config-based default options if needed
  let allowedResponses: string[] = [];

  // Try to get options from args.options first
  if (
    interrupt.action_request.args &&
    typeof interrupt.action_request.args === "object" &&
    "options" in interrupt.action_request.args &&
    Array.isArray(interrupt.action_request.args.options)
  ) {
    allowedResponses = interrupt.action_request.args.options;
  }
  // Fallback to config-based options
  else if (allowedResponses.length === 0) {
    if (interrupt.config.allow_accept) allowedResponses.push("Accept");
    if (interrupt.config.allow_edit) allowedResponses.push("Edit");
    if (interrupt.config.allow_respond) allowedResponses.push("Respond");
    if (interrupt.config.allow_ignore) allowedResponses.push("Ignore");
    if (interrupt.config.allow_deny) allowedResponses.push("Deny");
  }

  // Ensure we always have at least one option
  if (allowedResponses.length === 0) {
    allowedResponses = ["Continue"];
  }

  const handleResponseSelection = (response: string) => {
    if (response.toLowerCase() === "edit") {
      setShowEditInput(true);
      setShowResponseInput(false);
      setEditableValues(parseArgsForEditing());
    } else if (response.toLowerCase() === "respond") {
      setShowResponseInput(true);
      setShowEditInput(false);
    } else {
      const formattedResponse: InterruptResponse = {
        type: response.toLowerCase() as InterruptResponse["type"],
      };
      onSelectResponse(formattedResponse);
    }
  };

  const handleArgValueChange = (path: string, newValue: string) => {
    setEditableValues((prevValues) => {
      return prevValues.map((item) => {
        if (item.path === path) {
          try {
            // Try to parse the value based on its type
            let parsedValue: JsonValue = newValue;
            if (item.type === "number") {
              parsedValue = Number(newValue);
            } else if (item.type === "boolean") {
              parsedValue = newValue === "true";
            }
            return { ...item, value: parsedValue };
          } catch {
            // If parsing fails, just store as string
            return { ...item, value: newValue };
          }
        }
        return item;
      });
    });
  };

  const handleEditSubmit = () => {
    try {
      // Reconstruct the arguments object
      const args = interrupt.action_request.args;
      if (!args || typeof args === "string") {
        return;
      }

      // Create a deep copy of the original args
      const updatedArgs = JSON.parse(JSON.stringify(args));

      // Apply each edited value to the copied structure
      editableValues.forEach((item) => {
        const pathParts = item.path.split(".");
        let current = updatedArgs;

        // Navigate to the parent object
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (part.includes("[") && part.includes("]")) {
            // Handle array syntax like "items[0]"
            const keyName = part.substring(0, part.indexOf("["));
            const index = parseInt(
              part.substring(part.indexOf("[") + 1, part.indexOf("]"))
            );
            current = current[keyName][index];
          } else {
            current = current[part];
          }
        }

        // Set the value
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart.includes("[") && lastPart.includes("]")) {
          // Handle array syntax like "items[0]"
          const keyName = lastPart.substring(0, lastPart.indexOf("["));
          const index = parseInt(
            lastPart.substring(lastPart.indexOf("[") + 1, lastPart.indexOf("]"))
          );
          current[keyName][index] = item.value;
        } else {
          current[lastPart] = item.value;
        }
      });

      onSelectResponse({
        type: "edit",
        args: { args: updatedArgs },
      });
    } catch (error) {
      console.error("Error processing edited arguments:", error);
    }
  };

  const handleResponseSubmit = () => {
    onSelectResponse({
      type: "response",
      args: userResponse,
    });
  };

  // Organize editable values by their parent path for grouped display
  const groupEditableValuesByPath = () => {
    const groups: { [key: string]: EditableValue[] } = {};

    editableValues.forEach((item) => {
      const groupKey = item.parentPath || "root";
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
    });

    return groups;
  };

  // Render appropriate input field based on value type
  const renderInputField = (item: EditableValue) => {
    if (item.type === "boolean") {
      return (
        <select
          value={String(item.value)}
          onChange={(e) => handleArgValueChange(item.path, e.target.value)}
          className="bg-neutral-800 text-white p-1 rounded w-auto min-w-[80px]"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      );
    } else if (item.type === "number") {
      return (
        <input
          type="number"
          value={String(item.value)}
          onChange={(e) => handleArgValueChange(item.path, e.target.value)}
          className="bg-neutral-800 text-white p-1 rounded w-auto min-w-[80px]"
        />
      );
    } else {
      return (
        <input
          type="text"
          value={String(item.value)}
          onChange={(e) => handleArgValueChange(item.path, e.target.value)}
          className="bg-neutral-800 text-white p-1 rounded w-auto min-w-[120px]"
        />
      );
    }
  };

  // Render the edit interface with JSON-like structure
  const renderEditableJSON = () => {
    const valueGroups = groupEditableValuesByPath();
    const rootItems = editableValues.filter((item) => !item.parentPath);

    // Helper to determine indentation level based on path
    const getIndentLevel = (path: string) => {
      return path.split(".").length - 1;
    };

    // Check if we have any top-level fields to edit
    if (rootItems.length > 0) {
      return (
        <div className="space-y-3">
          {rootItems.map((item) => (
            <div key={item.path} className="flex items-center space-x-2">
              <span className="text-blue-400">{item.key}:</span>
              {renderInputField(item)}
            </div>
          ))}
          {Object.entries(valueGroups).map(([path, items]) => {
            if (path === "root") return null;

            // Skip rendering parent objects/arrays as separate sections
            if (items.length === 0) return null;

            const indentLevel = getIndentLevel(path);
            const indentStyle = { marginLeft: `${indentLevel * 1.5}rem` };

            // Extract parent label (remove array indices for display)
            const displayPath = path
              .replace(/\[\d+\]/g, "[]")
              .split(".")
              .pop();

            return (
              <div key={path} className="mt-3">
                <div
                  className="text-yellow-400 font-semibold mb-1"
                  style={indentStyle}
                >
                  {displayPath}:
                </div>
                <div
                  className="space-y-2"
                  style={{ marginLeft: `${(indentLevel + 1) * 1.5}rem` }}
                >
                  {items.map((item) => (
                    <div
                      key={item.path}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-blue-400">
                        {item.arrayIndex !== undefined
                          ? item.originalKey &&
                            item.originalKey !== String(item.arrayIndex)
                            ? item.originalKey
                            : `[${item.arrayIndex}]`
                          : item.key}
                        :
                      </span>
                      {renderInputField(item)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="text-neutral-400">No editable arguments available</div>
      );
    }
  };

  // Parse arguments into a structured format for editing (recursive)
  const parseArgsForEditing = () => {
    const args = interrupt.action_request.args;
    if (!args || typeof args === "string") {
      return [];
    }

    const result: EditableValue[] = [];

    // Recursively process values
    const processValue = (
      value: JsonValue,
      key: string,
      path: string = "",
      parentType?: string,
      parentPath?: string,
      arrayIndex?: number,
      originalKey?: string
    ) => {
      const newPath = path ? `${path}.${key}` : key;
      const valueType = Array.isArray(value) ? "array" : typeof value;

      if (valueType === "object" && value !== null) {
        // It's an object, recursively process its properties
        Object.entries(value as Record<string, JsonValue>).forEach(
          ([childKey, childValue]) => {
            processValue(
              childValue,
              childKey,
              newPath,
              valueType,
              newPath,
              undefined,
              childKey
            );
          }
        );
      } else if (valueType === "array") {
        // It's an array, recursively process each element
        (value as JsonValue[]).forEach((item: JsonValue, index: number) => {
          const itemType = Array.isArray(item) ? "array" : typeof item;

          if (itemType === "object" && item !== null) {
            // If array contains objects, process their properties
            Object.entries(item as Record<string, JsonValue>).forEach(
              ([childKey, childValue]) => {
                processValue(
                  childValue,
                  childKey,
                  `${newPath}[${index}]`,
                  itemType,
                  `${newPath}[${index}]`,
                  index,
                  childKey
                );
              }
            );
          } else {
            // Array contains primitives
            result.push({
              path: `${newPath}[${index}]`,
              key: `${index}`,
              value: item,
              type: typeof item,
              parentType: valueType,
              parentPath: newPath,
              arrayIndex: index,
              originalKey: String(index),
            });
          }
        });
      } else {
        // It's a primitive value
        result.push({
          path: newPath,
          key,
          value,
          type: valueType,
          parentType,
          parentPath,
          arrayIndex,
          originalKey: originalKey || key,
        });
      }
    };

    // Start the recursive processing
    Object.entries(args as Record<string, JsonValue>).forEach(
      ([key, value]) => {
        processValue(value, key, "", undefined, undefined, undefined, key);
      }
    );

    return result;
  };

  return (
    <div className="flex flex-col gap-2 font-mono text-sm">
      <div className="text-yellow-400">$ {prompt}</div>

      {/* Display the command arguments */}
      <div className="bg-neutral-900 p-2 rounded border border-neutral-700 text-xs">
        <div className="text-blue-400 mb-1">Command arguments:</div>
        <pre className="text-white whitespace-pre-wrap overflow-auto max-h-40">
          {formatArgs()}
        </pre>
      </div>

      {!showEditInput && !showResponseInput && (
        <div className="flex flex-col">
          {allowedResponses.map((response: string, index: number) => (
            <div
              key={index}
              onClick={() => handleResponseSelection(response)}
              className="cursor-pointer hover:bg-neutral-800 px-2 py-0.5"
            >
              <span className="text-green-400">[{index + 1}]</span>{" "}
              <span className="text-white">{response}</span>
            </div>
          ))}
        </div>
      )}

      {showEditInput && (
        <div className="flex flex-col gap-2">
          <div className="text-white mb-2">Edit arguments:</div>
          <div className="bg-neutral-900 p-3 rounded border border-neutral-700 text-xs">
            {renderEditableJSON()}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              onClick={handleEditSubmit}
            >
              Submit
            </button>
            <button
              className="bg-neutral-600 hover:bg-neutral-700 text-white px-3 py-1 rounded"
              onClick={() => setShowEditInput(false)}
            >
              Cancel
            </button>
          </div>
          <div className="text-neutral-500 text-xs mt-1">
            Note: To add items to arrays, please use the Respond option instead.
          </div>
        </div>
      )}

      {showResponseInput && (
        <div className="flex flex-col gap-2">
          <div className="text-white">Enter your response:</div>
          <textarea
            className="bg-neutral-800 text-white p-2 rounded"
            rows={5}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
              onClick={handleResponseSubmit}
            >
              Submit
            </button>
            <button
              className="bg-neutral-600 hover:bg-neutral-700 text-white px-3 py-1 rounded"
              onClick={() => setShowResponseInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!showEditInput && !showResponseInput && (
        <div className="text-neutral-500 text-xs mt-2">
          Click an option to continue...
        </div>
      )}
    </div>
  );
}
