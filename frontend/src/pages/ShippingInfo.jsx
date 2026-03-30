import React, { useState } from 'react';

export default function ShippingInfo() {
    // 1. Get the Backend URL (Defaults to localhost if not set in Railway)
   const API_URL = import.meta.env.VITE_API_URL || 'https://pak-tex-2026-production-1907.up.railway.app';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic Phone Validation: Removing plus signs per your preference
        const cleanPhone = formData.phone.replace('+', '');

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    phone: cleanPhone,
                    total: 120.00 // This should ideally come from your Cart context
                }),
            });

            if (response.ok) {
                alert('Order Placed Successfully!');
            } else {
                const errorData = await response.json();
                console.error('Server Error:', errorData);
                alert(`Order Failed: ${errorData.error || 'Check server logs'}`);
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Could not connect to the server. Is the Backend URL correct?');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: '#111',
        border: '1px solid #333',
        color: '#fff',
        fontSize: '14px',
        letterSpacing: '1px'
    };

    return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '100px 20px', textAlign: 'center' }}>
            <h2 style={{ letterSpacing: '4px', marginBottom: '50px', fontWeight: '300' }}>SHIPPING DETAILS</h2>
            
            <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
                <input 
                    name="fullName" 
                    placeholder="FULL NAME" 
                    style={inputStyle} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    name="email" 
                    type="email" 
                    placeholder="EMAIL ADDRESS" 
                    style={inputStyle} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    name="phone" 
                    type="tel" 
                    placeholder="PHONE NUMBER (No + sign)" 
                    style={inputStyle} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    name="address" 
                    placeholder="COMPLETE SHIPPING ADDRESS" 
                    style={{ ...inputStyle, height: '100px', fontFamily: 'inherit' }} 
                    onChange={handleChange} 
                    required 
                />

                <div style={{ margin: '30px 0', borderTop: '1px solid #222', paddingTop: '20px' }}>
                    <p style={{ letterSpacing: '2px', fontSize: '18px' }}>TOTAL TO PAY: <strong>$120.00</strong></p>
                </div>

                <button type="submit" style={{
                    width: '100%',
                    padding: '20px',
                    backgroundColor: '#fff',
                    color: '#000',
                    border: 'none',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: '0.3s'
                }}>
                    PLACE ORDER
                </button>
            </form>
        </div>
    );
}