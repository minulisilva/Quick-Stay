const http = require('http');

const urls = [
    'http://localhost:3000/users',
    'http://localhost:3000/diningOptions',
    'http://localhost:3000/experiences',
    'http://localhost:3000/rooms'
];

async function fetchData(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const item = Array.isArray(json) ? json[0] : json;
                    resolve({
                        url,
                        status: res.statusCode,
                        sample: item ? {
                            id: item.id,
                            _id: item._id,
                            type_id: typeof item.id,
                            type__id: typeof item._id,
                            features: item.features,
                            type_features: Array.isArray(item.features) ? 'array' : typeof item.features
                        } : 'No data'
                    });
                } catch (e) {
                    resolve({ url, status: res.statusCode, error: 'Invalid JSON' });
                }
            });
        }).on('error', (err) => resolve({ url, error: err.message }));
    });
}

(async () => {
    const results = await Promise.all(urls.map(fetchData));
    console.log(JSON.stringify(results, null, 2));
})();
