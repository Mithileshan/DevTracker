import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from 'shared/types';

interface IProjectDocument extends Omit<IProject, '_id'>, Document {}

const projectSchema = new Schema(
  {
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
    },
    key: {
      type: String,
      required: [true, 'Please provide a project key'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Unique project key per org
projectSchema.index({ orgId: 1, key: 1 }, { unique: true });

export const Project = mongoose.model<IProjectDocument>('Project', projectSchema);
