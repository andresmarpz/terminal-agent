# Coffee Backend Service

## Overview

This backend service simulates the operational system of a coffee pack delivery business. Its primary role is to provide a realistic environment (data and API endpoints) for the LangGraph agent to interact with, demonstrating how an agent can control and query a standard backend system.

## Functionality

- **Data Simulation:** Manages data related to coffee products, clients, invoices, shipments, and Service Level Agreement (SLA) issues.
- **API Provider:** Exposes RESTful API endpoints for the agent to perform actions and retrieve information.
- **Database Backend:** Uses a database (e.g., SQLite, PostgreSQL) to store and manage the operational data.
- **Artificial SLA:** Includes a simulated SLA system to represent potential operational issues like delays or quality problems.

## Technology Stack

- **Language:** Python
- **Framework:** FastAPI
- **Database:** PostgreSQL

## Database Structure

The database includes the following main tables:

- `products`: Stores information about available coffee products. Prefilled with at least three initial products.
- `clients`: Stores information about customers.
- `invoices`: Records of invoices generated (potentially linked to shipments).
- `shipments`: Records of coffee packs shipped to clients.
- `sla_issues`: Stores simulated SLA problems (e.g., late deliveries, damaged goods).

## Initial API Endpoints

The service provides the following initial API endpoints for the LangGraph agent:

- **`POST /clients`**: Creates a new client.
  - _Request Body:_ `{ "name": "...", "details": {...} }`
  - _Response:_ Client details or ID.
- **`GET /products`**: Retrieves the list of all available coffee products.
  - _Response:_ List of product objects.
- **`POST /shipments`**: Creates a new shipment record.
  - _Request Body:_ `{ "client_id": ..., "product_id": ..., "quantity": ... }`
  - _Response:_ Shipment details or ID.
- **`GET /sla`**: Retrieves SLA issue information.
  - _Query Parameter:_ `days` (integer, e.g., `/sla?days=7`)
  - _Response:_ List of SLA issues within the specified period.
- **`GET /shipments/count`**: Queries the number of shipments within a date range.
  - _Query Parameters:_ `start_date`, `end_date` (e.g., `YYYY-MM-DD`)
  - _Response:_ Count of shipments.

_(Note: Exact endpoint paths and request/response formats might be refined during implementation.)_

## Setup and Running

(Instructions on how to set up the database, install dependencies, and run the backend service will be added here once implemented.)
