from typing import Literal

from pydantic import BaseModel


class ToolInterrupt(BaseModel):
    """Interrupt response for tool calls."""

    response: str


class Action(BaseModel):
    """Action to be taken by the agent."""

    type: Literal["tool"]
    name: str
    args: dict


class ToolInterruptConfig(BaseModel):
    """Interrupt for tool calls."""

    action: Action
    description: str
    allowed_responses: list[str]
