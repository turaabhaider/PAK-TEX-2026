import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        
        // If no token exists, send them to login immediately
        if (!token) {
            navigate('/login');
            return;
        }

        fetch('http://localhost:5000/api/admin/orders', {
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
            localStorage.removeItem('adminToken'); // Clear bad token
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
                        <th>Event / Venue</th>
                        <th>Address</th>
                        <th style={{ width: '20px' }}></th> {/* Empty Space 4 */}
                        <th>Phone Number</th>
                        <th style={{ width: '20px' }}></th> {/* Empty Space 6 */}
                        <th>Website URL</th>
                        <th>Accommodation</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => {
                            // Backend sends items as a JSON string or Array depending on SQL version
                            const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
                            
                            return (
                                <tr key={order.id}>
                                    {/* 1. City Name */}
                                    <td>PAKISTAN</td> 

                                    {/* 2. Event / Venue (Customer & Order Details) */}
                                    <td>
                                        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
                                            {order.customer_name.toUpperCase()}
                                        </div>
                                        {items.map((item, i) => (
                                            <div key={i} className="item-tag">
                                                {item.qty}x {item.name} [{item.size} / {item.color}]
                                            </div>
                                        ))}
                                    </td>

                                    {/* 3. Address */}
                                    <td style={{ maxWidth: '250px', lineHeight: '1.4' }}>{order.address}</td>

                                    {/* 4. Empty Space */}
                                    <td></td>

                                    {/* 5. Phone Number (Stored without +) */}
                                    <td style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>{order.phone}</td>

                                    {/* 6. Empty Space */}
                                    <td></td>

                                    {/* 7. Website URL (Using Email here) */}
                                    <td style={{ color: '#888' }}>{order.email}</td>

                                    {/* 8. Accommodation */}
                                    <td style={{ fontSize: '0.7rem' }}>
                                        {order.total ? `PAID: $${order.total}` : 'STANDARD'}
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