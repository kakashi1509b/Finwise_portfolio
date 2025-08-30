import React, { useState } from 'react';

const MarketPricesView = () => {
    const [assetType, setAssetType] = useState('Stock');
    const [name, setName] = useState('');
    const [priceData, setPriceData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPriceData(null);
        try {
            const response = await fetch('/api/price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetType, name })
            });
            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Failed to fetch price");
            setPriceData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="widget">
                <h3 className="widget-title">Check Asset Prices</h3>
                <form onSubmit={handleSubmit} className="price-form">
                    <select value={assetType} onChange={e => setAssetType(e.target.value)}>
                        <option value="Stock">Stock</option>
                        <option value="Crypto">Crypto</option>
                        <option value="Commodity">Commodity</option>
                    </select>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g., RELIANCE or Bitcoin"
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Fetching...' : 'Get Price'}
                    </button>
                </form>
            </div>

            {loading && <div className="loading-spinner"></div>}
            {error && <div className="error-message">{error}</div>}
            
            {priceData && (
                <div className="widget price-result-grid">
                    <div>
                        <p className="price-label">Current Price</p>
                        <h4 className="price-value">₹{priceData.currentPrice?.toLocaleString('en-IN')}</h4>
                    </div>
                     <div>
                        <p className="price-label">Price 7 Days Ago</p>
                        <h4 className="price-value">₹{priceData.previousPrice?.toLocaleString('en-IN')}</h4>
                    </div>
                     <div>
                        <p className="price-label">7-Day Return</p>
                        <h4 className={`price-value ${priceData.weeklyReturn >= 0 ? 'positive' : 'negative'}`}>
                            {priceData.weeklyReturn?.toFixed(2)}%
                        </h4>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPricesView;