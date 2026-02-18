import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose }) => {
    // Mock notifications
    const notifications = [
        { id: 1, type: 'success', message: 'Campaign #204 sent to 15 customers', time: '2 mins ago' },
        { id: 2, type: 'warning', message: 'Voice Engine: High latency detected', time: '10 mins ago' },
        { id: 3, type: 'info', message: 'New model version v1.2 available', time: '1 hour ago' },
        { id: 4, type: 'success', message: 'Customer C023 converted (Home Loan)', time: '2 hours ago' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="glass-card"
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        width: '320px',
                        zIndex: 1000,
                        padding: '0',
                        overflow: 'hidden',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                    }}
                >
                    <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}><Bell size={16} style={{ marginRight: '8px', display: 'inline' }} /> Notifications</h3>
                        <X size={18} onClick={onClose} style={{ cursor: 'pointer', color: '#94a3b8' }} />
                    </div>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.map(n => (
                            <div key={n.id} style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
                                <div style={{ marginTop: '2px' }}>
                                    {n.type === 'success' && <CheckCircle size={16} color="#10b981" />}
                                    {n.type === 'warning' && <AlertTriangle size={16} color="#f59e0b" />}
                                    {n.type === 'info' && <Info size={16} color="#3b82f6" />}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{n.message}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ padding: '10px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                        <span style={{ fontSize: '0.8rem', color: '#3b82f6', cursor: 'pointer' }}>View All</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
