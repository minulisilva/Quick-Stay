const http = require('http');

// 1. Login to get a fresh token
const loginData = JSON.stringify({
    email: 'admin@quickstay.com',
    password: 'password123'
});

const loginReq = http.request({
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
                console.log('Login successful. Token obtained.');
                testProtected(result.token);
            } else {
                console.log('Login failed:', result.message);
            }
        } catch (e) {
            console.error('Login error:', e);
        }
    });
});

loginReq.write(loginData);
loginReq.end();

function testProtected(token) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/bookings', // Try one of the failing endpoints
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const req = http.request(options, (res) => {
        console.log(`Protected Route Status: ${res.statusCode}`);
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            console.log('Body length:', body.length);
            if (res.statusCode === 401) {
                console.log('401 Unauthorized - Token rejected.');
            } else {
                console.log('Success (or other error).');
            }
        });
    });
    req.end();
}
