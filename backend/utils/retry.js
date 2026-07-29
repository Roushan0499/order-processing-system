/**
 * Retry Utility
 * Retries an async function with timeout support
 *
 * @param {Function} fn Async function to execute
 * @param {number} retries Number of retries
 * @param {number} delay Delay between retries (ms)
 * @param {number} timeout Timeout for each attempt (ms)
 */

async function retry(
    fn,
    retries = 3,
    delay = 1000,
    timeout = 5000
) {

    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {

        try {

            const result = await Promise.race([

                fn(),

                new Promise((_, reject) => {

                    setTimeout(() => {

                        reject(new Error("Operation Timed Out"));

                    }, timeout);

                })

            ]);

            return result;

        }

        catch (error) {

            lastError = error;

            console.log(
                `Attempt ${attempt}/${retries} Failed : ${error.message}`
            );

            if (attempt < retries) {

                await new Promise(resolve =>
                    setTimeout(resolve, delay)
                );

            }

        }

    }

    throw lastError;

}

module.exports = retry;