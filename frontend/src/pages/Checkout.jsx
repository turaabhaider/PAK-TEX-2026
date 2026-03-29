import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const { cartItems, removeFromCart, getTotalPrice } = useContext(CartContext);
    const navigate = useNavigate();

    if (!cartItems) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>LOADING CART...</div>;

    return (
        <div className="checkout-page" style={{ padding: '100px 50px', backgroundColor: '#000', minHeight: '100vh', color: '#fff' }}>
            <h2 style={{ letterSpacing: '5px', marginBottom: '40px' }}>YOUR CART</h2>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <p style={{ letterSpacing: '2px', color: '#888' }}>YOUR CART IS EMPTY</p>
                    <button 
                        onClick={() => navigate('/')} 
                        style={{ marginTop: '30px', background: '#fff', color: '#000', border: 'none', padding: '15px 40px', cursor: 'pointer', fontWeight: 'bold' }}>
                        RETURN TO SHOP
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '50px' }}>
                    <div style={{ flex: '2' }}>
                        {cartItems.map((item, index) => (
                            <div key={item.cartId || index} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #222', padding: '20px 0' }}>
                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '120px', objectFit: 'cover' }} />
                                    <div>
                                        <h4 style={{ letterSpacing: '1px' }}>{item.name}</h4>
                                        <p style={{ color: '#888' }}>${Number(item.price).toFixed(2)}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(index)} 
                                    style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', height: 'fit-content' }}>
                                    REMOVE
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ flex: '1', background: '#0a0a0a', padding: '30px', border: '1px solid #111', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '0.9rem' }}>ORDER SUMMARY</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>SUBTOTAL</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <span>SHIPPING</span>
                            <span style={{ color: '#00ff00' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', borderTop: '1px solid #222', paddingTop: '20px' }}>
                            <span>TOTAL</span>
                            <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        
                        {/* FIXED BUTTON: Now navigates to the shipping form */}
                        <button 
                            onClick={() => navigate('/shipping')}
                            style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '18px', marginTop: '30px', fontWeight: 'bold', cursor: 'pointer' }}>
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}