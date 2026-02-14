import mongoose, { Schema, Document } from 'mongoose';
import { IProjectMembership, ProjectRole } from 'shared/types';

interface IProjectMembershipDocument extends Omit<IProjectMembership, '_id'>, Document {}

const projectMembershipSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ProjectRole),
      default: ProjectRole.DEVELOPER,
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

// Ensure unique membership per user per project
projectMembershipSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectMembership = mongoose.model<IProjectMembershipDocument>(
  'ProjectMembership',
  projectMembershipSchema
);
