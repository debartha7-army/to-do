import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import discoveriesRoutes from './routes/discoveriesRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import deleteRoutes from './routes/deleteRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import socialRoutes from './routes/socialRoutes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath = path.resolve(__dirname, '../../frontend/dist');

const clientOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: (origin, callback) => {
    // Requests without an Origin header include server-to-server calls, curl, and Postman.
    if (!origin || clientOrigins.includes(origin) || (!isProduction && origin.startsWith('http://localhost:'))) {
      callback(null, true);
    } else {
      callback(new Error('Origin is not allowed by CORS.'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/discoveries', discoveriesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/social', socialRoutes);
// DELETE /api/:kind/:id
app.use('/api', deleteRoutes);

// Render runs this Express process at the public URL. When the React build is
// present, serve it here so visiting `/` loads Orbit Notes rather than an API 404.
app.use(express.static(frontendDistPath));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Orbit Notes route not found: ${req.method} ${req.path}` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[App] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error in Orbit Notes API.' });
});

export default app;
