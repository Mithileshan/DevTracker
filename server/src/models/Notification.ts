import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from 'shared/types';

interface INotificationDocument extends Omit<INotification, '_id'>, Document {}

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    type: {
      type: String,
      enum: ['ticket_assigned', 'ticket_mentioned', 'comment_mentioned', 'status_changed'],
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  }
);

// Index for user notifications
notificationSchema.index({ userId: 1, createdAt: -1 });

export const Notification = mongoose.model<INotificationDocument>(
  'Notification',
  notificationSchema
);
