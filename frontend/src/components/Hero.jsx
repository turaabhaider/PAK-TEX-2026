export default function Hero() {
    const scrollToShop = () => {
        document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="hero">
            <div className="hero-content">
                <p className="hero-subtitle">NEW SEASON // 2026</p>
                <h1 className="hero-title">PAK-TEX</h1>
                <p className="hero-description">PREMIUM STREETWEAR ENGINEERED FOR THE MODERN ICON.</p>
                <button onClick={scrollToShop} className="hero-btn" style={{ border: 'none', cursor: 'pointer' }}>
                    SHOP COLLECTION
                </button>
            </div>
        </section>
    );
}