import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';

app.use(express.static(__dirname));
app.use(express.json());

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || `http://localhost:${process.env.PORT || 3000}`;

app.use((req, res, next) => {
    const requestOrigin = req.headers.origin;
    if (requestOrigin && requestOrigin === ALLOWED_ORIGIN) {
        res.header('Access-Control-Allow-Origin', requestOrigin);
        res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.post('/api/generate', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        if (!req.body.prompt) {
            throw new Error('No prompt provided');
        }

        console.log('Sending request to model backend...');

        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'qwen2.5:0.5b',
                prompt: req.body.prompt,
                stream: false
            })
        });

        console.log('Model backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Model backend error:', errorText);
            throw new Error(`Model API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Model response:', {
            model: data.model,
            response_length: data.response?.length
        });

        res.json({
            response: data.response,
            model: data.model
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Failed to communicate with model API'
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Environment:', {
        nodeEnv: process.env.NODE_ENV,
        ollamaApiUrl: OLLAMA_API_URL,
        ollamaModel: process.env.OLLAMA_MODEL,
        port: PORT
    });
});
