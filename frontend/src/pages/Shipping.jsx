import { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Shipping() {
    const { cartItems, getTotalPrice } = useContext(CartContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\+/g, '');
        setFormData({...formData, phone: value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Don't place order if cart is empty
        if (cartItems.length === 0) {
            alert("YOUR CART IS EMPTY");
            return;
        }

        const orderData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            items: cartItems,
            total: getTotalPrice()
        };

        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await res.json();

            if (res.ok) {
                alert("ORDER PLACED SUCCESSFULLY!");
                localStorage.removeItem('pak_tex_cart'); 
                // Using navigate is safer than window.location.href
                navigate('/'); 
            } else {
                console.error("Server Error:", result);
                alert(`FAILED: ${result.message || "COULD NOT PROCESS ORDER"}`);
            }
        } catch (err) {
            console.error("Network/Order Error:", err);
            alert("CONNECTION ERROR: IS THE SERVER RUNNING ON PORT 5000?");
        }
    };

    return (
        <div style={{ padding: '100px 50px', backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
            <h2 style={{ letterSpacing: '5px', textAlign: 'center', textTransform: 'uppercase' }}>Shipping Details</h2>
            
            <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '50px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input 
                    type="text" placeholder="FULL NAME" required
                    style={{ padding: '15px', background: '#111', border: '1px solid #333', color: '#fff' }}
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
                <input 
                    type="email" placeholder="EMAIL ADDRESS" required
                    style={{ padding: '15px', background: '#111', border: '1px solid #333', color: '#fff' }}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    type="text" 
                    placeholder="PHONE NUMBER (No + sign)" 
                    required
                    value={formData.phone}
                    style={{ padding: '15px', background: '#111', border: '1px solid #333', color: '#fff' }}
                    onChange={handlePhoneChange} 
                />
                <textarea 
                    placeholder="COMPLETE SHIPPING ADDRESS" required
                    style={{ padding: '15px', background: '#111', border: '1px solid #333', color: '#fff', height: '100px', resize: 'none' }}
                    onChange={(e) => setFormData({...formData, address: e.target.value})} 
                />
                
                <div style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '20px' }}>
                    <p style={{ letterSpacing: '2px' }}>TOTAL TO PAY: <strong>${getTotalPrice().toFixed(2)}</strong></p>
                    <button type="submit" style={{ width: '100%', padding: '20px', background: '#fff', color: '#000', fontWeight: '800', cursor: 'pointer', marginTop: '20px', border: 'none', letterSpacing: '2px' }}>
                        PLACE ORDER
                    </button>
                </div>
            </form>
        </div>
    );
}