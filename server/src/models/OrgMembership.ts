import mongoose, { Schema, Document } from 'mongoose';
import { IOrgMembership, OrgRole } from 'shared/types';

interface IOrgMembershipDocument extends Omit<IOrgMembership, '_id'>, Document {}

const orgMembershipSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(OrgRole),
      default: OrgRole.MEMBER,
    },
    joinedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  {
    timestamps: false,
  }
);

// Ensure unique membership per user per org
orgMembershipSchema.index({ orgId: 1, userId: 1 }, { unique: true });

export const OrgMembership = mongoose.model<IOrgMembershipDocument>(
  'OrgMembership',
  orgMembershipSchema
);
