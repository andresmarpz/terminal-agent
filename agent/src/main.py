from typing import Annotated

from langgraph.graph import END, START, StateGraph
from langgraph.graph.message import Messages, add_messages
from pydantic import BaseModel


class State(BaseModel):
    """State for the graph."""

    messages: Annotated[Messages, add_messages]


graph = StateGraph(State)


def echo(state: State) -> State:
    return state


graph.add_node("echo", echo)


graph.add_edge(START, "echo")
graph.add_edge("echo", END)
