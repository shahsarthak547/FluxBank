const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock Services if needed
const personaService = require('../services/personaService');
const channelService = require('../services/channelService');

module.exports = (mlServiceUrl) => {
    router.post('/', async (req, res) => {
        try {
            const customerData = req.body;

            // Call Python ML Service
            const mlResponse = await axios.post(mlServiceUrl, customerData);
            const { product, confidence, explanation, persona, channel, voice_data } = mlResponse.data;

            // Enrich/Format Data if needed (Mock logic here or just pass through)
            // Example: Add some specific backend logic

            const enrichedResponse = {
                customer_id: customerData.customer_id,
                recommendation: {
                    product,
                    confidence,
                    explanation
                },
                insights: {
                    persona: persona || personaService.getPersona(customerData),
                    channel: channel || channelService.getOptimalChannel(customerData),
                    voice_engine: voice_data || null
                }
            };

            res.json(enrichedResponse);
        } catch (error) {
            console.error('Error calling ML service:', error.message);
            res.status(500).json({ error: 'Failed to generate recommendation', details: error.message });
        }
    });

    return router;
};
