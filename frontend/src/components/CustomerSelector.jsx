import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search } from 'lucide-react';

const CustomerSelector = ({ customers, onSelect, selectedId }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = customers.filter(c =>
        c.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="glass-card sidebar">
            <h2><Users size={20} style={{ marginRight: '8px', display: 'inline' }} /> Customers</h2>
            <div style={{ position: 'relative', marginBottom: '10px' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Search ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 8px 8px 32px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: 'white'
                    }}
                />
            </div>
            <div style={{ overflowY: 'auto', flex: 1 }}>
                {filtered.map((c, i) => (
                    <motion.div
                        key={c.customer_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`customer-item ${selectedId === c.customer_id ? 'selected' : ''}`}
                        onClick={() => onSelect(c)}
                    >
                        <strong>{c.customer_id}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Score: {c.credit_score} | Savings: {c.savings}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CustomerSelector;
