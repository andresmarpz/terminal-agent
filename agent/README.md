# Coffee Service Agent

This is an agent built with LangGraph that can check if the Coffee Service is running by making HTTP requests to its health endpoint.

## Features

- Health check endpoint for the Coffee Service
- LLM-powered agent to answer questions about the coffee service status
- FastAPI interface for interacting with the agent

## Installation

1. Make sure you have Python 3.13+ installed
2. Install the dependencies:

```bash
pip install -e .
```

## Running the Agent

Start the agent API server:

```bash
poe dev-api
```

This will start the agent API server on port 4001.

## Testing the Agent

Run the test script to check if the agent is working properly:

```bash
python src/test_agent.py
```

## API Endpoints

- `GET /health`: Health check endpoint for the agent service
- `POST /chat`: Chat with the agent
  - Request body: `{"message": "Is the coffee service running?"}`
  - Response: `{"response": "Agent's response"}`

## Development

- Use the LangGraph CLI for development:

```bash
poe dev
```
