# Roadmap: Agentic Coffee Delivery Demo

## 1. Introduction

This document outlines potential directions and feature ideas for the Agentic Coffee Delivery Demo project. The goal is to evolve this demo into a comprehensive playground for learning and experimenting with AI agent architectures, frontend integration, and interaction with backend services, incorporating modern agentic AI patterns.

## 2. Core AI Capabilities to Explore

We aim to implement features that require or demonstrate the following capabilities:

- **Human in the Loop (HITL):** Ensuring agent actions can be reviewed, confirmed, or guided by the user.
- **Enhanced Tool Calling:** Expanding the agent's ability to interact with the backend and potentially external services.
- **Advanced Data Retrieval:** Moving beyond simple API calls to more complex querying and potentially Retrieval-Augmented Generation (RAG).
- **Memory Systems:** Enabling the agent to remember user preferences, past interactions, and context.
- **Feedback Loops:** Implementing mechanisms for users to provide feedback on agent performance or service quality.
- **Reinforcement Learning (RL):** Using feedback or simulation to optimize agent behavior over time.

## 3. Feature Ideas

Here are brainstormed features, grouped by the primary AI capability they exercise, all within the coffee delivery theme:

### 3.1 Human in the Loop (HITL) Features

- **Order Confirmation:** Agent seeks user confirmation before placing large orders (e.g., >\$100 value or >10 items) or orders for newly created clients.
- **Ambiguity Resolution:** If a user request is vague (e.g., "Send coffee to Bob"), the agent asks clarifying questions ("Which Bob? We have Bob Smith and Bob Jones in your clients list. Which coffee blend?") before proceeding.
- **SLA Issue Resolution Prompt:** When `get_sla_status` reveals an issue, the agent presents potential resolutions (e.g., "Offer a 10% discount on the next order?", "Expedite the next shipment?", "Initiate a support ticket?") and asks the user to choose.
- **Tool Use Confirmation:** For sensitive actions like `create_new_client` or potentially `cancel_shipment`, the agent explicitly asks "Are you sure you want me to create a new client named 'X'?"

### 3.2 Enhanced Tool Calling & Backend Interaction

- **More Granular Backend Tools:**
  - `update_client_details(client_id: int, updates: dict)`: Modify existing client information.
  - `get_client_order_history(client_id: int, limit: int = 5)`: Retrieve recent orders for a specific client.
  - `get_shipment_details(shipment_id: int)`: Get tracking status, contents, etc., for one shipment.
  - `cancel_shipment(shipment_id: int)`: Cancel a pending shipment (requires HITL confirmation).
  - `check_inventory(product_id: int)`: Check stock levels for a specific coffee product.
- **Conditional Tool Use / Simple Planning:**
  - **Out-of-Stock Handling:** If `create_new_shipment` fails due to inventory (requires backend to support this), the agent automatically calls `check_inventory`, informs the user, and could potentially call a new tool like `suggest_alternative_product(original_product_id: int)`.
- **External API Simulation:**
  - `get_delivery_estimate(shipment_id: int)`: A tool that simulates calling an external shipping provider's API for an estimated delivery date.

### 3.3 Advanced Data Retrieval & RAG

- **Complex Queries:** Enable the agent to answer questions requiring data synthesis from multiple API calls.
  - "Show me recent shipments for clients in California." (Requires `search_clients` by location + `get_client_order_history` for each).
  - "What were the top 3 best-selling coffee blends last month?" (Requires analyzing shipment data).
- **Fuzzy Search Tools:**
  - `search_clients(name_query: str)`: Find clients based on partial name match.
  - `search_products(description_query: str)`: Find products based on keywords in their description (e.g., "dark roast", "fruity notes").
- **Coffee Knowledge RAG:**
  - Create a vector database populated with information about coffee origins, tasting notes, brew methods, etc.
  - Add a `query_coffee_knowledge(question: str)` tool that uses RAG to answer user questions like "What's the difference between Arabica and Robusta?", "Suggest a good coffee for cold brew.", or "Tell me more about the tasting notes of the Ethiopian Yirgacheffe blend we offer."

### 3.4 Memory & Personalization

- **Short-Term Conversation Memory:** Remember context within the current session (LangGraph's built-in state helps here).
- **Long-Term User Preferences:**
  - Store and recall the user's favorite coffee: "Order my usual."
  - Store and recall preferences per client (via `update_client_details` or a dedicated preference store): "Jane Doe prefers deliveries before noon.", "ACME Corp requires invoices sent to billing@acme.com."
- **Interaction Recall:** "You ordered the Sumatra blend last time, would you like that again?" (Requires storing/querying past user actions).

### 3.5 Feedback Mechanisms

- **Response Quality:** Add thumbs up/down buttons to agent messages in the frontend. Store this feedback associated with the conversation turn.
- **Order Rating:** After a shipment is (simulated as) delivered, prompt the user: "How was your recent delivery experience (1-5 stars)?" Store this rating.
- **SLA Resolution Effectiveness:** After proposing and executing an SLA issue resolution, ask: "Did the proposed solution resolve the SLA issue to your satisfaction? (Yes/No)".

### 3.6 Reinforcement Learning (RL) Applications

- **RLHF for Responses/Suggestions:** Use the thumbs up/down feedback to fine-tune the agent's response generation or product suggestion logic. (This is advanced, might start with just collecting feedback).
- **Proactive Ordering:** Learn client ordering patterns (e.g., Client X orders Blend Y every 2 weeks). Agent could prompt the user: "It's been nearly two weeks since Client X's last order of Blend Y. Shall I create a new shipment?" (Requires HITL).
- **Optimized Tool Selection:** Use feedback/success rates to teach the agent the most efficient sequence of tools to fulfill complex requests.

## 4. Next Steps

1.  **Prioritize:** Review these ideas and select a small set (1-3) to implement first, focusing on core agent capabilities. Perhaps start with more tools, basic HITL (confirmation), and simple memory (remembering a favorite).
2.  **Design:** Detail the implementation for the chosen features (API changes, agent logic, frontend UI).
3.  **Implement:** Build the features incrementally.
