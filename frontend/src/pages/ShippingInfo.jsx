export default function ShippingInfo() {
    return (
        <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '80vh', padding: '150px 50px' }}>
            <h1 style={{ letterSpacing: '5px', marginBottom: '40px' }}>SHIPPING POLICY</h1>
            <div style={{ color: '#888', lineHeight: '2', letterSpacing: '1px', maxWidth: '800px' }}>
                <p style={{ marginBottom: '20px' }}><strong>STANDARD SHIPPING:</strong> 3-5 Business Days</p>
                <p style={{ marginBottom: '20px' }}><strong>EXPRESS SHIPPING:</strong> 1-2 Business Days</p>
                <p>All orders are processed within 24 hours. You will receive a tracking number via email once your order has shipped.</p>
            </div>
        </div>
    );
}