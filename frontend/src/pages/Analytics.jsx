import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    // Mock Data
    const productData = [
        { name: 'Home Loan', value: 400 },
        { name: 'Credit Card', value: 300 },
        { name: 'Personal Loan', value: 300 },
        { name: 'Investments', value: 200 },
    ];

    const personaData = [
        { name: 'Investor', value: 400 },
        { name: 'Saver', value: 300 },
        { name: 'Spender', value: 300 },
        { name: 'Elite', value: 200 },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="analytics-page">
            <h1 style={{ marginBottom: '30px' }}>Analytics & Insights</h1>

            <div className="panel-row" style={{ marginBottom: '30px' }}>
                <div className="glass-card" style={{ height: '400px' }}>
                    <h3>Product Distribution</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={productData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="glass-card" style={{ height: '400px' }}>
                    <h3>Persona Segmentation</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={personaData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {personaData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card" style={{ height: '300px' }}>
                <h3>Channel Performance</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={[
                            { name: 'Email', sent: 400, opened: 240, clicked: 100 },
                            { name: 'SMS', sent: 300, opened: 139, clicked: 80 },
                            { name: 'In-App', sent: 200, opened: 180, clicked: 120 },
                            { name: 'Push', sent: 278, opened: 190, clicked: 90 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <Legend />
                            <Bar dataKey="sent" fill="#8884d8" />
                            <Bar dataKey="opened" fill="#82ca9d" />
                            <Bar dataKey="clicked" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
