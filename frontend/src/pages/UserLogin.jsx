import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserLogin() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // For now, we save the user email to represent a logged-in session
        localStorage.setItem('userEmail', email);
        navigate('/checkout'); // Send them to the requirements page after login
    };

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '100px', color: 'white' }}>
            <h2 style={{ letterSpacing: '5px' }}>CUSTOMER LOGIN</h2>
            <p style={{ color: '#888', marginTop: '10px' }}>PLEASE LOGIN TO CONTINUE YOUR ORDER</p>
            <form onSubmit={handleLogin} style={{ marginTop: '30px' }}>
                <input 
                    type="email" 
                    placeholder="ENTER EMAIL" 
                    required
                    style={{ width: '300px', padding: '15px', background: '#000', border: '1px solid #222', color: '#fff' }}
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <br />
                <button type="submit" className="hero-btn" style={{ marginTop: '20px', border: 'none', cursor: 'pointer' }}>
                    CONTINUE TO SHIPPING
                </button>
            </form>
        </div>
    );
}