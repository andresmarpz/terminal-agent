import os
from typing import cast

import httpx
from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import END, START, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode

from src.prompts import AGENT_SYSTEM_PROMPT

chat = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=os.getenv("OPENAI_API_KEY"),
    streaming=True,
)


@tool()
async def check_coffee_service() -> bool:
    """Check if the Coffee Service is running by making a request to its health endpoint."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("http://localhost:4000/health", timeout=5.0)
            return response.status_code == 200
    except Exception:
        return False


tools = [check_coffee_service]
# Instantiate ToolNode with the defined tools
tool_node = ToolNode(tools)

# Bind tools to the LLM
llm_with_tools = chat.bind_tools(tools)


async def agent(state: MessagesState):
    """Invoke the LLM to potentially call tools or respond directly."""
    # Ensure we are passing the full message history
    messages_to_pass = state["messages"]

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=AGENT_SYSTEM_PROMPT),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )
    with_messages = prompt.format_prompt(messages=messages_to_pass)

    response = cast(
        AIMessage,
        await llm_with_tools.ainvoke(input=with_messages),  # Pass the list of messages
    )
    return {"messages": [response]}


def should_continue(state: MessagesState):
    """Determine if the agent should continue or not."""
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END


builder = StateGraph(MessagesState)

builder.add_node("agent", agent)
builder.add_node("tools", tool_node)

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", should_continue, ["tools", END])
builder.add_edge("tools", "agent")

graph = builder.compile()
