from langgraph.graph import END, START, MessagesState, StateGraph

from src.graphs.agent.nodes import agent_node, agent_tool_node

graph_builder = StateGraph(MessagesState)


def should_continue(state: MessagesState):
    """Determine if the agent should continue or not."""
    messages = state["messages"]
    last_message = messages[-1]
    if last_message.tool_calls:
        return "tools"
    return END


builder = StateGraph(MessagesState)

builder.add_node("agent", agent_node)
builder.add_node("tools", agent_tool_node)

builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", should_continue, ["tools", END])
builder.add_edge("tools", "agent")

agent_graph = builder.compile()
