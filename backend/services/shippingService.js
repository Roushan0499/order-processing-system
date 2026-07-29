async function create(order) {

    return new Promise((resolve, reject) => {

        // Simulate shipment creation failure
        if (order.fail_at === "CREATE_SHIPMENT") {
            return reject(new Error("Shipment Creation Failed"));
        }

        console.log("Shipment Created");

        resolve(true);

    });

}

async function cancel(order) {

    return new Promise((resolve, reject) => {

        // Simulate compensation failure
        if (order.comp_fail_at === "CANCEL_SHIPMENT") {
            return reject(new Error("Shipment Cancel Failed"));
        }

        console.log("Shipment Cancelled");

        resolve(true);

    });

}

module.exports = {
    create,
    cancel
};