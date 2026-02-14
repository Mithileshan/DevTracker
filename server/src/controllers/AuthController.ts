import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/AuthService';
import { LoginSchema, RegisterSchema, RefreshTokenSchema } from 'shared/schemas';
import { ValidationError } from '@/utils/errors';
import { ApiSuccess } from 'shared/types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = RegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const { name, email, password } = parsed.data;
      const result = await authService.register(name, email, password);

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: ApiSuccess<any> = {
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
        message: 'Registration successful',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        const details = parsed.error.errors.map((e: any) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError('Validation failed', details);
      }

      const { email, password } = parsed.data;
      const result = await authService.login(email, password);

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: ApiSuccess<any> = {
        success: true,
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
        message: 'Login successful',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new ValidationError('No refresh token provided');
      }

      const result = await authService.refreshTokens(refreshToken);

      // Set new refresh token in HttpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const response: ApiSuccess<any> = {
        success: true,
        data: {
          accessToken: result.tokens.accessToken,
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ValidationError('User not authenticated');
      }

      const user = await authService.getCurrentUser(req.user.userId);

      const response: ApiSuccess<any> = {
        success: true,
        data: { user },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('refreshToken');

      const response: ApiSuccess<null> = {
        success: true,
        data: null,
        message: 'Logout successful',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
