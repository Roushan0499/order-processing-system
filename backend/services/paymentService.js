async function charge(order) {

    return new Promise((resolve, reject) => {

        // Simulate payment failure
        if (order.fail_at === "CHARGE_PAYMENT") {
            return reject(new Error("Payment Charge Failed"));
        }

        console.log("Payment Charged");

        resolve(true);

    });

}

async function refund(order) {

    return new Promise((resolve, reject) => {

        // Simulate compensation failure
        if (order.comp_fail_at === "REFUND_PAYMENT") {
            return reject(new Error("Payment Refund Failed"));
        }

        console.log("Payment Refunded");

        resolve(true);

    });

}

module.exports = {
    charge,
    refund
};