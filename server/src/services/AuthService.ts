import { User } from '@/models/User';
import { OrgMembership } from '@/models/OrgMembership';
import { Organization } from '@/models/Organization';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { ConflictError, UnauthorizedError } from '@/utils/errors';
import { IUserPublic } from 'shared/types';

export class AuthService {
  async register(name: string, email: string, password: string) {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Create default organization for user
    const org = await Organization.create({
      name: `${name}'s Organization`,
      ownerId: user._id,
    });

    // Add user as owner of their organization
    await OrgMembership.create({
      orgId: org._id,
      userId: user._id,
      role: 'org_owner',
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      } as IUserPublic,
      tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user and select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      } as IUserPublic,
      tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
    });

    return { tokens };
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
    } as IUserPublic;
  }
}
