import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('https://pak-tex-2026-production-1907.up.railway.app/api/admin/orders', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status === 401 || res.status === 403) {
                throw new Error("Unauthorized");
            }
            return res.json();
        })
        .then(data => {
            setOrders(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Admin Fetch Error:", err);
            localStorage.removeItem('adminToken');
            navigate('/login');
        });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    if (loading) return (
        <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ letterSpacing: '10px' }}>AUTHENTICATING...</h2>
        </div>
    );

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1 style={{ letterSpacing: '10px', textTransform: 'uppercase', marginBottom: '10px' }}>Orders Log</h1>
                    <p style={{ color: '#00ff00', fontSize: '0.7rem', letterSpacing: '2px' }}>● SYSTEM SECURE (ENCRYPTED)</p>
                </div>
                <button onClick={handleLogout} className="hero-btn" style={{ padding: '10px 20px', fontSize: '0.7rem' }}>
                    LOGOUT
                </button>
            </div>

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>City Name</th>
                        <th>Event or Venue Name</th>
                        <th>Address</th>
                        <th style={{ width: '20px' }}></th> 
                        <th>Phone Number</th>
                        <th style={{ width: '20px' }}></th> 
                        <th>Website URL</th>
                        <th>Accommodation</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => {
                            // Safely handle items list from backend
                            const items = Array.isArray(order.items) ? order.items : [];
                            
                            return (
                                <tr key={order.id}>
                                    <td>PAKISTAN</td> 

                                    <td>
                                        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
                                            {(order.customer_name || 'UNKNOWN').toUpperCase()}
                                        </div>
                                        {items.length > 0 ? items.map((item, i) => (
                                            <div key={i} className="item-tag" style={{ fontSize: '0.65rem', color: '#aaa' }}>
                                                {item.quantity}x {item.hoodie_name || item.name || 'Item'} [{item.size} / {item.color}]
                                            </div>
                                        )) : <div style={{ color: '#444' }}>No items listed</div>}
                                    </td>

                                    <td style={{ maxWidth: '250px', lineHeight: '1.4' }}>{order.address}</td>
                                    <td></td>
                                    <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{order.phone}</td>
                                    <td></td>
                                    <td style={{ color: '#888' }}>{order.email}</td>
                                    <td style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#00ff00' }}>
                                        {order.Accommodation !== "None" && order.Accommodation ? order.Accommodation : (order.total ? `PAID: $${order.total}` : 'None')}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '100px', color: '#444' }}>
                                NO ORDERS FOUND IN DATABASE
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}