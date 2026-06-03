import { useState, useEffect } from 'react';

export const useRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch('http://localhost:3000/rooms');
                if (!response.ok) {
                    throw new Error('Failed to fetch rooms');
                }
                const data = await response.json();
                setRooms(data);
            } catch (err) {
                setError(err.message);
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    return { rooms, loading, error };
};
