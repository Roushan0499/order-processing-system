const retry = require("../utils/retry");

const orderService = require("./orderService");
const inventoryService = require("./inventoryService");
const paymentService = require("./paymentService");
const shippingService = require("./shippingService");

const db = require("../database");

async function processOrder(order) {

    const completed = [];

    const tasks = [

        {
            name: "ORDER",
            execute: () => retry(() => orderService.create(order)),
            undo: () => orderService.cancel(order)
        },

        {
            name: "INVENTORY",
            execute: () => retry(() => inventoryService.reserve(order)),
            undo: () => inventoryService.release(order)
        },

        {
            name: "PAYMENT",
            execute: () => retry(() => paymentService.charge(order)),
            undo: () => paymentService.refund(order)
        },

        {
            name: "SHIPMENT",
            execute: () => retry(() => shippingService.create(order)),
            undo: () => shippingService.cancel(order)
        }

    ];

    const results = await Promise.allSettled(

        tasks.map(async (task) => {

            await task.execute();

            completed.push(task);

            saveStep(order.order_id, task.name, "SUCCESS");

            addLog(order.order_id, `${task.name} Success`);

        })

    );

    const hasFailure = results.some(r => r.status === "rejected");

    if (!hasFailure) {

        updateOrderStatus(order.order_id, "PLACED");

        addLog(order.order_id, "Order Placed");

        console.log(order.order_id, "PLACED");

        return "PLACED";

    }

    console.log("Processing Failed");

    try {

        for (const task of completed.reverse()) {

            await retry(() => task.undo());

            saveStep(order.order_id, "UNDO_" + task.name, "SUCCESS");

            addLog(order.order_id, `${task.name} Undone`);

        }

        updateOrderStatus(order.order_id, "CANCELLED");

        addLog(order.order_id, "Order Cancelled");

        return "CANCELLED";

    } catch (err) {

        console.log("Compensation Failed");

        updateOrderStatus(order.order_id, "NEEDS_ATTENTION");

        addLog(order.order_id, "Needs Manual Retry");

        return "NEEDS_ATTENTION";

    }

}

function updateOrderStatus(orderId, status) {

    db.run(
        "UPDATE orders SET status=? WHERE order_id=?",
        [status, orderId]
    );

}

function addLog(orderId, message) {

    db.run(
        "INSERT INTO logs(order_id,message) VALUES(?,?)",
        [orderId, message]
    );

}

function saveStep(orderId, step, status) {

    db.run(
        `
        INSERT OR IGNORE INTO order_steps
        (
            order_id,
            step,
            status,
            completed
        )
        VALUES(?,?,?,1)
        `,
        [
            orderId,
            step,
            status
        ]
    );

}

module.exports = {
    processOrder
};