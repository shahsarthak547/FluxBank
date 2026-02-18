import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Mic, BarChart2, Settings, Activity, Bell } from 'lucide-react';
import NotificationPanel from '../NotificationPanel';
import '../../styles/dashboard.css';

const Sidebar = ({ onToggleNotifications }) => {
    return (
        <div className="glass-card sidebar-nav" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>
                    <Activity size={24} style={{ verticalAlign: 'middle', marginRight: '8px', color: '#00ffcc' }} />
                    FluxBank
                </h2>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} /> Overview
                </NavLink>
                <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} /> Customers
                </NavLink>
                <NavLink to="/recommendations" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileText size={20} /> Recommendations
                </NavLink>
                <NavLink to="/voice-ai" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Mic size={20} /> Voice Intelligence
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <BarChart2 size={20} /> Analytics
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} /> Settings
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div
                    onClick={onToggleNotifications}
                    className="nav-item"
                    style={{ cursor: 'pointer', marginBottom: '10px', color: '#3b82f6' }}
                >
                    <Bell size={20} /> Notifications
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Admin User</div>
                <div style={{ fontSize: '0.7rem', color: '#00ffcc' }}>● System Online</div>
            </div>
        </div>
    );
};

const Layout = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="app-layout">
            <aside className="app-sidebar">
                <Sidebar onToggleNotifications={() => setShowNotifications(!showNotifications)} />
            </aside>
            <main className="app-main">
                <Outlet />
            </main>
            <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
        </div>
    );
};

export default Layout;
