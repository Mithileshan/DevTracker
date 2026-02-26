import mongoose, { Schema, Document } from 'mongoose';
import { createHash } from 'crypto';

interface IInvite extends Document {
  _id: mongoose.Types.ObjectId;
  orgId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  email: string;
  role: 'org_owner' | 'org_admin' | 'org_member';
  tokenHash: string; // SHA-256 hashed token (never store raw token)
  expiresAt: Date;
  acceptedAt?: Date;
  acceptedBy?: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const inviteSchema = new Schema<IInvite>(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['org_owner', 'org_admin', 'org_member'],
      required: true,
      default: 'org_member',
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true, // TTL index
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    acceptedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL Index: automatically delete expired, unaccepted invites after 7 days
inviteSchema.index(
  { expiresAt: 1 },
  { 
    expireAfterSeconds: 0,
    partialFilterExpression: { acceptedAt: null }
  }
);

// Prevent duplicate invites for same email + org
inviteSchema.index({ orgId: 1, email: 1 }, { unique: true, partialFilterExpression: { acceptedAt: null } });

/**
 * Generate a raw token (client-facing)
 * Store only the hash in DB
 */
export function generateInviteToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Hash a token (for storage)
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export default mongoose.model<IInvite>('Invite', inviteSchema);
