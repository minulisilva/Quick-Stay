const generateId = (prefix) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
    return `${prefix}-${randomNum}`;
};

module.exports = { generateId };
