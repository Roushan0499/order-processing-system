const fs = require("fs");
const csv = require("csv-parser");

const db = require("../database");
const coordinator = require("../services/coordinator");

// =====================================
// Get All Orders
// =====================================

exports.getOrders = (req, res) => {

    db.all(
        "SELECT * FROM orders ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(rows);

        }
    );

};

// =====================================
// Get Single Order
// =====================================

exports.getOrder = (req, res) => {

    db.get(
        "SELECT * FROM orders WHERE order_id=?",
        [req.params.id],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: "Order Not Found"
                });
            }

            res.json(row);

        }
    );

};

// =====================================
// Upload Inventory CSV
// =====================================

exports.uploadInventory = (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No inventory file uploaded"
        });

    }

    const inventory = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {

            inventory.push(row);

        })
        .on("end", () => {

            inventory.forEach(item => {

                db.run(
                    `
                    INSERT OR REPLACE INTO inventory
                    (
                        sku,
                        available_qty
                    )
                    VALUES
                    (
                        ?,?
                    )
                    `,
                    [
                        item.sku,
                        Number(item.available_qty)
                    ]
                );

            });

            res.json({
                success: true,
                message: "Inventory Imported Successfully",
                total: inventory.length
            });

        });

};

// =====================================
// Upload Orders CSV
// =====================================

exports.uploadOrders = async (req, res) => {

    if (!req.file) {

        return res.status(400).json({
            success: false,
            message: "No orders file uploaded"
        });

    }

    const orders = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {

            orders.push(row);

        })
        .on("end", async () => {

            try {

                for (const order of orders) {

                    await saveOrder(order);

                }

                res.json({

                    success: true,
                    message: "Orders Imported Successfully",
                    total: orders.length

                });

            }

            catch (err) {

                res.status(500).json({

                    success: false,
                    message: err.message

                });

            }

        });

};

// =====================================
// Retry
// =====================================

exports.retryOrder = (req, res) => {

    res.json({

        success: true,
        message: "Retry API - Coming Soon"

    });

};

// =====================================
// Mark Shipped
// =====================================

exports.markShipped = (req, res) => {

    db.run(
        `
        UPDATE orders
        SET status='SHIPPED'
        WHERE order_id=?
        `,
        [req.params.id],
        function (err) {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json({

                success: true,
                message: "Order Marked Shipped"

            });

        }
    );

};

// =====================================
// Get Inventory
// =====================================

exports.getInventory = (req, res) => {

    db.all(
        `
        SELECT
            sku,
            available_qty
        FROM inventory
        ORDER BY sku
        `,
        [],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.json(rows);

        }
    );

};

exports.resetDatabase = (req, res) => {

    db.serialize(() => {

        db.run("DELETE FROM orders");
        db.run("DELETE FROM inventory");
        db.run("DELETE FROM order_steps");
        db.run("DELETE FROM logs");
        db.run("DELETE FROM sqlite_sequence");

        res.json({
            success: true,
            message: "Database Reset Successfully"
        });

    });

};

// =====================================
// Save Order
// =====================================

function saveOrder(order) {

    return new Promise((resolve, reject) => {

        db.run(
            `
            INSERT OR IGNORE INTO orders
            (
                order_id,
                sku,
                qty,
                amount,
                status,
                fail_at,
                comp_fail_at
            )
            VALUES
            (
                ?,?,?,?,?,?,?
            )
            `,
            [
                order.order_id,
                order.sku,
                Number(order.qty),
                Number(order.amount),
                "IN_PROGRESS",
                order.fail_at || "",
                order.comp_fail_at || ""
            ],
            async function (err) {

                if (err) {
                    return reject(err);
                }

                if (this.changes === 0) {
                    return resolve();
                }

                try {

                    await coordinator.processOrder(order);

                    resolve();

                }

                catch (error) {

                    reject(error);

                }

            }
        );

    });

}