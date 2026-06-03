const fetch = require('node-fetch');
async function test() {
    const res = await fetch('http://localhost:3000/content/global');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
test();
