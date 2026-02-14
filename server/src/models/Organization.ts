import mongoose, { Schema, Document } from 'mongoose';
import { IOrganization } from 'shared/types';

interface IOrganizationDocument extends Omit<IOrganization, '_id'>, Document {}

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an organization name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Organization = mongoose.model<IOrganizationDocument>(
  'Organization',
  organizationSchema
);
