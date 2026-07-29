const db = require("../database");

function startNotificationJob() {

    console.log("Notification Service Started");

    // 1 minute for demo
    setInterval(() => {

        db.all(
            `
            SELECT *
            FROM orders
            WHERE status='SHIPPED'
            AND notification_sent=0
            `,
            [],
            (err, rows) => {

                if (err) {
                    console.log(err);
                    return;
                }

                rows.forEach(order => {

                    sendNotification(order);

                });

            }
        );

    }, 60000);

}

function sendNotification(order) {

    console.log(`Notification Sent : ${order.order_id}`);

    db.run(
        `
        UPDATE orders
        SET notification_sent=1
        WHERE order_id=?
        `,
        [order.order_id]
    );

    db.run(
        `
        INSERT INTO logs
        (
            order_id,
            message
        )
        VALUES
        (
            ?,?
        )
        `,
        [
            order.order_id,
            "Shipping Notification Sent"
        ]
    );

}

module.exports = {
    startNotificationJob
};