import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function AllHoodies() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

   const API_URL = 'https://pak-tex-2026-production-1907.up.railway.app';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setProducts([]);
            }
        };
        fetchProducts();
    }, [API_URL]);

    return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '100px 50px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '60px', letterSpacing: '8px', fontSize: '1.5rem', textTransform: 'uppercase' }}>
                All Hoodies
            </h2>
            
            {products.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#444', letterSpacing: '2px' }}>NO PRODUCTS FOUND</p>
            ) : (
                <div className="product-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(4, 1fr)', 
                    gap: '30px' 
                }}>
                    {products.map((product) => (
                        <div key={product.id} className="product-card" style={{ textAlign: 'center' }}>
                            <div className="img-container" style={{ 
                                background: '#111', 
                                height: '450px', 
                                marginBottom: '20px',
                                overflow: 'hidden'
                            }}>
                                <img 
                                    src={product.image_url} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>
                            <h3 style={{ fontSize: '0.85rem', letterSpacing: '2px', marginBottom: '10px', textTransform: 'uppercase' }}>
                                {product.name}
                            </h3>
                            <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>
                                ${product.price}
                            </p>
                            <button 
                                onClick={() => addToCart(product)}
                                style={{ 
                                    background: '#fff', 
                                    color: '#000', 
                                    border: 'none', 
                                    padding: '12px 0', 
                                    width: '100%', 
                                    cursor: 'pointer', 
                                    fontWeight: '700',
                                    letterSpacing: '1px'
                                }}>
                                ADD TO CART
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}