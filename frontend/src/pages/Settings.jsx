import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
    const [settings, setSettings] = useState({
        voiceEngine: true,
        highConfidenceThreshold: 80,
        emailNotifications: true,
        darkMode: true
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="settings-page">
            <h1 style={{ marginBottom: '30px' }}>System Configuration</h1>
            <div className="glass-card" style={{ maxWidth: '600px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                        <h3>AI Voice Engine</h3>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Enable or disable automated voice calls</div>
                    </div>
                    <div
                        onClick={() => handleToggle('voiceEngine')}
                        style={{
                            width: '50px', height: '26px', background: settings.voiceEngine ? '#10b981' : '#334155',
                            borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                        }}
                    >
                        <motion.div
                            layout
                            style={{
                                width: '22px', height: '22px', background: 'white', borderRadius: '50%',
                                position: 'absolute', top: '2px', left: settings.voiceEngine ? '26px' : '2px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                        <h3>Email Notifications</h3>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Send daily summary reports</div>
                    </div>
                    <div
                        onClick={() => handleToggle('emailNotifications')}
                        style={{
                            width: '50px', height: '26px', background: settings.emailNotifications ? '#3b82f6' : '#334155',
                            borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                        }}
                    >
                        <motion.div
                            layout
                            style={{
                                width: '22px', height: '22px', background: 'white', borderRadius: '50%',
                                position: 'absolute', top: '2px', left: settings.emailNotifications ? '26px' : '2px'
                            }}
                        />
                    </div>
                </div>

                <div>
                    <h3>Confidence Threshold</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <input
                            type="range"
                            min="50" max="95"
                            value={settings.highConfidenceThreshold}
                            onChange={(e) => setSettings({ ...settings, highConfidenceThreshold: e.target.value })}
                            style={{ width: '100%' }}
                        />
                        <span style={{ fontWeight: 'bold', width: '40px' }}>{settings.highConfidenceThreshold}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
