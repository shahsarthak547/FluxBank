import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Shield, Wallet, CreditCard, PieChart } from 'lucide-react';

const icons = {
    "Investor": <PieChart size={32} color="#8b5cf6" />,
    "Saver": <Wallet size={32} color="#10b981" />,
    "High Spender": <CreditCard size={32} color="#f43f5e" />,
    "Credit Elite": <Shield size={32} color="#f59e0b" />,
    "Balanced Customer": <UserCheck size={32} color="#3b82f6" />
};

const PersonaPanel = ({ persona }) => {
    if (!persona) return null;

    return (
        <motion.div
            className="glass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
        >
            <h3 style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Customer Persona</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', marginRight: '15px' }}>
                    {icons[persona] || <UserCheck size={32} />}
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{persona}</h2>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Behavioral Segment</span>
                </div>
            </div>
        </motion.div>
    );
};

export default PersonaPanel;
