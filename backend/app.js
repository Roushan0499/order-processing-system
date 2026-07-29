require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Initialize Database
require("./database");

// Routes
const orderRoutes = require("./routes/orderRoutes");

// Background Services
const notificationService = require("./services/notificationService");

const app = express();

// =====================================
// Middleware
// =====================================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =====================================
// Home Route
// =====================================
app.get("/", (req, res) => {

    res.send("Order Processing System API Running");

});

// =====================================
// API Routes
// =====================================
app.use("/api/orders", orderRoutes);

// =====================================
// 404 Handler
// =====================================
app.use((req, res) => {

    res.status(404).json({

        success: false,
        message: "Route Not Found"

    });

});

// =====================================
// Global Error Handler
// =====================================
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({

        success: false,
        message: err.message || "Internal Server Error"

    });

});

// =====================================
// Start Background Jobs
// =====================================
// notificationService.startNotificationJob();

// =====================================
// Start Server
// =====================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("--------------------------------");

    console.log(`Server Running : http://localhost:${PORT}`);

    console.log("--------------------------------");

});