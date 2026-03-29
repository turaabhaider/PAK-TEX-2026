import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const [size, setSize] = useState('L');
    const [color, setColor] = useState('BLACK');

    return (
        <div className="product-card">
            {/* Image Box - Now handles real images */}
            <div className="product-img-box">
                <img 
                    src={product.image_url || "https://via.placeholder.com/600x800/111111/FFFFFF?text=PAK-TEX+GARMENT"} 
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = "https://via.placeholder.com/600x800/000000/FFFFFF?text=IMAGE+PENDING" }}
                />
            </div>
            
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">${product.price}</p>
                
                <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
                        <select className="input-select" value={size} onChange={e => setSize(e.target.value)} 
                            style={{ flex: 1, background: '#000', color: '#fff', border: '1px solid #222', padding: '10px', fontSize: '0.7rem' }}>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                        </select>
                        <select className="input-select" value={color} onChange={e => setColor(e.target.value)}
                             style={{ flex: 1, background: '#000', color: '#fff', border: '1px solid #222', padding: '10px', fontSize: '0.7rem' }}>
                            <option value="BLACK">BLACK</option>
                            <option value="BONE">BONE</option>
                            <option value="ONYX">ONYX</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={() => addToCart({ ...product, size, color, quantity: 1 })}
                        className="hero-btn" 
                        style={{ width: '100%', padding: '15px', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    );
}