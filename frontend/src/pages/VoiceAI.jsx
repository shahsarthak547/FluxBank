import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, Phone, PhoneOff, Activity, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

const VoiceAI = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [callStatus, setCallStatus] = useState('IDLE'); // IDLE, CALLING, CONNECTED, ENDED
    const [transcript, setTranscript] = useState([]);
    const [sentimentData, setSentimentData] = useState(null);
    const [isListening, setIsListening] = useState(false);

    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = async (event) => {
                const text = event.results[0][0].transcript;
                console.log("User said:", text);

                // Add user message to transcript
                // Calculate context based on current transcript length (before this new message is added)
                // If transcript has 1 item (AI Intro), this is the first response.
                const isFirstResponse = transcript.length === 1;
                const context = {
                    stage: isFirstResponse ? 'intro_response' : 'conversation'
                };

                setTranscript(prev => [...prev, { sender: 'User', text }]);
                setProcessing(true);

                // Analyze sentiment
                try {
                    const analysis = await api.analyzeSentiment(text, context);
                    setSentimentData(analysis);
                    setProcessing(false);

                    // AI Responds
                    if (analysis.ai_response) {
                        setTranscript(prev => [...prev, { sender: 'AI', text: analysis.ai_response }]);
                        speak(analysis.ai_response);
                    } else {
                        // Fallback if no response text
                        speak("I see. Please go on.");
                    }
                } catch (err) {
                    console.error("Analysis failed", err);
                    setProcessing(false);
                    speak("I'm sorry, I didn't quite catch that. Could you repeat?");
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                setProcessing(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                // Don't auto-restart here, we wait for AI to speak. 
                // Unless we were just listening and it timed out silence?
                // For now, let the 'speak' onend handle the turn-taking.
            };
        }
    }, [callStatus]); // Re-bind if needed, but [] is usually fine if ref is stable.

    const speak = (text) => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = synthesisRef.current.getVoices();
            const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Microsoft Zira"));
            if (preferredVoice) utterance.voice = preferredVoice;

            utterance.onend = () => {
                // After AI finishes speaking, start listening to user again
                if (callStatus === 'CONNECTED') {
                    startListening();
                }
            };

            synthesisRef.current.speak(utterance);
        }
    };

    const startListening = () => {
        if (recognitionRef.current && callStatus === 'CONNECTED') {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                console.error("Mic error:", e);
            }
        }
    };

    const handleCall = () => {
        if (!phoneNumber) return;
        setCallStatus('CALLING');
        setTranscript([]);
        // Don't clear sentiment data immediately so previous call summary stays visible if needed, 
        // OR clear it but ensure new data comes in. 
        // User wants to see summary at END.
        // Let's clear it to avoid showing OLD data for a new call.
        setSentimentData(null);

        // Simulate connection delay
        setTimeout(() => {
            setCallStatus('CONNECTED');
            const intro = "Hello! I'm calling from FluxBank regarding a personalized offer for you. Am I speaking with the account holder?";
            setTranscript([{ sender: 'AI', text: intro }]);
            speak(intro);
        }, 1500);
    };

    const handleHangup = () => {
        setCallStatus('ENDED');
        if (recognitionRef.current) recognitionRef.current.stop();
        if (synthesisRef.current) synthesisRef.current.cancel();
    };

    return (
        <div className="voice-ai-page" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: '20px' }}>AI Voice Intelligence</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flex: 1 }}>

                {/* Left Panel: Softphone */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ marginBottom: '30px', position: 'relative' }}>
                        <div className={`glow-effect ${callStatus === 'CONNECTED' ? 'pulse' : ''}`}
                            style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: callStatus === 'CONNECTED' ? '#10b981' : callStatus === 'CALLING' ? '#fbbf24' : '#334155',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.5s ease'
                            }}>
                            <Phone size={50} color="white" />
                        </div>
                        {isListening && (
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                style={{ position: 'absolute', bottom: '-10px', right: '-10px', background: '#ec4899', padding: '12px', borderRadius: '50%', border: '4px solid #0f172a' }}>
                                <Mic size={24} color="white" />
                            </motion.div>
                        )}
                    </div>

                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>
                        {callStatus === 'IDLE' ? 'Ready to Call' : callStatus === 'CALLING' ? 'Dialing...' : callStatus === 'CONNECTED' ? 'Connected' : 'Call Ended'}
                    </h2>

                    {callStatus === 'CONNECTED' && (
                        <div style={{ height: '30px', marginBottom: '20px', color: '#ec4899', fontWeight: 'bold' }}>
                            {processing ? "Thinking..." : isListening ? "Listening... Speak Now" : "AI is speaking..."}
                        </div>
                    )}

                    {callStatus === 'IDLE' ? (
                        <>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                                <input
                                    type="text"
                                    placeholder="Enter Customer Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    style={{ padding: '10px 15px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', width: '200px' }}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={handleCall}
                                style={{ background: '#10b981', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <Phone size={24} /> Call Now
                            </motion.button>
                        </>
                    ) : callStatus === 'ENDED' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ marginBottom: '20px', color: '#94a3b8' }}>Call Summary Generated</div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={() => setCallStatus('IDLE')}
                                style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer' }}
                            >
                                Start New Call
                            </motion.button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {callStatus === 'CONNECTED' && !isListening && !processing && (
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    onClick={startListening}
                                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '15px', borderRadius: '50%', cursor: 'pointer' }}
                                    title="Tap to Speak"
                                >
                                    <Mic size={24} />
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                onClick={handleHangup}
                                style={{ background: '#f43f5e', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '30px', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                            >
                                <PhoneOff size={24} /> End Call
                            </motion.button>
                        </div>
                    )}
                </div>

                {/* Right Panel: Live Insights */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Transcript */}
                    <div className="glass-card" style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column-reverse' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {transcript.map((msg, idx) => (
                                <div key={idx} style={{
                                    alignSelf: msg.sender === 'User' ? 'flex-end' : 'flex-start',
                                    background: msg.sender === 'User' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.1)',
                                    padding: '10px 15px',
                                    borderRadius: '12px',
                                    maxWidth: '80%'
                                }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px' }}>{msg.sender}</div>
                                    <div>{msg.text}</div>
                                </div>
                            ))}
                        </div>
                        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginBottom: '10px', color: '#94a3b8' }}>
                            <MessageSquare size={18} style={{ verticalAlign: 'middle' }} /> {callStatus === 'ENDED' ? 'Final Transcript' : 'Live Transcript'}
                        </h3>
                    </div>

                    {/* Real-time Analysis / Summary */}
                    <div className="glass-card" style={{ height: '220px' }}>
                        <h3 style={{ color: callStatus === 'ENDED' ? '#ec4899' : '#10b981' }}>
                            <Activity size={18} style={{ verticalAlign: 'middle' }} /> {callStatus === 'ENDED' ? 'Call Summary' : 'Real-time Sentiment'}
                        </h3>

                        {sentimentData ? (
                            <div style={{ marginTop: '20px' }}>
                                <div style={{ fontSize: '1rem', marginBottom: '5px' }}>
                                    {callStatus === 'ENDED' ? 'Final Sentiment Detected:' : 'Detected Sentiment:'}
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>{sentimentData.sentiment}</div>

                                <div style={{ marginTop: '20px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                        {callStatus === 'ENDED' ? 'Actionable Insight:' : 'Recommendation:'}
                                    </div>
                                    <div>Follow-up: <span style={{ color: '#ec4899', fontWeight: 'bold' }}>{sentimentData.recommended_follow_up}</span></div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ padding: '20px', color: '#64748b', textAlign: 'center' }}>
                                {callStatus === 'ENDED' ? 'No data collected during this call.' : 'Waiting for conversation data...'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceAI;
