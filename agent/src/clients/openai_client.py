import os

from langchain_openai import ChatOpenAI

openai_client_chat = ChatOpenAI(
    model="gpt-4o-mini",
    api_key=os.getenv("OPENAI_API_KEY"),
    streaming=True,
)
