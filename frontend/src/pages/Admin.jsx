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

        const fetchOrders = async () => {
            try {
                const res = await fetch('https://pak-tex-2026-production-1907.up.railway.app/api/admin/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (res.status === 401 || res.status === 403) {
                    throw new Error("Unauthorized");
                }

                const data = await res.json();
                // Ensure data is always an array before setting state
                setOrders(Array.isArray(data) ? data : (data.orders || []));
                setLoading(false);
            } catch (err) {
                console.error("Admin Fetch Error:", err);
                localStorage.removeItem('adminToken');
                navigate('/login');
            }
        };

        fetchOrders();
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
                            const items = Array.isArray(order.items) ? order.items : [];
                            
                            return (
                                <tr key={order.id}>
                                    <td style={{ fontSize: '0.75rem' }}>PAKISTAN</td> 

                                    <td>
                                        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff', fontSize: '0.8rem' }}>
                                            {(order.customer_name || 'GUEST').toUpperCase()}
                                        </div>
                                        {items.length > 0 ? items.map((item, i) => (
                                            <div key={i} className="item-tag" style={{ fontSize: '0.6rem', color: '#aaa' }}>
                                                {item.quantity}x {item.name || 'Hoodie'} [{item.size || 'N/A'} / {item.color || 'N/A'}]
                                            </div>
                                        )) : <div style={{ color: '#444', fontSize: '0.6rem' }}>No items details</div>}
                                    </td>

                                    <td style={{ maxWidth: '200px', lineHeight: '1.4', fontSize: '0.75rem' }}>{order.address}</td>
                                    <td></td>
                                    <td style={{ fontFamily: 'monospace', letterSpacing: '1px', fontSize: '0.75rem' }}>{order.phone}</td>
                                    <td></td>
                                    <td style={{ color: '#888', fontSize: '0.75rem' }}>{order.email}</td>
                                    <td style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#00ff00' }}>
                                        {order.Accommodation && order.Accommodation !== "None" 
                                            ? order.Accommodation 
                                            : (order.total ? `PAID: $${order.total}` : 'PENDING')}
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '100px', color: '#444', letterSpacing: '2px' }}>
                                NO ORDERS FOUND IN DATABASE
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}