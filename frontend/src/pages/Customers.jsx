import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CustomerSelector from '../components/CustomerSelector';
import RecommendationPanel from '../components/RecommendationPanel';
import PersonaPanel from '../components/PersonaPanel';
import ChannelPanel from '../components/ChannelPanel';
import VoiceEnginePanel from '../components/VoiceEnginePanel';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getCustomers()
            .then(data => {
                setCustomers(data);
                setInitialLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Failed to load customers.");
                setInitialLoading(false);
            });
    }, []);

    const handleSelectCustomer = async (customer) => {
        setSelectedCustomer(customer);
        setLoading(true);
        setRecommendation(null);
        try {
            console.log("Fetching recommendation for:", customer.customer_id);
            const res = await api.getRecommendation(customer);
            console.log("Recommendation received:", res);
            setRecommendation(res);
        } catch (error) {
            console.error("Error getting recommendation:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px', height: 'calc(100vh - 60px)' }}>
            <CustomerSelector
                customers={customers}
                onSelect={handleSelectCustomer}
                selectedId={selectedCustomer?.customer_id}
            />

            <div style={{ overflowY: 'auto', paddingRight: '10px' }}>
                <h1 style={{ marginBottom: '20px' }}>Customer Details</h1>

                {!selectedCustomer && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                        Select a customer from the list to view their profile and AI recommendations.
                    </div>
                )}

                {selectedCustomer && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-card">
                            <h3 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Profile</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedCustomer.customer_id}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Age: {selectedCustomer.age} | Salary: ${selectedCustomer.salary}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{selectedCustomer.credit_score}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Credit Score</div>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Savings</div>
                                    <div style={{ fontWeight: 'bold' }}>${selectedCustomer.savings}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Monthly Exp.</div>
                                    <div style={{ fontWeight: 'bold' }}>${selectedCustomer.monthly_expense}</div>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Debt Ratio</div>
                                    <div style={{ fontWeight: 'bold' }}>{selectedCustomer.debt_ratio}</div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card">
                            <h3 style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Last Interaction</h3>
                            <p style={{ fontStyle: 'italic', color: '#e2e8f0', marginTop: '10px' }}>"{selectedCustomer.last_chat_text}"</p>
                        </div>

                        {loading && (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div className="glow-effect" style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6', margin: '0 auto' }}></div>
                            </div>
                        )}

                        {recommendation && !loading && (
                            <>
                                <RecommendationPanel recommendation={recommendation.recommendation} />
                                <div className="panel-row">
                                    <PersonaPanel persona={recommendation.insights.persona} />
                                    <ChannelPanel channel={recommendation.insights.channel} />
                                </div>
                                {recommendation.insights.voice_engine && (
                                    <VoiceEnginePanel voiceData={recommendation.insights.voice_engine} />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Customers;
