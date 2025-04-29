from typing import cast

from langchain_core.messages import AIMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import MessagesState
from langgraph.prebuilt import ToolNode

from src.clients.openai_client import openai_client_chat
from src.graphs.agent.prompts import AGENT_SYSTEM_PROMPT
from src.graphs.agent.tools import agent_tools

# Bind tools to the LLM
llm_with_tools = openai_client_chat.bind_tools(agent_tools)


async def agent_node(state: MessagesState):
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


agent_tool_node = ToolNode(agent_tools)
