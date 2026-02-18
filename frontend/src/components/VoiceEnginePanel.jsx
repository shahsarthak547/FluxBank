import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Radio } from 'lucide-react';

const VoiceEnginePanel = ({ voiceData }) => {
    if (!voiceData) return null;

    const { voice_call_status, dynamic_script, detected_sentiment } = voiceData;

    return (
        <motion.div
            className="glass-card"
            style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(30, 41, 59, 0.7))' }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ color: '#ec4899', margin: 0 }}><Mic size={18} style={{ marginRight: '5px', verticalAlign: 'text-bottom' }} /> AI Voice Engine</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="glow-effect" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ec4899', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.8rem', color: '#ec4899' }}>{voice_call_status}</span>
                </div>
            </div>

            <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Sentiment: </span>
                    <span style={{ fontWeight: 'bold', color: 'white' }}>{detected_sentiment}</span>
                </div>
                {voiceData.recommended_follow_up && (
                    <div>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Next Action: </span>
                        <span style={{ fontWeight: 'bold', color: '#10b981' }}>{voiceData.recommended_follow_up}</span>
                    </div>
                )}
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                <span style={{ fontSize: '0.7rem', color: '#ec4899', display: 'block', marginBottom: '5px' }}>GENERATED SCRIPT</span>
                <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    "{dynamic_script}"
                </p>
            </div>
        </motion.div>
    );
};

export default VoiceEnginePanel;
