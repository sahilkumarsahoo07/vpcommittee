import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import apiRoutes from './routes';
import { setupSwagger } from './docs/swagger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Trust reverse proxy (required for Render / Heroku / Netlify backend deployments)
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter — skip in development to avoid 429 during testing
const isDev = process.env.NODE_ENV !== 'production';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 500,
  skip: () => isDev,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 10000 : 20,
  skip: () => isDev,
  message: { success: false, message: 'Too many login attempts, please try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);

// Serve uploads static folder
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

// API Routes
app.use('/api', apiRoutes);

// Swagger Documentation UI
setupSwagger(app);

// Root Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    system: 'Vighnaharta Puja Committee Full-Stack Server',
    timestamp: new Date(),
  });
});

// Central Error Handler
app.use(errorHandler);

export default app;
