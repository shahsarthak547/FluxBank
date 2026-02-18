import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Smartphone, Bell, MessageCircle } from 'lucide-react';

const icons = {
    "Email": <Mail size={32} color="#3b82f6" />,
    "App Notification": <Bell size={32} color="#f59e0b" />,
    "In-App Notification": <Bell size={32} color="#f59e0b" />,
    "SMS": <MessageCircle size={32} color="#10b981" />,
    "AI Voice Call": <Smartphone size={32} color="#ec4899" />
};

const ChannelPanel = ({ channel }) => {
    if (!channel) return null;

    return (
        <motion.div
            className="glass-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
        >
            <h3 style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Best Channel</h3>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '50%', marginRight: '15px' }}>
                    {icons[channel] || <Mail size={32} />}
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{channel}</h2>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Highest Conversion Probability</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ChannelPanel;
