async function debugFetch() {
    try {
        // 1. Login
        const loginRes = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@quickstay.com', password: 'password123' })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            console.error("Login failed:", loginData);
            return;
        }

        const token = loginData.token;
        console.log("Login successful, token received.");

        // 2. Fetch Reservations
        const res = await fetch('http://localhost:3000/diningReservations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("Fetch Status:", res.status);
        console.log("Reservations Data:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Debug failed:", error.message);
    }
}

debugFetch();
