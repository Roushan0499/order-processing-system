# Order Processing System

A simple Order Processing System built using **Angular**, **Node.js**, **Express.js**, and **MySQL** to demonstrate the Saga pattern for handling distributed transactions.

## Features

* Upload Inventory from CSV
* Upload Orders from CSV
* Process bulk orders
* Inventory reservation
* Payment processing
* Shipment creation
* Automatic rollback (Compensation)
* Retry mechanism
* Order tracking
* Order processing logs
* Notification service for shipped orders

## Tech Stack

### Frontend

* Angular 20
* TypeScript
* Angular Material
* HTML
* CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL 8

### Packages

* mysql2
* multer
* csv-parser
* cors
* dotenv

## Database Setup

Create the database in MySQL:

```sql
CREATE DATABASE order_processing_system;
```

Update your `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3301
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=order_processing_system
```

> Replace `DB_PORT` and `DB_PASSWORD` with your local MySQL configuration.

## Installation

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

## Application URLs

Frontend

```text
http://localhost:4200
```

Backend

```text
http://localhost:5000
```

## How to Test

1. Start the MySQL server.
2. Run the backend.
3. Run the Angular application.
4. Upload the Inventory CSV.
5. Upload the Orders CSV.
6. Monitor the order processing workflow.
7. Mark an order as shipped to trigger the notification service.


## Future Improvements

* User authentication
* Dashboard analytics
* Email notifications
* Docker support
* Unit and integration tests
* Pagination and filtering
* Swagger API documentation

## Author

**Roushan Kumar**

Full Stack Developer
