import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Mic, Activity, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const Overview = () => {
    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalRecommendations: 0,
        avgProbability: 0,
        voiceEngineStatus: 'ACTIVE'
    });

    const activityData = [
        { time: '9 AM', activity: 24 },
        { time: '10 AM', activity: 45 },
        { time: '11 AM', activity: 78 },
        { time: '12 PM', activity: 56 },
        { time: '1 PM', activity: 42 },
        { time: '2 PM', activity: 67 },
        { time: '3 PM', activity: 89 },
        { time: '4 PM', activity: 54 },
    ];

    useEffect(() => {
        // Mock fetching stats or actually fetch from backend if available
        // For now, let's just get customer count
        api.getCustomers().then(data => {
            setStats(prev => ({
                ...prev,
                totalCustomers: data.length,
                totalRecommendations: Math.floor(Math.random() * 50) + 10, // Mock
                avgProbability: 78 // Mock
            }));
        });
    }, []);

    const cards = [
        { title: 'Total Customers', value: stats.totalCustomers, icon: <Users size={24} color="#3b82f6" />, color: '#3b82f6' },
        { title: 'Recommendations Today', value: stats.totalRecommendations, icon: <FileText size={24} color="#8b5cf6" />, color: '#8b5cf6' },
        { title: 'Avg Conversion Prob.', value: `${stats.avgProbability}%`, icon: <TrendingUp size={24} color="#10b981" />, color: '#10b981' },
        { title: 'Voice Engine Status', value: stats.voiceEngineStatus, icon: <Mic size={24} color="#ec4899" />, color: '#ec4899' },
    ];

    return (
        <div className="overview-page">
            <h1 style={{ marginBottom: '30px' }}>Dashboard Overview</h1>
            <div className="panel-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        className="glass-card metric-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div style={{ background: `rgba(${parseInt(card.color.slice(1, 3), 16)}, ${parseInt(card.color.slice(3, 5), 16)}, ${parseInt(card.color.slice(5, 7), 16)}, 0.1)`, padding: '15px', borderRadius: '50%', marginBottom: '15px' }}>
                            {card.icon}
                        </div>
                        <h3 style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{card.title}</h3>
                        <div className="metric-value" style={{ color: 'white' }}>{card.value}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="glass-card">
                    <h3>System Activity</h3>
                    <div style={{ height: '200px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="activity" stroke="#3b82f6" fillOpacity={1} fill="url(#colorActivity)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="glass-card">
                    <h3>Recent Alerts</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>High Churn Risk: Customer C005</span>
                            <span style={{ color: '#f43f5e' }}>Urgent</span>
                        </li>
                        <li style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Voice Engine: Sentiment Negative</span>
                            <span style={{ color: '#f59e0b' }}>Warning</span>
                        </li>
                        <li style={{ padding: '10px 0', display: 'flex', justifyContent: 'space-between' }}>
                            <span>New Model Deployed</span>
                            <span style={{ color: '#10b981' }}>Info</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Overview;
