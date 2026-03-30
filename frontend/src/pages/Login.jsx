import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://pak-tex-2026-production-1907.up.railway.app/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin@paktex.com', password })
            });

            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem('adminToken', data.token);
                // Force a reload so the Navbar sees the new token
                window.location.href = '/admin'; 
            } else {
                alert(data.error || 'Login Failed');
            }
        } catch (err) {
            console.error("Login Error:", err);
            alert("Server is down. Check if backend is running on Railway.");
        }
    };

    return (
        <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2 style={{ letterSpacing: '5px', color: 'white' }}>ADMIN ACCESS</h2>
            <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
                <input 
                    type="password" 
                    placeholder="ENTER PASSWORD" 
                    required
                    style={{ width: '300px', padding: '15px', background: '#000', border: '1px solid #222', color: '#fff' }}
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <br />
                <button type="submit" className="hero-btn" style={{ marginTop: '20px', border: 'none', cursor: 'pointer' }}>
                    LOGIN
                </button>
            </form>
        </div>
    );
}