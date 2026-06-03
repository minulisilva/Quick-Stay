const http = require('http');

const usersToTest = [
    { email: 'admin@quickstay.com', password: 'password123' },
    { email: 'minolidesilva2003@gmail.com', password: 'password123' }
];

async function testLogin(user) {
    return new Promise((resolve) => {
        const loginData = JSON.stringify(user);
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.token) {
                        console.log(`[PASS] Login successful for ${user.email} (Role: ${result.role})`);
                    } else {
                        console.log(`[FAIL] Login failed for ${user.email}: ${result.message}`);
                    }
                } catch (e) {
                    console.error(`[ERROR] Parsing response for ${user.email}:`, e);
                }
                resolve();
            });
        });
        req.write(loginData);
        req.end();
    });
}

async function runTests() {
    for (const u of usersToTest) {
        await testLogin(u);
    }
}

runTests();
