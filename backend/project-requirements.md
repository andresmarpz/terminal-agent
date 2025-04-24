# Backend Project Requirements

This document outlines the functional requirements for the backend service.

## 1. Products

- The system will manage a predefined set of coffee-related products.
- Initial products include:
  - Coffee Bag
  - Coffee Machine
  - Pack of 6 Black Coffee Mugs
- These products will be populated into the database during an initial migration.
- Product data will be static for the initial phase (no CRUD operations for products).

## 2. Clients

- The system will store client information.
- Each client record will include:
  - Name (string)
  - Email (string, unique)
  - Country (string)
  - Address (string)
- Standard CRUD operations (Create, Read, Update, Delete) should be available for clients.

## 3. Invoices

- The system will manage invoices for client orders.
- Each invoice is associated with exactly one client.
- Each invoice contains one or more line items.
- Invoice attributes:
  - Invoice ID (unique identifier)
  - Client ID (foreign key linking to the client)
  - Status (enum: 'pending', 'paid')
  - Total Amount (calculated from line items)
- Each line item includes:
  - Product ID (foreign key linking to a product)
  - Quantity (integer)
  - Unit Price (decimal, fetched from product data at the time of invoice creation)
  - Total Price (decimal, calculated as quantity \* unit price)
- Invoices can be created and read. Updating might be limited (e.g., only status changes). Deletion might be restricted based on status or related shipments.

## 4. Shipments

- The system will track shipments associated with invoices.
- Each shipment is linked to:
  - One Invoice
  - One Client (can be inferred from the invoice)
- Shipment attributes:
  - Shipment ID (unique identifier)
  - Invoice ID (foreign key linking to the invoice)
  - Client ID (foreign key linking to the client)
  - Status (enum: 'pending', 'shipping', 'done')
- Shipments can be created and their status updated. Reading shipment details should be possible. Deletion might be restricted.

## 5. Database Schema (PostgreSQL)

This section defines the proposed database schema using PostgreSQL syntax.

### Enums

```sql
CREATE TYPE invoice_status AS ENUM ('pending', 'paid');
CREATE TYPE shipment_status AS ENUM ('pending', 'shipping', 'done');
```

### Tables

**`products`**

Stores the predefined product information.

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- e.g., 'Coffee Bag', 'Coffee Machine'
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0) -- Price per unit
);
```

_Initial data will be populated via migration._

**`clients`**

Stores client information.

```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    country VARCHAR(100),
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**`invoices`**

Stores invoice header information.

```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    status invoice_status NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_amount >= 0), -- Calculated from invoice_items
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookup by client
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
-- Index for faster lookup by status
CREATE INDEX idx_invoices_status ON invoices(status);
```

_The `total_amount` should ideally be updated via triggers or application logic whenever `invoice_items` change._

**`invoice_items`**

Stores individual line items for each invoice.

```sql
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE, -- If invoice is deleted, items are deleted
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT, -- Prevent deleting products if they are in an invoice
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0), -- Price at the time of purchase
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0) -- quantity * unit_price
);

-- Index for faster lookup by invoice
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
-- Index for faster lookup by product
CREATE INDEX idx_invoice_items_product_id ON invoice_items(product_id);
```

_The `total_price` should be calculated upon insertion. The `unit_price` should be copied from the `products` table at the time of insertion._

**`shipments`**

Stores shipment information linked to invoices.

```sql
CREATE TABLE shipments (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE RESTRICT, -- Each invoice has at most one shipment
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE RESTRICT, -- Redundant? Can be derived from invoice_id, but kept as per requirements.
    status shipment_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookup by invoice
CREATE INDEX idx_shipments_invoice_id ON shipments(invoice_id);
-- Index for faster lookup by client
CREATE INDEX idx_shipments_client_id ON shipments(client_id);
-- Index for faster lookup by status
CREATE INDEX idx_shipments_status ON shipments(status);
```
