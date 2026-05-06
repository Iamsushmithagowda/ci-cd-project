const http = require('http');

function testAPI() {
    return new Promise((resolve, reject) => {

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/tasks',
            method: 'GET'
        };

        const req = http.request(options, res => {

            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    JSON.parse(data);
                    console.log("✅ API Test Passed");
                    resolve();
                } catch (err) {
                    reject("❌ API did not return valid JSON");
                }
            });

        });

        req.on('error', err => {
            reject("❌ Request failed: " + err.message);
        });

        req.end();
    });
}

// Run test
(async () => {
    try {
        await testAPI();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();