# Indotech Transformers — Data Collection System

## Setup

```bash
cd client && npm install
cd ../server && npm install
```

## Development

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

## Production Build

```bash
cd client && npm run build
cd ../server && npm start
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `PORT` | Server port | `3001` |
| `SESSION_SECRET` | Session encryption key | (random default) |
| `SMTP_USER` | Gmail address for OTP emails | — |
| `SMTP_PASS` | Gmail App Password | — |
| `BASE_URL` | Public URL for QR code | `http://localhost:3001` |
