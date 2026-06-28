// server.js — Express + MongoDB backend
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
require('dotenv').config();

const contactRouter = require('./routes/contact');

const app = express();

/* ── Security ── */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGIN || '*' }));

/* ── Rate limiting ── */
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests, slow down.' });
app.use('/api/', limiter);

/* ── Body parsing ── */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* ── Static frontend ── */
app.use(express.static(path.join(__dirname, '../frontend')));

/* ── API routes ── */
app.use('/api/contact', contactRouter);

/* ── Health check ── */
app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

/* ── Catch-all → serve index.html (SPA) ── */
app.get('*', (_, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

/* ── Error handler ── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

/* ── DB + Start ── */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
