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

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

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
