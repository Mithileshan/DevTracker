import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authenticate } from '@/middleware/authenticate';

const router = Router();
const authController = new AuthController();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', authenticate, (req, res, next) => authController.getCurrentUser(req, res, next));

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));

export default router;
