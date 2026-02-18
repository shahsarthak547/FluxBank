import React, { useState } from 'react';

const Recommendations = () => {
    // Mock data for now, ideally fetched from backend
    const [logs] = useState([
        { id: 1, customerId: 'C001', product: 'Personal Loan', confidence: 92, persona: 'Balanced Customer', channel: 'Email', timestamp: '2023-10-27 10:30 AM' },
        { id: 2, customerId: 'C015', product: 'Credit Card', confidence: 88, persona: 'High Spender', channel: 'App Notification', timestamp: '2023-10-27 10:45 AM' },
        { id: 3, customerId: 'C023', product: 'Investment Fund', confidence: 75, persona: 'Investor', channel: 'Email', timestamp: '2023-10-27 11:15 AM' },
        { id: 4, customerId: 'C008', product: 'Home Loan', confidence: 64, persona: 'Saver', channel: 'Agent Call', timestamp: '2023-10-27 11:30 AM' },
        { id: 5, customerId: 'C042', product: 'Personal Loan', confidence: 95, persona: 'Balanced Customer', channel: 'Email', timestamp: '2023-10-27 12:00 PM' },
    ]);

    return (
        <div className="recommendations-page">
            <h1 style={{ marginBottom: '30px' }}>Recommendation Logs</h1>
            <div className="glass-card" style={{ padding: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: '15px' }}>Customer ID</th>
                            <th style={{ padding: '15px' }}>Product</th>
                            <th style={{ padding: '15px' }}>Confidence</th>
                            <th style={{ padding: '15px' }}>Persona</th>
                            <th style={{ padding: '15px' }}>Channel</th>
                            <th style={{ padding: '15px' }}>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '15px', fontWeight: 'bold', color: '#3b82f6' }}>{log.customerId}</td>
                                <td style={{ padding: '15px' }}>{log.product}</td>
                                <td style={{ padding: '15px' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold',
                                        background: log.confidence > 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                                        color: log.confidence > 80 ? '#10b981' : '#f59e0b'
                                    }}>
                                        {log.confidence}%
                                    </span>
                                </td>
                                <td style={{ padding: '15px' }}>{log.persona}</td>
                                <td style={{ padding: '15px' }}>{log.channel}</td>
                                <td style={{ padding: '15px', color: '#94a3b8', fontSize: '0.9rem' }}>{log.timestamp}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Recommendations;
