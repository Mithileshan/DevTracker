import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, ITokenPayload } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/errors';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
