async function test() {
    try {
        const res = await fetch('http://localhost:3000/offers/2');
        console.log('Status:', res.status);
        if (res.ok) {
            const data = await res.json();
            console.log('Data:', data);
        } else {
            console.log('Text:', await res.text());
        }
    } catch (e) {
        console.error(e);
    }
}
test();
