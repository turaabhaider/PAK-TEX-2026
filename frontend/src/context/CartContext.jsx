import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize from localStorage so items don't disappear on reload
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('pak_tex_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save to localStorage whenever cart changes
    useEffect(() => {
        localStorage.setItem('pak_tex_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        // Add item and ensure we don't mutate state directly
        setCartItems((prevItems) => [...prevItems, { ...product, cartId: Date.now() }]);
        alert(`${product.name} added to cart!`);
    };

    const removeFromCart = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + Number(item.price), 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalPrice }}>
            {children}
        </CartContext.Provider>
    );
};