import React, { useState, useEffect } from 'react';

const AnalysisView = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Assumes user object { username: '...' } is in localStorage after login
    const user = JSON.parse(localStorage.getItem('finwiseUser'));

    useEffect(() => {
        if (!user?.username) {
            setError("Could not find user. Please log in again.");
            setLoading(false);
            return;
        }

        const fetchAnalysis = async () => {
            try {
                // Step 1: Get the user's portfolio
                const portfolioRes = await fetch('/api/portfolio', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user.username })
                });
                const portfolioData = await portfolioRes.json();

                if (!portfolioData.success || !portfolioData.portfolio) {
                    setError('No portfolio found. Please create one to get an analysis.');
                    setLoading(false);
                    return;
                }

                // Step 2: Send the portfolio to the /news endpoint for analysis
                const analysisRes = await fetch('/api/news', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ portfolio: portfolioData.portfolio })
                });
                const analysisData = await analysisRes.json();
                if (analysisData.error) throw new Error(analysisData.error);
                
                setAnalysis(analysisData);
            } catch (err) {
                setError('Failed to fetch analysis from the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [user?.username]);

    if (loading) return <div className="loading-spinner"></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="analysis-grid">
            <div className="widget">
                <h3 className="widget-title">Market News Summary</h3>
                <div className="news-summary">{analysis?.news}</div>
            </div>
            <div className="widget">
                <h3 className="widget-title">AI Portfolio Analysis & Suggestions</h3>
                <p>{analysis?.analysis}</p>
            </div>
            <div className="widget rating-widget">
                <h3 className="widget-title">Portfolio Health Rating</h3>
                <div className="rating-circle">
                    <span>{analysis?.rating}</span>/10
                </div>
            </div>
        </div>
    );
};

export default AnalysisView;