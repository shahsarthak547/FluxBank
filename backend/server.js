const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const ML_SERVICE_URL = 'http://localhost:5000/predict';

// Placeholder for customer data
let customers = [];

// Load customers on startup
const customersPath = path.join(__dirname, '../data/customers.csv');
fs.createReadStream(customersPath)
    .pipe(csv({
        mapHeaders: ({ header }) => header.trim().replace(/^\uFEFF/, '') // Remove BOM and whitespace
    }))
    .on('data', (data) => {
        if (customers.length === 0) console.log('First row keys:', Object.keys(data));
        customers.push(data);
    })
    .on('end', () => {
        console.log(`Loaded ${customers.length} customers from CSV.`);
    })
    .on('error', (err) => {
        console.error('Error reading CSV:', err);
    });

// Routes
// separate logic is better, but for simplicity I will define here or import?
const recommendRoute = require('./routes/recommend');

// API to get customers
app.get('/api/customers', (req, res) => {
    console.log(`GET /api/customers called. Serving ${customers.length} customers.`);
    // Return a subset or all, maybe with pagination or search
    // For now, return first 50 or so to avoid huge payload if CSV is big
    res.json(customers.slice(0, 50));
});

// Root route to show status
app.get('/', (req, res) => {
    res.send('Backend AI Agent Server is Running. Use /api/customers or /api/recommend');
});

// API for recommendation
// --- Routes ---
const recommendRoutes = require('./routes/recommend');
app.use('/api/recommend', recommendRoutes(ML_SERVICE_URL));

app.post('/api/voice/analyze', async (req, res) => {
    try {
        // Forward the entire body (text, stage, etc.) to the correct ML endpoint
        // ML_SERVICE_URL is .../predict, so we strip that to get base
        const mlBase = ML_SERVICE_URL.replace('/predict', '');
        const mlResponse = await axios.post(`${mlBase}/analyze_sentiment`, req.body);
        res.json(mlResponse.data);
    } catch (error) {
        console.error("Voice analysis error:", error.message);
        res.status(500).json({ error: "Analysis failed" });
    }
});


app.listen(PORT, () => {
    console.log(`Backend Server running on http://localhost:${PORT}`);
});
