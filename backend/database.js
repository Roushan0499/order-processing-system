const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./order-processing.db", (err) => {
    if (err) {
        console.error("Database Error:", err.message);
    } else {
        console.log("SQLite Connected");
    }
});

db.serialize(() => {

    // ==========================
    // Orders
    // ==========================
    db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT UNIQUE,
            sku TEXT NOT NULL,
            qty INTEGER NOT NULL,
            amount REAL NOT NULL,

            status TEXT DEFAULT 'IN_PROGRESS',

            fail_at TEXT,
            comp_fail_at TEXT,

            notification_sent INTEGER DEFAULT 0,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // ==========================
    // Inventory
    // ==========================
    db.run(`
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sku TEXT UNIQUE,
            available_qty INTEGER NOT NULL
        )
    `);

    // ==========================
    // Order Steps
    // ==========================
    db.run(`
        CREATE TABLE IF NOT EXISTS order_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            order_id TEXT NOT NULL,

            step TEXT NOT NULL,

            status TEXT NOT NULL,

            retry_count INTEGER DEFAULT 0,

            completed INTEGER DEFAULT 0,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            UNIQUE(order_id, step)
        )
    `);

    // ==========================
    // Logs
    // ==========================
    db.run(`
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,

            order_id TEXT,

            message TEXT,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;