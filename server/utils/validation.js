const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

const validatePhone = (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

const validateUserInput = (userData, isUpdate = false) => {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!validateEmail(userData.email)) {
        errors.push('Please provide a valid email address');
    }
    
    // Only validate password if it's provided or if it's not an update
    if (!isUpdate && !validatePassword(userData.password)) {
        errors.push('Password must be at least 6 characters long');
    } else if (isUpdate && userData.password && !validatePassword(userData.password)) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (userData.phone && !validatePhone(userData.phone)) {
        errors.push('Please provide a valid phone number');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedData: {
            name: sanitizeInput(userData.name),
            email: sanitizeInput(userData.email?.toLowerCase()),
            phone: sanitizeInput(userData.phone),
            dob: userData.dob,
            address: sanitizeInput(userData.address),
            city: sanitizeInput(userData.city),
            country: sanitizeInput(userData.country),
            dietaryPreferences: sanitizeInput(userData.dietaryPreferences),
            specialRequests: sanitizeInput(userData.specialRequests)
        }
    };
};

const validateRoomInput = (roomData) => {
    const errors = [];
    
    if (!roomData.name || roomData.name.trim().length < 2) {
        errors.push('Room name is required');
    }
    
    if (!roomData.type) {
        errors.push('Room type is required');
    }
    
    if (!roomData.price || roomData.price <= 0) {
        errors.push('Valid price is required');
    }
    
    if (!roomData.capacity || roomData.capacity <= 0) {
        errors.push('Valid capacity is required');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedData: {
            name: sanitizeInput(roomData.name),
            type: sanitizeInput(roomData.type),
            description: sanitizeInput(roomData.description),
            price: parseFloat(roomData.price),
            capacity: parseInt(roomData.capacity),
            amenities: Array.isArray(roomData.amenities) ? roomData.amenities.map(sanitizeInput) : [],
            images: Array.isArray(roomData.images) ? roomData.images : []
        }
    };
};

module.exports = {
    validateEmail,
    validatePassword,
    validatePhone,
    sanitizeInput,
    validateUserInput,
    validateRoomInput
};