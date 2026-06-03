const testOfferReservation = async () => {
    try {
        const payload = {
            offer: "Advance Purchase",
            guestName: "Debug User",
            email: "debug@example.com",
            phone: "1234567890",
            date: "2026-02-01",
            amount: 180.00,
            offerId: 1
        };

        console.log("Sending payload:", payload);
        const res = await fetch('http://localhost:3000/offerReservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            console.log("Success:", JSON.stringify(data, null, 2));
        } else {
            console.error("Error Status:", res.status);
            console.error("Error Data:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error Message:", error.message);
    }
};

testOfferReservation();
