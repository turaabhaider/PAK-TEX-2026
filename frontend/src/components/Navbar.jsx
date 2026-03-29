import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export default function Navbar() {
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdmin = localStorage.getItem('adminToken');
    const isUser = localStorage.getItem('userEmail');

    const handleShopClick = (e) => {
        e.preventDefault();
        // Matching the ID "shop" exactly as it appears in Home.jsx
        const targetId = 'shop'; 
        
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        } else {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">PAK-TEX</Link>
            
            <div className="nav-links">
                {/* Fixed Shop Scroll Logic */}
                <a href="#shop" onClick={handleShopClick}>Shop</a>
                
                <Link to={isUser ? "/checkout" : "/user-login"}>
                    Cart ({cartItems.length})
                </Link>

                {isAdmin && (
                    <Link to="/admin" style={{ color: '#00ff00', fontWeight: '800', border: '1px solid #00ff00', padding: '5px 10px', marginLeft: '20px' }}>
                        ADMIN
                    </Link>
                )}
            </div>
        </nav>
    );
}