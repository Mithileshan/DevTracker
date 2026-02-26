import { Router, Request, Response, NextFunction } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
const authController = new AuthController();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req: Request, res: Response, next: NextFunction) => authController.register(req, res, next));

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', (req: Request, res: Response, next: NextFunction) => authController.login(req, res, next));

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', (req: Request, res: Response, next: NextFunction) => authController.refresh(req, res, next));

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, (req: Request, res: Response, next: NextFunction) => authController.getCurrentUser(req, res, next));

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, (req: Request, res: Response, next: NextFunction) => authController.logout(req, res, next));

export default router;
