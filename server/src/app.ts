import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import { log } from '@/config/logger';
import { errorHandler } from '@/middleware/errorHandler';

// Routes
import authRoutes from '@/routes/auth';
import orgRoutes from '@/routes/orgs';
import projectRoutes from '@/routes/projects';
import ticketRoutes from '@/routes/tickets';
import commentRoutes from '@/routes/comments';
import notificationRoutes from '@/routes/notifications';

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DevTracker X API',
      version: '1.0.0',
      description: 'Production-ready SaaS bug tracker API',
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api',
        description: 'API Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/**/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const createApp = (): Application => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173';
  app.use(
    cors({
      origin: corsOrigin.split(','),
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs:
      parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10) || 15 * 60 * 1000, // 15 min
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10) || 100,
  });
  app.use('/api/', limiter);

  // Body parsing
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '10kb', extended: true }));
  app.use(cookieParser());

  // Request logging
  app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms', {
      stream: {
        write: (message: string) => log.info(message.trim()),
      },
    })
  );

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  // Swagger docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/orgs', orgRoutes);
  app.use('/api/orgs/:orgId/projects', projectRoutes);
  app.use('/api/orgs/:orgId/projects/:projectId/tickets', ticketRoutes);
  app.use('/api/tickets/:ticketId/comments', commentRoutes);
  app.use('/api/notifications', notificationRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Endpoint not found',
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
};
