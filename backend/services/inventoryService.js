const db = require("../database");

async function reserve(order) {

    return new Promise((resolve, reject) => {

        // Simulate assignment failure
        if (order.fail_at === "RESERVE_INVENTORY") {
            return reject(new Error("Inventory Reservation Failed"));
        }

        db.get(
            "SELECT available_qty FROM inventory WHERE sku = ?",
            [order.sku],
            (err, row) => {

                if (err) {
                    return reject(err);
                }

                if (!row) {
                    return reject(new Error("Product Not Found"));
                }

                if (row.available_qty < order.qty) {
                    return reject(new Error("Insufficient Inventory"));
                }

                db.run(
                    `
                    UPDATE inventory
                    SET available_qty = available_qty - ?
                    WHERE sku = ?
                    `,
                    [order.qty, order.sku],
                    function (err) {

                        if (err) {
                            return reject(err);
                        }

                        console.log("Inventory Reserved");

                        resolve(true);

                    }
                );

            }
        );

    });

}

async function release(order) {

    return new Promise((resolve, reject) => {

        db.run(
            `
            UPDATE inventory
            SET available_qty = available_qty + ?
            WHERE sku = ?
            `,
            [order.qty, order.sku],
            function (err) {

                if (err) {
                    return reject(err);
                }

                console.log("Inventory Released");

                resolve(true);

            }
        );

    });

}

module.exports = {
    reserve,
    release
};