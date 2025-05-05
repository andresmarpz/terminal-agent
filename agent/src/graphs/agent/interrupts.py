from pydantic import BaseModel


class ToolInterrupt(BaseModel):
    """Interrupt for tool calls."""

    tool_name: str
    user_prompt: str
    allowed_responses: list[str]
