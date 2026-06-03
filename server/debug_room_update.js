const http = require('http');

const roomId = '1'; // Assuming room with ID 1 exists, we'll try to get it first
const updateData = JSON.stringify({
    name: "Updated Room Name via Debug",
    price: 150,
    description: "This is a debug update description.",
    occupancy: { adults: 2, children: 1 },
    amenities: ["Wifi", "Debug"],
    gallery: ["http://example.com/img.jpg"]
});

// 1. Fetch a room to get a valid ID
const getReq = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/rooms',
    method: 'GET'
}, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const rooms = JSON.parse(data);
            if (rooms.length > 0) {
                const targetId = rooms[0].id || rooms[0]._id;
                console.log('Target Room ID:', targetId);
                updateRoom(targetId);
            } else {
                console.log('No rooms found to update.');
            }
        } catch (e) {
            console.error('Error parsing rooms:', e);
            console.log('Response body:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error fetching rooms:', err.message);
});
getReq.end();

function updateRoom(id) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/rooms/${id}`,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': updateData.length
        }
    };

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => console.log('BODY:', body));
    });

    req.on('error', (e) => console.error(`problem with request: ${e.message}`));
    req.write(updateData);
    req.end();
}
