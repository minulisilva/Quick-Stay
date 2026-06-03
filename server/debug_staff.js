const http = require('http');

http.get('http://localhost:3000/staff', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const staff = JSON.parse(data);
            console.log('Status:', res.statusCode);
            console.log('Total Staff:', staff.length);
            staff.forEach(s => {
                console.log(`- Name: ${s.name}, Role: ${s.role}, displayOnAbout: ${s.displayOnAbout} (Type: ${typeof s.displayOnAbout})`);
            });
        } catch (e) {
            console.error(e.message);
            console.log('Raw:', data);
        }
    });
}).on('error', (e) => console.error(e));
