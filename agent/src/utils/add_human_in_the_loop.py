from typing import Callable

from langchain_core.runnables import RunnableConfig
from langchain_core.tools import BaseTool
from langchain_core.tools import tool as create_tool
from langgraph.prebuilt.interrupt import HumanInterrupt
from langgraph.prebuilt.interrupt import (
    HumanInterruptConfig as HumanInterruptConfigBase,
)
from langgraph.types import interrupt


class HumanInterruptConfig(HumanInterruptConfigBase):
    """Human interrupt config with allow_deny."""

    allow_deny: bool


def add_human_in_the_loop(
    tool: Callable | BaseTool,
    *,
    interrupt_config: HumanInterruptConfig,
) -> BaseTool:
    """Wrap a tool to support human-in-the-loop review."""
    if not isinstance(tool, BaseTool):
        tool = create_tool(tool)

    @create_tool(tool.name, description=tool.description, args_schema=tool.args_schema)
    async def call_tool_with_interrupt(config: RunnableConfig, **tool_input):
        request: HumanInterrupt = {
            "action_request": {"action": tool.name, "args": tool_input},
            "config": interrupt_config,
            "description": "Please review the tool call",
        }
        response = interrupt([request])

        # approve the tool call
        if response["type"] == "accept":
            tool_response = await tool.ainvoke(tool_input, config)
        # update tool call args
        elif response["type"] == "edit":
            tool_input = response["args"]["args"]
            tool_response = await tool.ainvoke(tool_input, config)
        elif response["type"] == "response":
            user_feedback = response["args"]
            tool_response = user_feedback
        elif response["type"] == "deny":
            tool_response = "Tool call denied by the user."
        else:
            raise ValueError(f"Unsupported interrupt response type: {response['type']}")

        return tool_response

    return call_tool_with_interrupt
