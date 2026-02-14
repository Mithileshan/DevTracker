import jwt from 'jsonwebtoken';

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = (payload: ITokenPayload): ITokens => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;
  const accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets not configured');
  }

  const accessToken = jwt.sign(payload, accessSecret as any, {
    expiresIn: accessExpiry,
  } as any);

  const refreshToken = jwt.sign(payload, refreshSecret as any, {
    expiresIn: refreshExpiry,
  } as any);

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): ITokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error('JWT access secret not configured');

  try {
    return jwt.verify(token, secret) as ITokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): ITokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error('JWT refresh secret not configured');

  try {
    return jwt.verify(token, secret) as ITokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
