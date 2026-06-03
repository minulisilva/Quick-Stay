import { useState, useEffect } from 'react';

const useContent = (page) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`http://localhost:3000/content/${page}`);
                if (!response.ok) throw new Error('Failed to fetch content');
                const data = await response.json();
                setContent(data);
            } catch (err) {
                console.error(`Error loading content for ${page}:`, err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [page]);

    return { content, loading, error };
};

export default useContent;
