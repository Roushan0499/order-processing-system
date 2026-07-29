# Order Processing System

A simple Order Processing System built using **Angular**, **Node.js**, **Express.js**, and **SQLite** to demonstrate the Saga pattern for handling distributed transactions.

## Features

* Upload inventory from CSV
* Upload bulk orders from CSV
* Process orders through multiple services
* Automatic rollback (compensation) on failure
* Retry mechanism for failed operations
* View order details and processing logs
* Mark orders as shipped
* Notification service for shipped orders
* Inventory management

## Tech Stack

### Frontend

* Angular 20
* TypeScript
* HTML
* CSS

### Backend

* Node.js
* Express.js

### Database

* SQLite

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

Open the application at:

```text
http://localhost:4200
```

## How to Use

1. Upload the inventory CSV.
2. Upload the orders CSV.
3. Monitor order processing on the dashboard.
4. Open an order to view its details.
5. Mark placed orders as shipped.

## Author

**Roushan Kumar**
