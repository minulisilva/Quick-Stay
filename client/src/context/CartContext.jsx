import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart([...cart, { ...item, id: Date.now() }]); // simple unique ID
    };

    const removeFromCart = (itemId) => {
        setCart(cart.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const total = cart.reduce((acc, item) => acc + item.totalPrice, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};
