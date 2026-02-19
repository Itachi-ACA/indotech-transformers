import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

import { initDatabase } from './db.js';
import formRoutes from './routes/forms.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy (needed for Render/Heroku behind reverse proxy)
if (isProduction) app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: isProduction
        ? (process.env.BASE_URL || true)
        : ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
}));
app.use(express.json());

// Session configuration - 30 minute expiry
app.use(session({
    secret: process.env.SESSION_SECRET || 'indotech-secret-key-2024-secure',
    name: 'indotech_session',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
    },
}));

// API Routes
app.use('/api/forms', formRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Serve static frontend in production
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDist, 'index.html'));
    }
});

async function generateQR() {
    const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
    const qrPath = path.join(__dirname, '..', 'qr-code.png');
    try {
        await QRCode.toFile(qrPath, baseUrl, {
            width: 400,
            margin: 2,
            color: { dark: '#00d4ff', light: '#0a0a0f' },
        });
        console.log(`📱 QR Code generated: ${qrPath}`);
        console.log(`   Points to: ${baseUrl}`);
    } catch (err) {
        console.error('QR generation failed:', err.message);
    }
}

async function start() {
    await initDatabase();

    app.listen(PORT, async () => {
        console.log('');
        console.log('╔══════════════════════════════════════════════╗');
        console.log('║   INDOTECH TRANSFORMERS LTD                  ║');
        console.log('║   Data Collection Server                     ║');
        console.log('╠══════════════════════════════════════════════╣');
        console.log(`║   🌐 Server:    http://localhost:${PORT}        ║`);
        console.log(`║   📊 Admin:     http://localhost:${PORT}/internal ║`);
        console.log('║   🔑 Creds:     admin / indotech@4321         ║');
        console.log('╚══════════════════════════════════════════════╝');
        console.log('');
        await generateQR();
    });
}

start().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
