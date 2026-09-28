import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import eventsRoutes from './routes/eventsRoutes.js';
import discoveriesRoutes from './routes/discoveriesRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import deleteRoutes from './routes/deleteRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import socialRoutes from './routes/socialRoutes.js';

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching frontend
    if (!origin || origin === clientOrigin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev, configurable for production
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
