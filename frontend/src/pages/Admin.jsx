import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }

        const fetchOrders = async () => {
            try {
                const res = await fetch('https://pak-tex-2026-production-1907.up.railway.app/api/admin/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) throw new Error("Unauthorized");

                const data = await res.json();
                // Ensure we handle both array or object response
                const orderData = Array.isArray(data) ? data : (data.orders || []);
                setOrders(orderData);
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff' }}>
            <h2 style={{ letterSpacing: '10px' }}>AUTHENTICATING...</h2>
        </div>
    );

    return (
        <div className="admin-container" style={{ background: '#000', minHeight: '100vh', padding: '20px' }}>
            <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ letterSpacing: '10px', textTransform: 'uppercase' }}>Orders Log</h1>
                    <p style={{ color: '#00ff00', fontSize: '0.7rem' }}>● SYSTEM SECURE (ENCRYPTED)</p>
                </div>
                <button onClick={handleLogout} className="hero-btn">LOGOUT</button>
            </div>

            <table className="admin-table" style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #333', textAlign: 'left', color: '#888', fontSize: '0.7rem' }}>
                        <th>City Name</th>
                        <th>Customer & Items</th>
                        <th>Address</th>
                        <th style={{ width: '20px' }}></th> {/* 4th Empty */}
                        <th>Phone Number</th>
                        <th style={{ width: '20px' }}></th> {/* 6th Empty */}
                        <th>Email Address</th>
                        <th>Accommodation</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map((order) => {
                        let items = [];
                        try {
                            items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
                        } catch (e) { items = []; }
                        
                        return (
                            <tr key={order.id} style={{ borderBottom: '1px solid #111' }}>
                                <td style={{ padding: '15px', fontSize: '0.75rem' }}>PAKISTAN</td> 
                                <td style={{ padding: '10px 0' }}>
                                    <div style={{ fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                                        {order.customer_name || 'GUEST'}
                                    </div>
                                    {items.map((item, i) => (
                                        <div key={i} style={{ fontSize: '0.6rem', color: '#777' }}>
                                            {item.quantity}x {item.name || 'Item'} [{item.size || 'N/A'} / {item.color || 'N/A'}]
                                        </div>
                                    ))}
                                </td>
                                <td style={{ fontSize: '0.75rem' }}>{order.address}</td>
                                <td></td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{order.phone}</td>
                                <td></td>
                                <td style={{ color: '#888', fontSize: '0.75rem' }}>{order.email}</td>
                                <td style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                    {order.Accommodation && order.Accommodation !== "None" 
                                        ? order.Accommodation 
                                        : `$${order.total || 0}`}
                                </td>
                            </tr>
                        );
                    }) : (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center', padding: '100px', color: '#444' }}>NO ORDERS FOUND</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}