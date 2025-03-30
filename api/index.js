// Punkt wejściowy dla funkcji serverless Vercel
import express from 'express';
import { configureServer } from '../dist/config/server.config.js';
import { connectDB } from '../dist/config/db.config.js';
import { configureRoutes } from '../dist/routes/index.js';
import { configureGoogleSignIn } from '../dist/middleware/google.middleware.js';
import { configureStaticFiles } from '../dist/middleware/static.middleware.js';
import errorHandler from '../dist/middleware/error.middleware.js';
import cors from 'cors';

// Inicjalizacja aplikacji Express
const app = express();

// Podstawowa diagnostyka
app.get('/diagnostic', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Diagnostyka serwera działa',
    env: process.env.NODE_ENV,
    mongodb_uri: process.env.MONGODB_URI ? 'Skonfigurowane' : 'Brak konfiguracji'
  });
});

// Konfiguracja CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400
}));

// Obsługa preflight requests
app.options('*', (req, res) => {
  console.log(`Obsługa OPTIONS dla: ${req.originalUrl}`);
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.status(200).send();
});

// Logowanie requestów API
app.use('/api', (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Konfiguracja middlewares i routes
configureServer(app);
configureRoutes(app);
configureGoogleSignIn(app);
configureStaticFiles(app);
app.use(errorHandler);

// Podłączenie do bazy danych
connectDB();

// Eksport funkcji serverless dla Vercel
export default app; 