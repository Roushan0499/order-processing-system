const db = require("../database");

async function create(order) {

    return new Promise((resolve, reject) => {

        if (order.fail_at === "CREATE_ORDER") {
            return reject(new Error("Create Order Failed"));
        }

        db.run(
            `UPDATE orders
             SET status = 'ORDER_CREATED'
             WHERE order_id = ?`,
            [order.order_id],
            (err) => {

                if (err) {
                    return reject(err);
                }

                console.log("Order Created");

                resolve(true);

            }
        );

    });

}

async function cancel(order) {

    return new Promise((resolve, reject) => {

        db.run(
            `UPDATE orders
             SET status = 'ORDER_CANCELLED'
             WHERE order_id = ?`,
            [order.order_id],
            (err) => {

                if (err) {
                    return reject(err);
                }

                console.log("Order Cancelled");

                resolve(true);

            }
        );

    });

}

module.exports = {
    create,
    cancel
};