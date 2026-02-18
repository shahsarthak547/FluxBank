import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';

const RecommendationPanel = ({ recommendation }) => {
    if (!recommendation) return <div className="glass-card">Select a customer to see AI recommendations.</div>;

    const { product, confidence, explanation } = recommendation;

    return (
        <motion.div
            className="glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2><Sparkles size={24} color="#00ffcc" style={{ marginRight: '8px', display: 'inline' }} /> AI Recommendation</h2>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#00ffcc', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                    {confidence}% Confidence
                </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Product</h3>
                <h1 style={{ fontSize: '3rem', margin: '10px 0', textShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}>{product}</h1>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                <p style={{ margin: 0, fontStyle: 'italic' }}>"{explanation}"</p>
            </div>
        </motion.div>
    );
};

export default RecommendationPanel;
