import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Home() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useContext(CartContext);

    const API_URL = 'https://pak-tex-2026-production-1907.up.railway.app';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                const data = await res.json();
                // Safety check: only set if data is an array
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("Backend did not return an array:", data);
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
        <div className="home-container" style={{ backgroundColor: '#000', color: '#fff' }}>
            <section className="hero" style={{ 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
            }}>
                <p style={{ letterSpacing: '5px', fontSize: '0.7rem', marginBottom: '10px', color: '#888' }}>
                    NEW SEASON // 2026
                </p>
                <h1 style={{ letterSpacing: '15px', fontSize: '5rem', margin: '0', fontWeight: '800' }}>
                    PAK-TEX
                </h1>
                <p style={{ letterSpacing: '3px', fontSize: '0.75rem', marginTop: '20px', marginBottom: '40px', maxWidth: '400px', lineHeight: '1.6', color: '#888' }}>
                    PREMIUM STREETWEAR ENGINEERED FOR THE MODERN ICON.
                </p>
                <button 
                    onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{ 
                        background: '#fff', 
                        color: '#000', 
                        border: 'none', 
                        padding: '15px 45px', 
                        cursor: 'pointer', 
                        fontWeight: '700', 
                        letterSpacing: '2px',
                        fontSize: '0.8rem',
                        transition: '0.3s'
                    }}
                >
                    SHOP COLLECTION
                </button>
            </section>

            <section id="shop" className="shop-section" style={{ padding: '80px 50px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '60px', letterSpacing: '8px', fontSize: '1.2rem' }}>
                    SHOP ALL HOODIES
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
            </section>
        </div>
    );
}